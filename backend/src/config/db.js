const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const connStr = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/roadsos';
    await mongoose.connect(connStr, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected successfully to ${connStr}`);
  } catch (err) {
    console.error(`MongoDB Connection Warning: ${err.message}`);
    console.log('Server is running in Offline/Sandbox mode.');
  }
};

module.exports = connectDB;
