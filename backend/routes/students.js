const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const { Parser } = require('json2csv');
const Drive = require('../models/Drive');

const upload = multer({ dest: 'uploads/' });

// Normalize fields for consistent deduplication
function normalize(student) {
  return {
    name: student.name.trim().toLowerCase(),
    class: student.class.trim().toUpperCase(),
    age: Number(student.age),
    vaccinated: [], // Assume no vaccination on bulk upload
  };
}

router.get('/', async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    console.error('Error fetching students:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// CREATE new student (with duplicate check)
// CREATE new student (with duplicate check)
router.post('/', async (req, res) => {
  try {
    const normalized = {
      name: req.body.name.trim().toLowerCase(),
      class: req.body.class.trim().toUpperCase(),
      age: Number(req.body.age),
      vaccinated: req.body.vaccinated || [],
    };

    const student = new Student(normalized);
    await student.save();

    res.status(201).json(student);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: 'Student already exists' });
    }
    console.error('Error adding student:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


// BULK UPLOAD students via CSV with deduplication and normalization
router.post('/bulk-upload', upload.single('file'), async (req, res) => {
  const results = [];

  try {
    // Parse the CSV
    await new Promise((resolve, reject) => {
      fs.createReadStream(req.file.path)
        .pipe(csv())
        .on('data', (data) => results.push(normalize(data)))
        .on('end', resolve)
        .on('error', reject);
    });

    fs.unlinkSync(req.file.path); // Cleanup temp file

    // Remove duplicates already in DB (based on name+class+age)
    const existingStudents = await Student.find({}, { name: 1, class: 1, age: 1 });
    const existingKeys = new Set(
      existingStudents.map(s => `${s.name}-${s.class}-${s.age}`)
    );

    const uniqueToInsert = results.filter(s => {
      const key = `${s.name}-${s.class}-${s.age}`;
      if (existingKeys.has(key)) return false;
      existingKeys.add(key);
      return true;
    });

    const inserted = await Student.insertMany(uniqueToInsert, {
      ordered: false,
    }).catch(err => {
      if (err.code === 11000) {
        console.warn('Some duplicates skipped.');
      } else {
        throw err;
      }
    });

    res.status(201).json({
      message: 'Bulk upload complete',
      totalUploaded: results.length,
      insertedCount: inserted?.length || 0,
      skippedDuplicates: results.length - (inserted?.length || 0),
    });

  } catch (err) {
    console.error('Bulk upload error:', err);
    res.status(500).json({ message: 'Error processing upload' });
  }
});


// GET /api/students/report
router.get('/report', async (req, res) => {
  try {
    const { vaccineName, export: exportType } = req.query;

    // Build query to find students vaccinated with given vaccineName (if filter applied)
    const matchVaccine = vaccineName ? { 'vaccinated.vaccineName': vaccineName } : {};

    // Aggregate students with vaccination records matching filter
    const pipeline = [
      { $unwind: '$vaccinated' },
      { $match: matchVaccine },
      {
        $project: {
          name: 1,
          class: 1,
          age: 1,
          vaccineName: '$vaccinated.vaccineName',
          date: '$vaccinated.date',
        },
      },
    ];

    const reportData = await Student.aggregate(pipeline);

    if (exportType === 'csv') {
      // Export CSV
      const fields = ['name', 'class', 'age', 'vaccineName', 'date'];
      const json2csvParser = new Parser({ fields });
      const csv = json2csvParser.parse(reportData);

      res.header('Content-Type', 'text/csv');
      res.attachment('vaccination_report.csv');
      return res.send(csv);
    }

    // Otherwise send JSON
    res.json(reportData);
  } catch (err) {
    console.error('Error generating report:', err);
    res.status(500).json({ message: 'Server error generating report' });
  }
});

// Mark student vaccinated for a drive
// Mark student vaccinated for a drive
router.post('/:studentId/vaccinate', async (req, res) => {
  try {
    const { studentId } = req.params;
    const { driveId } = req.body;

    if (!driveId) {
      return res.status(400).json({ message: 'driveId is required' });
    }

    // Find student by MongoDB _id
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Find drive by _id
    const drive = await Drive.findById(driveId);
    if (!drive) {
      return res.status(404).json({ message: 'Drive not found' });
    }

    // Check if already vaccinated for this drive
    const alreadyVaccinated = student.vaccinated.some(vax =>
      vax.driveId.equals(drive._id)
    );

    if (alreadyVaccinated) {
      return res.status(400).json({ message: 'Student already vaccinated for this drive' });
    }

    // Add vaccination record
    student.vaccinated.push({
      driveId: drive._id,
      vaccineName: drive.vaccineName,
      date: new Date(),
    });

    await student.save();

    res.json({ message: 'Vaccination recorded successfully', student });
  } catch (err) {
    console.error('Error marking vaccination:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
