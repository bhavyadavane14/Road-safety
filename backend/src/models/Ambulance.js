const mongoose = require('mongoose');

const AmbulanceSchema = new mongoose.Schema({
  vehicleNumber: { type: String, required: true, unique: true },
  driverName: { type: String, required: true },
  phone: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  status: { type: String, enum: ['available', 'busy', 'maintenance'], default: 'available' },
  eta: { type: Number, default: 0 }, // in minutes
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Ambulance', AmbulanceSchema);
