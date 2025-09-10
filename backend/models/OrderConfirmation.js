const mongoose = require('mongoose');

const orderConfirmationSchema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  status: { type: String, enum: ['confirmed', 'pending'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('OrderConfirmation', orderConfirmationSchema);