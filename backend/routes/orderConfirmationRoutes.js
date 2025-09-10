const express = require('express');
const router = express.Router();
const OrderConfirmation = require('../models/OrderConfirmation');
const { protect, authorize } = require('../middleware/authMiddleware');

// @desc    Create a new order confirmation
// @route   POST /api/order-confirmations
// @access  Private (Farmer)
router.post('/', protect, authorize('farmer'), async (req, res) => {
  try {
    const { order } = req.body;
    const orderConfirmation = new OrderConfirmation({
      order,
    });
    const createdOrderConfirmation = await orderConfirmation.save();
    res.status(201).json(createdOrderConfirmation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// @desc    Get all order confirmations for a farmer
// @route   GET /api/order-confirmations/farmer
// @access  Private (Farmer)
router.get('/farmer', protect, authorize('farmer'), async (req, res) => {
  try {
    const orderConfirmations = await OrderConfirmation.find().populate({
      path: 'order',
      match: { farmer: req.user.id }
    });
    res.json(orderConfirmations.filter(oc => oc.order));
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
});

// @desc    Get all order confirmations for a customer
// @route   GET /api/order-confirmations/customer
// @access  Private (Customer)
router.get('/customer', protect, authorize('customer'), async (req, res) => {
  try {
    const orderConfirmations = await OrderConfirmation.find().populate({
      path: 'order',
      match: { customer: req.user.id }
    });
    res.json(orderConfirmations.filter(oc => oc.order));
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
});

module.exports = router;