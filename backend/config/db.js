const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // DEBUGGING LINE: Let's see what the app is trying to connect with.
    console.log("Attempting to connect with MONGO_URI:", process.env.MONGO_URI);

    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected...");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
