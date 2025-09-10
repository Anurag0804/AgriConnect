const mongoose = require('mongoose');

const receiptSchema = new mongoose.Schema({
  orderConfirmation: { type: mongoose.Schema.Types.ObjectId, ref: 'OrderConfirmation', required: true },
  paymentStatus: { type: String, enum: ['paid', 'unpaid'], default: 'unpaid' }
}, { timestamps: true });

module.exports = mongoose.model('Receipt', receiptSchema);