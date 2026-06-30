const mongoose = require('mongoose');

const EmergencyContactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  relation: { type: String }
});

const MedicalProfileSchema = new mongoose.Schema({
  bloodGroup: { type: String, default: '' },
  allergies: [{ type: String }],
  conditions: [{ type: String }],
  medications: [{ type: String }]
});

const VehicleDetailsSchema = new mongoose.Schema({
  vehicleType: { type: String, default: '' },
  model: { type: String, default: '' },
  licensePlate: { type: String, default: '' },
  insurance: { type: String, default: '' }
});

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin', 'first-responder'], default: 'user' },
  emergencyContacts: [EmergencyContactSchema],
  medicalProfile: MedicalProfileSchema,
  vehicleDetails: VehicleDetailsSchema,
  safetyScore: { type: Number, default: 100 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
