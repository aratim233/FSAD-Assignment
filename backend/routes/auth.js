const express = require('express');
const router = express.Router();

// Hardcoded login for coordinator
router.post('/login', (req, res) => {
  console.log('Login request body:', req.body);
  const { username, password } = req.body;
  if (username === 'admin' && password === 'password123') {
    return res.json({ token: 'fake-jwt-token', username: 'admin' });
  }
  res.status(401).json({ message: 'Invalid credentials' });
});


module.exports = router;