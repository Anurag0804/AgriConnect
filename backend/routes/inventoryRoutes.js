const express = require('express');
const router = express.Router();
const Inventory = require('../models/Inventory');
const { protect, authorize } = require('../middleware/authMiddleware');

// @desc    Get inventory for the logged-in customer
// @route   GET /api/inventory/customer
// @access  Private (Customer)
router.get('/customer', protect, authorize('customer'), async (req, res) => {
  try {
    const inventory = await Inventory.find({ customer: req.user.id });
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
});

// @desc    Get all inventories (Admin)
// @route   GET /api/inventory/all
// @access  Private (Admin)
router.get('/all', protect, authorize('admin'), async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};

    if (search) {
      query.cropName = { $regex: search, $options: 'i' }; // Case-insensitive search on cropName
    }

    const inventories = await Inventory.find(query).populate('customer', 'username');
    res.json(inventories);
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
});

module.exports = router;
