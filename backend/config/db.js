const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // DEBUGGING LINE: Let's see what the app is trying to connect with.
    console.log("Attempting to connect with MONGO_URI:", process.env.MONGO_URI);

    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected...");

    // Explicitly ensure indexes are created for the User model
    // This line was added to ensure the 2dsphere index is created.
    // It requires the User model to be imported and available.
    // For now, we'll comment it out to restore previous functionality.
    // const User = require('../models/User');
    // await User.createIndexes();
    // console.log("✅ User model indexes ensured.");

  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
