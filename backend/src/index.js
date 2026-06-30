const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Models for Seeding
const Hospital = require('./models/Hospital');
const Ambulance = require('./models/Ambulance');

dotenv.config();

const app = express();
const server = http.createServer(app);

// Socket.io integration
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.set('io', io);

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth');
const incidentRoutes = require('./routes/incidents');
const serviceRoutes = require('./routes/services');

app.use('/api/auth', authRoutes);
app.use('/api/incidents', incidentRoutes);
app.use('/api/services', serviceRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'RoadSOS AI API Gateway Active' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Socket Connections Handler
io.on('connection', (socket) => {
  console.log(`Socket Client Connected: ${socket.id}`);
  
  // Real-time tracking coordinator updates
  socket.on('update_ambulance_location', async (data) => {
    // Broadcast ambulance coordinate movement updates to all panels
    io.emit('ambulance_location_changed', data);
  });

  socket.on('disconnect', () => {
    console.log(`Socket Client Disconnected: ${socket.id}`);
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Seed Initial Hackathon Data
const seedInitialData = async () => {
  try {
    const hospitalCount = await Hospital.countDocuments();
    if (hospitalCount === 0) {
      console.log('Seeding initial Trauma Care Hospitals...');
      await Hospital.create([
        { name: 'Apollo Trauma Care Hospital', latitude: '12.97160', longitude: '77.59460', phone: '044-28290200', type: 'trauma', bedsAvailable: 12, address: 'Apollo Greams Road, Chennai' },
        { name: 'Fortis Emergency Center', latitude: '12.98000', longitude: '77.60000', phone: '044-42002288', type: 'general', bedsAvailable: 5, address: 'Fortis Malar, Adyar' },
        { name: 'IIT Madras Medical Clinic', latitude: '12.99000', longitude: '77.59000', phone: '044-22578000', type: 'specialized', bedsAvailable: 2, address: 'IIT Madras Campus' }
      ]);
    }

    const ambulanceCount = await Ambulance.countDocuments();
    if (ambulanceCount === 0) {
      console.log('Seeding emergency Ambulance units...');
      await Ambulance.create([
        { vehicleNumber: 'TN-07-AM-4620', driverName: 'Ramesh Singh', phone: '+91 99999 88888', latitude: 12.9725, longitude: 77.5955, status: 'available', eta: 5 },
        { vehicleNumber: 'TN-07-AM-1122', driverName: 'Karthik Raja', phone: '+91 88888 77777', latitude: 12.9850, longitude: 77.6010, status: 'available', eta: 8 }
      ]);
    }
  } catch (err) {
    console.warn(`Seeding warning (Safe to ignore if DB is offline): ${err.message}`);
  }
};

const PORT = process.env.PORT || 5000;

// Connect to DB and Start Listening
connectDB().then(() => {
  seedInitialData();
  server.listen(PORT, () => {
    console.log(`RoadSOS AI Server active on port ${PORT}`);
  });
});
