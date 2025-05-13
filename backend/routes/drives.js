const express = require('express');
const router = express.Router();
const Drive = require('../models/Drive');

router.post('/', async (req, res) => {
  const { vaccineName, date, availableDoses, applicableClasses } = req.body;
  const driveDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (driveDate < new Date(today.getTime() + 15 * 24 * 60 * 60 * 1000)) {
    return res.status(400).json({ message: 'Drive must be at least 15 days in the future' });
  }

  const overlap = await Drive.findOne({ date: driveDate });
  if (overlap) return res.status(400).json({ message: 'Drive already exists on this date' });

  const drive = new Drive({ vaccineName, date, availableDoses, applicableClasses });
  await drive.save();
  res.status(201).json(drive);
});

router.get('/', async (req, res) => {
  const drives = await Drive.find();
  res.json(drives);
});

router.put('/:id', async (req, res) => {
  const drive = await Drive.findById(req.params.id);
  if (!drive) return res.status(404).json({ message: 'Drive not found' });

  if (new Date(drive.date) < new Date()) {
    return res.status(400).json({ message: 'Cannot edit a past drive' });
  }

  Object.assign(drive, req.body);
  await drive.save();
  res.json(drive);
});


router.post('/:studentId/vaccinate', async (req, res) => {
  try {
    const { studentId } = req.params;
    const { driveId } = req.body;

    if (!driveId) return res.status(400).json({ message: 'driveId is required' });

    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    const drive = await Drive.findById(driveId);
    if (!drive) return res.status(404).json({ message: 'Drive not found' });

    const alreadyVaccinated = student.vaccinated.some(vax =>
      vax.driveId.equals(drive._id)
    );

    if (alreadyVaccinated) {
      return res.status(400).json({ message: 'Student already vaccinated for this drive' });
    }

    student.vaccinated.push({
      driveId: drive._id,
      vaccineName: drive.vaccineName,
      date: new Date(),
    });

    await student.save();

    res.json({ message: 'Vaccination recorded', student });
  } catch (err) {
    console.error('Vaccination error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

