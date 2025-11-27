const mongoose = require("mongoose");
const app = require("./server");
const colors = require("colors");

const MONGODB_URL = process.env.MONGODB_URL;
const PORT = process.env.PORT || 5173;

const connectDB = async () => {
  try {
    const { connection } = await mongoose.connect(MONGODB_URL);
    console.log(`✅ Connected to MongoDB: ${connection.host}`.bgMagenta);

    app.listen(PORT, () => {
      console.log(
        `🚀 Node Server Running in ${process.env.DEV_MODE || "development"} mode on port ${PORT}`.green
      );
    });
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`.red);
    process.exit(1);
  }
};

module.exports = connectDB;
