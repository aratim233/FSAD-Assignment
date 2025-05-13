const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const studentRoutes = require('./routes/students');
const driveRoutes = require('./routes/drives');
const authRoutes = require('./routes/auth');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const Student = require('./models/Student');

mongoose.connection.once('open', async () => {
  console.log('MongoDB connected');

  try {
    await Student.syncIndexes(); // 💥 This rebuilds the schema-defined indexes
    console.log('Indexes synced');
  } catch (err) {
    console.error('Index sync failed:', err.message);
  }
});

app.use('/api/students', studentRoutes);
app.use('/api/drives', driveRoutes);
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => res.send('School Vaccination API running...'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
