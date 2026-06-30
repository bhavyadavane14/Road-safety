const express = require('express');
const mongoose = require('mongoose');
const Incident = require('../models/Incident');

const router = express.Router();

// Sandbox in-memory incidents store
const inMemoryIncidents = [];

// Report Incident
router.post('/', async (req, res) => {
  const { latitude, longitude, address, description, imageUrl, severity, type } = req.body;

  if (mongoose.connection.readyState !== 1) {
    try {
      const aiAnalysis = {
        vehicleDamage: 'Deformed front bumper, windshield fractures, bumper displacement.',
        roadDamage: 'Surface scrapes, structural road barricade deformation.',
        detectedHazards: ['Oil leakage puddle', 'Slight cabin smoke', 'Obstructed left traffic lane'],
        severityScore: severity === 'critical' ? 88 : severity === 'high' ? 72 : 45,
        recommendations: [
          'Place reflective emergency triangles 50 meters back.',
          'Extinguish any sparks or electrical power immediately.',
          'Apply pressure to any casualty wounds using clean dressings.'
        ]
      };

      const mockIncident = {
        _id: 'mock_incident_' + Date.now(),
        latitude,
        longitude,
        address: address || 'Captured GPS Coordinate location',
        description,
        imageUrl: imageUrl || '',
        severity: severity || 'medium',
        type: type || 'accident',
        status: 'pending',
        aiAnalysis,
        createdAt: new Date()
      };

      inMemoryIncidents.unshift(mockIncident);

      const io = req.app.get('io');
      if (io) {
        io.emit('new_incident', mockIncident);
      }

      console.log(`\n--- TWILIO GATEWAY DISPATCH LOG (Sandbox) ---`);
      console.log(`[SMS Broadcast]: Emergency SOS reported at Lat: ${latitude}, Lng: ${longitude}`);
      console.log(`[Recipients]: Broadcasting coordinates link (https://maps.google.com/?q=${latitude},${longitude}) to User's 3 emergency contacts.`);
      console.log(`[Triage]: Hospital Apollo notified. Dispatching closest paramedical unit.\n`);

      return res.status(201).json({ message: 'Incident reported successfully', incident: mockIncident });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  try {
    // Generate simulated AI Vision analysis details
    const aiAnalysis = {
      vehicleDamage: 'Deformed front bumper, windshield fractures, bumper displacement.',
      roadDamage: 'Surface scrapes, structural road barricade deformation.',
      detectedHazards: ['Oil leakage puddle', 'Slight cabin smoke', 'Obstructed left traffic lane'],
      severityScore: severity === 'critical' ? 88 : severity === 'high' ? 72 : 45,
      recommendations: [
        'Place reflective emergency triangles 50 meters back.',
        'Extinguish any sparks or electrical power immediately.',
        'Apply pressure to any casualty wounds using clean dressings.'
      ]
    };

    const incident = new Incident({
      latitude,
      longitude,
      address: address || 'Captured GPS Coordinate location',
      description,
      imageUrl: imageUrl || '',
      severity: severity || 'medium',
      type: type || 'accident',
      aiAnalysis
    });

    await incident.save();

    // Broadcast update via Socket.io if available in app setup
    const io = req.app.get('io');
    if (io) {
      io.emit('new_incident', incident);
    }

    // Twilio SMS Logging Simulation
    console.log(`\n--- TWILIO GATEWAY DISPATCH LOG ---`);
    console.log(`[SMS Broadcast]: Emergency SOS reported at Lat: ${latitude}, Lng: ${longitude}`);
    console.log(`[Recipients]: Broadcasting coordinates link (https://maps.google.com/?q=${latitude},${longitude}) to User's 3 emergency contacts.`);
    console.log(`[Triage]: Hospital Apollo notified. Dispatching closest paramedical unit.\n`);

    res.status(201).json({ message: 'Incident reported successfully', incident });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Retrieve Incidents
router.get('/', async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.json(inMemoryIncidents.slice(0, 30));
  }
  try {
    const list = await Incident.find().sort({ createdAt: -1 }).limit(30);
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Urgent SOS trigger
router.post('/sos', async (req, res) => {
  const { latitude, longitude, description, severity } = req.body;

  if (mongoose.connection.readyState !== 1) {
    try {
      const mockIncident = {
        _id: 'mock_incident_' + Date.now(),
        latitude,
        longitude,
        description: description || 'Instant SOS Button Activator',
        severity: severity || 'critical',
        type: 'accident',
        address: 'GPS Coordinate lock',
        status: 'pending',
        aiAnalysis: {
          vehicleDamage: 'Telemetry-activated emergency pulse.',
          roadDamage: 'None reported',
          detectedHazards: ['Immediate distress call'],
          severityScore: 95,
          recommendations: ['Stay near vehicle if safe.', 'Open first-aid guidance instructions.']
        },
        createdAt: new Date()
      };

      inMemoryIncidents.unshift(mockIncident);

      const io = req.app.get('io');
      if (io) {
        io.emit('new_incident', mockIncident);
      }

      console.log(`\n🚨 --- CRITICAL SOS ALERT GATEWAY LOG (Sandbox) ---`);
      console.log(`[GPS Coordinates]: Lat ${latitude}, Lng ${longitude}`);
      console.log(`[Paramedic Dispatch]: Hail requested for Paramedic Unit 12 (ETA 5m).`);
      console.log(`[SMS Notification]: Broadcast link dispatched to emergency contacts via Twilio.\n`);

      return res.status(201).json({ message: 'SOS broadcasted to government emergency nodes.', incident: mockIncident });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  try {
    const incident = new Incident({
      latitude,
      longitude,
      description: description || 'Instant SOS Button Activator',
      severity: severity || 'critical',
      type: 'accident',
      address: 'GPS Coordinate lock',
      aiAnalysis: {
        vehicleDamage: 'Telemetry-activated emergency pulse.',
        roadDamage: 'None reported',
        detectedHazards: ['Immediate distress call'],
        severityScore: 95,
        recommendations: ['Stay near vehicle if safe.', 'Open first-aid guidance instructions.']
      }
    });

    await incident.save();

    const io = req.app.get('io');
    if (io) {
      io.emit('new_incident', incident);
    }

    console.log(`\n🚨 --- CRITICAL SOS ALERT GATEWAY LOG ---`);
    console.log(`[GPS Coordinates]: Lat ${latitude}, Lng ${longitude}`);
    console.log(`[Paramedic Dispatch]: Hail requested for Paramedic Unit 12 (ETA 5m).`);
    console.log(`[SMS Notification]: Broadcast link dispatched to emergency contacts via Twilio.\n`);

    res.status(201).json({ message: 'SOS broadcasted to government emergency nodes.', incident });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Resolve Incident
router.put('/:id', async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    const incident = inMemoryIncidents.find(i => i._id === req.params.id);
    if (!incident) {
      return res.status(404).json({ error: 'Incident not found' });
    }
    incident.status = 'resolved';

    const io = req.app.get('io');
    if (io) {
      io.emit('incident_resolved', incident);
    }

    return res.json({ message: 'Incident resolved', incident });
  }

  try {
    const incident = await Incident.findById(req.params.id);
    if (!incident) {
      return res.status(404).json({ error: 'Incident not found' });
    }
    incident.status = 'resolved';
    await incident.save();

    const io = req.app.get('io');
    if (io) {
      io.emit('incident_resolved', incident);
    }

    res.json({ message: 'Incident resolved', incident });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
