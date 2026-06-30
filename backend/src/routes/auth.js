const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'roadsos_secret_key_2026';

// Sandbox in-memory users array
const inMemoryUsers = [];

// Sign Up
router.post('/signup', async (req, res) => {
  const { name, email, password, phone } = req.body;

  if (mongoose.connection.readyState !== 1) {
    try {
      let existing = inMemoryUsers.find(u => u.email === email);
      if (existing) {
        return res.status(400).json({ error: 'User already exists with this email' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const mockUser = {
        _id: 'mock_user_' + Date.now(),
        name,
        email,
        password: hashedPassword,
        phone,
        role: 'citizen',
        medicalProfile: { bloodGroup: '', allergies: [], conditions: [], medications: [] },
        vehicleDetails: { vehicleType: '', model: '', licensePlate: '', insurance: '' },
        emergencyContacts: []
      };

      inMemoryUsers.push(mockUser);

      const token = jwt.sign({ userId: mockUser._id, role: mockUser.role }, JWT_SECRET, { expiresIn: '7d' });
      return res.status(201).json({ token, user: { name: mockUser.name, email: mockUser.email, phone: mockUser.phone, role: mockUser.role } });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  try {
    let existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      phone,
      medicalProfile: { bloodGroup: '', allergies: [], conditions: [], medications: [] },
      vehicleDetails: { vehicleType: '', model: '', licensePlate: '', insurance: '' }
    });

    await user.save();

    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user: { name: user.name, email: user.email, phone: user.phone, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (mongoose.connection.readyState !== 1) {
    try {
      const user = inMemoryUsers.find(u => u.email === email);
      if (!user) {
        return res.status(400).json({ error: 'Invalid login credentials' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: 'Invalid login credentials' });
      }

      const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
      return res.json({ token, user: { name: user.name, email: user.email, phone: user.phone, role: user.role } });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid login credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid login credentials' });
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { name: user.name, email: user.email, phone: user.phone, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get User Profile
router.get('/profile', auth, async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    const user = inMemoryUsers.find(u => u._id === req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User profile not found' });
    }
    // Return user without password
    const { password, ...userWithoutPassword } = user;
    return res.json(userWithoutPassword);
  }

  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User profile not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Profile (Medical, Contacts, Vehicle)
router.put('/profile', auth, async (req, res) => {
  const { medicalProfile, emergencyContacts, vehicleDetails } = req.body;

  if (mongoose.connection.readyState !== 1) {
    const user = inMemoryUsers.find(u => u._id === req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (medicalProfile) user.medicalProfile = medicalProfile;
    if (emergencyContacts) user.emergencyContacts = emergencyContacts;
    if (vehicleDetails) user.vehicleDetails = vehicleDetails;

    return res.json({ message: 'Profile updated successfully', user });
  }

  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (medicalProfile) user.medicalProfile = medicalProfile;
    if (emergencyContacts) user.emergencyContacts = emergencyContacts;
    if (vehicleDetails) user.vehicleDetails = vehicleDetails;

    await user.save();
    res.json({ message: 'Profile updated successfully', user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
