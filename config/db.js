const mongoose = require("mongoose");
const colors = require("colors");

const MONGODB_URL = process.env.MONGODB_URL;

const connectDB = async () => {
  try {
    const { connection } = await mongoose.connect(MONGODB_URL);
    console.log(`✅ Connected to MongoDB: ${connection.host}`.bgMagenta);
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`.red);
    process.exit(1); 
  }
};

module.exports = connectDB;
