const mongoose = require('mongoose');

const cropSchema = new mongoose.Schema({
  name: { type: String, required: true },
  stock: { type: Number, required: true }, // in KG
  pricePerKg: { type: Number, required: true },
  location: { type: String, required: true },
  farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Crop', cropSchema);