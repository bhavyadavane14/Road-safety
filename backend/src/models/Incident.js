const mongoose = require('mongoose');

const AIAnalysisSchema = new mongoose.Schema({
  vehicleDamage: { type: String, default: '' },
  roadDamage: { type: String, default: '' },
  detectedHazards: [{ type: String }],
  severityScore: { type: Number, default: 0 },
  recommendations: [{ type: String }]
});

const IncidentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  address: { type: String, default: '' },
  description: { type: String, default: '' },
  severity: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'medium' },
  status: { type: String, enum: ['pending', 'responding', 'resolved'], default: 'pending' },
  type: { type: String, enum: ['accident', 'medical', 'fire', 'police'], default: 'accident' },
  imageUrl: { type: String, default: '' },
  aiAnalysis: AIAnalysisSchema,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Incident', IncidentSchema);
