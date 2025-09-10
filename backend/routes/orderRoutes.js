const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Transaction = require('../models/Transaction');
const { protect, authorize } = require('../middleware/authMiddleware');

// @desc    Create a new order
// @route   POST /api/orders
// @access  Private (Customer)
router.post('/', protect, authorize('customer'), async (req, res) => {
  try {
    const { crop, farmer, quantity, totalPrice } = req.body;
    const order = new Order({
      crop,
      farmer,
      customer: req.user.id,
      quantity,
      totalPrice,
    });
    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// @desc    Get all orders for a farmer
// @route   GET /api/orders/farmer
// @access  Private (Farmer)
router.get('/farmer', protect, authorize('farmer'), async (req, res) => {
  try {
    const orders = await Order.find({ farmer: req.user.id }).populate('crop').populate('customer');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
});

// @desc    Get all orders for a customer
// @route   GET /api/orders/customer
// @access  Private (Customer)
router.get('/customer', protect, authorize('customer'), async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user.id }).populate('crop').populate('farmer');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
});

// @desc    Update an order status
// @route   PUT /api/orders/:id
// @access  Private (Farmer)
router.put('/:id', protect, authorize('farmer'), async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (order) {
      if (order.farmer.toString() !== req.user.id) {
        return res.status(403).json({ error: 'Not authorized to update this order' });
      }
      order.status = status;
      const updatedOrder = await order.save();

      if (status === 'confirmed') {
        const transaction = new Transaction({
          crop: order.crop,
          farmer: order.farmer,
          customer: order.customer,
          quantity: order.quantity,
          totalPrice: order.totalPrice,
        });
        await transaction.save();
      }

      res.json(updatedOrder);
    } else {
      res.status(404).json({ error: 'Order not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;