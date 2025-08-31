const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  cropName: { type: String, required: true },
  weight: { type: Number, required: true },
  purchasePrice: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Inventory', inventorySchema);