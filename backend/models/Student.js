const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    class: { type: String, required: true },
    age: { type: Number, required: true },
    vaccinated: [
      {
        driveId: { type: mongoose.Schema.Types.ObjectId, ref: 'Drive' },
        vaccineName: String,
        date: Date,
      },
    ],
  },
  {
    collation: { locale: 'en', strength: 2 }, // 👈 Case-insensitive collation at schema level
  }
);

// 👇 This now works with collation
studentSchema.index({ name: 1, class: 1, age: 1 }, { unique: true });

module.exports = mongoose.model('Student', studentSchema);
