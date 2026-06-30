const mongoose = require('mongoose');

const HospitalSchema = new mongoose.Schema({
  name: { type: String, required: true },
  latitude: { type: String, required: true },
  longitude: { type: String, required: true },
  phone: { type: String, required: true },
  type: { type: String, enum: ['trauma', 'general', 'specialized'], default: 'trauma' },
  bedsAvailable: { type: Number, default: 0 },
  address: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Hospital', HospitalSchema);
