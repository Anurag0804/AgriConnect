const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  crop: { type: mongoose.Schema.Types.ObjectId, ref: 'Crop', required: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  quantity: { type: Number, required: true }, // in KG
  totalPrice: { type: Number, required: true },
  date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);