const express = require('express');
const router = express.Router();
const Receipt = require('../models/Receipt');
const { protect, authorize } = require('../middleware/authMiddleware');

// @desc    Create a new receipt
// @route   POST /api/receipts
// @access  Private (Farmer)
router.post('/', protect, authorize('farmer'), async (req, res) => {
  try {
    const { orderConfirmation } = req.body;
    const receipt = new Receipt({
      orderConfirmation,
    });
    const createdReceipt = await receipt.save();
    res.status(201).json(createdReceipt);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// @desc    Get all receipts for a farmer
// @route   GET /api/receipts/farmer
// @access  Private (Farmer)
router.get('/farmer', protect, authorize('farmer'), async (req, res) => {
  try {
    const receipts = await Receipt.find().populate({
      path: 'orderConfirmation',
      populate: {
        path: 'order',
        match: { farmer: req.user.id }
      }
    });
    res.json(receipts.filter(r => r.orderConfirmation && r.orderConfirmation.order));
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
});

// @desc    Get all receipts for a customer
// @route   GET /api/receipts/customer
// @access  Private (Customer)
router.get('/customer', protect, authorize('customer'), async (req, res) => {
  try {
    const receipts = await Receipt.find().populate({
      path: 'orderConfirmation',
      populate: {
        path: 'order',
        match: { customer: req.user.id }
      }
    });
    res.json(receipts.filter(r => r.orderConfirmation && r.orderConfirmation.order));
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
});

// @desc    Update a receipt payment status
// @route   PUT /api/receipts/:id
// @access  Private (Customer)
router.put('/:id', protect, authorize('customer'), async (req, res) => {
  try {
    const { paymentStatus } = req.body;
    const receipt = await Receipt.findById(req.params.id);

    if (receipt) {
      receipt.paymentStatus = paymentStatus;
      const updatedReceipt = await receipt.save();
      res.json(updatedReceipt);
    } else {
      res.status(404).json({ error: 'Receipt not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;