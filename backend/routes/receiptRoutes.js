const express = require('express');
const router = express.Router();
const Receipt = require('../models/Receipt');
const Order = require('../models/Order'); // ✅ needed to fetch customer/farmer
const { protect, authorize } = require('../middleware/authMiddleware');

// @desc    Create a new receipt
// @route   POST /api/receipts
// @access  Private (Farmer)
router.post('/', protect, authorize('farmer'), async (req, res) => {
  try {
    const { order } = req.body;
    const orderDoc = await Order.findById(order).populate('customer farmer'); // table customer + farmer -> Receipt
    if (!orderDoc) return res.status(404).json({ error: 'Order not found' });

    const receipt = new Receipt({
      order,
      customer: orderDoc.customer,   // ✅ user = customer
      farmer: orderDoc.farmer,
      paymentStatus: 'unpaid'
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
  console.log("👨‍🌾 Farmer receipts request from user:", req.user);
  try {
    const receipts = await Receipt.find({ farmer: req.user.id })
      .populate({
        path: 'order',
        select: 'status totalPrice quantity',
        populate: [
          { path: 'customer', select: 'username' },
          { path: 'farmer', select: 'username' },
          { path: 'crop', select: 'name' }
        ]
      });
    res.json(receipts);
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
});

// @desc    Get all receipts for a customer
// @route   GET /api/receipts/customer
// @access  Private (Customer)
router.get('/customer', protect, authorize('customer'), async (req, res) => {
  console.log("🛒 Customer receipts request from user (decoded JWT payload):", req.user);
  try {
    const receipts = await Receipt.find({ customer: req.user.id })
      .populate({
        path: 'order',
        select: 'status totalPrice quantity',
        populate: [
          { path: 'customer', select: 'username' },
          { path: 'farmer', select: 'username' },
          { path: 'crop', select: 'name' }
        ]
      });
    console.log("✅ Found receipts:", receipts);
    res.json(receipts);

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


// @desc    Get all receipts (admin)
// @route   GET /api/receipts/all
// @access  Private (Admin)
router.get('/all', protect, authorize('admin'), async (req, res) => {
  try {
    const receipts = await Receipt.find({})
      .populate({
        path: 'order',
        select: 'status totalPrice quantity',
        populate: [
          { path: 'customer', select: 'username' },
          { path: 'farmer', select: 'username' },
          { path: 'crop', select: 'name' }
        ]
      });
    res.json(receipts);
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
});

// @desc    Delete a receipt
// @route   DELETE /api/receipts/:id
// @access  Private (Admin)
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const receipt = await Receipt.findById(req.params.id);

    if (receipt) {
      await Receipt.deleteOne({ _id: req.params.id });
      res.json({ message: 'Receipt removed' });
    } else {
      res.status(404).json({ error: 'Receipt not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
});

module.exports = router;
