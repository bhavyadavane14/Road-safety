const express = require('express');
const mongoose = require('mongoose');
const Hospital = require('../models/Hospital');
const Ambulance = require('../models/Ambulance');

const router = express.Router();

// Sandbox default data lists
const defaultHospitals = [
  { _id: 'hosp1', name: 'Apollo Trauma Hospital', latitude: 12.9724, longitude: 77.5958, phone: '+91 80 2630 4050', type: 'government', bedsAvailable: 14, address: 'Richmond Road, Bengaluru, Karnataka' },
  { _id: 'hosp2', name: 'Fortis Emergency Care', latitude: 12.9780, longitude: 77.5910, phone: '+91 80 6620 2000', type: 'private', bedsAvailable: 9, address: 'Cunningham Road, Vasanth Nagar, Bengaluru, Karnataka' },
  { _id: 'hosp3', name: 'St. John’s Medical College', latitude: 12.9338, longitude: 77.6244, phone: '+91 80 2206 5000', type: 'government', bedsAvailable: 31, address: 'Sarjapur Road, Koramangala, Bengaluru, Karnataka' },
  { _id: 'hosp4', name: 'Manipal Emergency Center', latitude: 12.9592, longitude: 77.6444, phone: '+91 80 2502 4444', type: 'private', bedsAvailable: 19, address: 'HAL Old Airport Road, Bengaluru, Karnataka' }
];

const defaultAmbulances = [
  { _id: 'amb1', vehicleNumber: 'KA-01-EA-1080', driverName: 'Sunil Kumar', phone: '+91 98888 77771', latitude: 12.9716, longitude: 77.5946, status: 'available' },
  { _id: 'amb2', vehicleNumber: 'KA-03-EM-4521', driverName: 'Anil Gowda', phone: '+91 98888 77772', latitude: 12.9760, longitude: 77.6010, status: 'dispatched' },
  { _id: 'amb3', vehicleNumber: 'KA-05-ES-9988', driverName: 'Ravi Pillai', phone: '+91 98888 77773', latitude: 12.9650, longitude: 77.5870, status: 'available' }
];

// Helper to calculate approximate distance in km (Haversine formula)
const getDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};

// Fetch Nearby Hospitals
router.get('/hospitals', async (req, res) => {
  const { latitude, longitude } = req.query;
  if (!latitude || !longitude) {
    return res.status(400).json({ error: 'Latitude and Longitude queries are required.' });
  }

  if (mongoose.connection.readyState !== 1) {
    try {
      const mapped = defaultHospitals.map((h) => {
        const dist = getDistance(parseFloat(latitude), parseFloat(longitude), parseFloat(h.latitude), parseFloat(h.longitude));
        return {
          ...h,
          distance: parseFloat(dist.toFixed(2))
        };
      }).sort((a, b) => a.distance - b.distance);
      return res.json(mapped);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  try {
    const list = await Hospital.find();
    
    // Calculate distance and sort
    const mapped = list.map((h) => {
      const dist = getDistance(parseFloat(latitude), parseFloat(longitude), parseFloat(h.latitude), parseFloat(h.longitude));
      return {
        ...h.toObject(),
        distance: parseFloat(dist.toFixed(2))
      };
    }).sort((a, b) => a.distance - b.distance);

    res.json(mapped);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Fetch Nearby Ambulances
router.get('/ambulances', async (req, res) => {
  const { latitude, longitude } = req.query;
  if (!latitude || !longitude) {
    return res.status(400).json({ error: 'Latitude and Longitude queries are required.' });
  }

  if (mongoose.connection.readyState !== 1) {
    try {
      const mapped = defaultAmbulances.map((a) => {
        const dist = getDistance(parseFloat(latitude), parseFloat(longitude), parseFloat(a.latitude), parseFloat(a.longitude));
        return {
          ...a,
          distance: parseFloat(dist.toFixed(2))
        };
      }).sort((a, b) => a.distance - b.distance);
      return res.json(mapped);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  try {
    const list = await Ambulance.find();
    
    const mapped = list.map((a) => {
      const dist = getDistance(parseFloat(latitude), parseFloat(longitude), a.latitude, a.longitude);
      return {
        ...a.toObject(),
        distance: parseFloat(dist.toFixed(2))
      };
    }).sort((a, b) => a.distance - b.distance);

    res.json(mapped);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Seed or Add Hospital
router.post('/hospitals', async (req, res) => {
  const { name, latitude, longitude, phone, type, bedsAvailable, address } = req.body;
  try {
    const hospital = new Hospital({ name, latitude, longitude, phone, type, bedsAvailable, address });
    await hospital.save();
    res.status(201).json(hospital);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Seed or Add Ambulance
router.post('/ambulances', async (req, res) => {
  const { vehicleNumber, driverName, phone, latitude, longitude, status } = req.body;
  try {
    const ambulance = new Ambulance({ vehicleNumber, driverName, phone, latitude, longitude, status });
    await ambulance.save();
    res.status(201).json(ambulance);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
