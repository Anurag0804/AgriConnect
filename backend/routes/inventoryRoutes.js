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

module.exports = router;
