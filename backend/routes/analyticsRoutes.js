const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Crop = require('../models/Crop');
const Transaction = require('../models/Transaction');
const Order = require('../models/Order');
const { protect, authorize } = require('../middleware/authMiddleware');

// @desc    Get platform statistics
// @route   GET /api/analytics/stats
// @access  Private (Admin)
router.get('/stats', protect, authorize('admin'), async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    const totalFarmers = await User.countDocuments({ role: 'farmer' });
    const totalAdmins = await User.countDocuments({ role: 'admin' });
    const totalCrops = await Crop.countDocuments();
    const totalTransactions = await Transaction.countDocuments();
    const totalOrders = await Order.countDocuments();

    const totalRevenueResult = await Transaction.aggregate([
      { $group: { _id: null, totalRevenue: { $sum: '$totalPrice' } } },
    ]);
    const totalRevenue = totalRevenueResult.length > 0 ? totalRevenueResult[0].totalRevenue : 0;

    res.json({
      totalUsers,
      totalCustomers,
      totalFarmers,
      totalAdmins,
      totalCrops,
      totalTransactions,
      totalOrders,
      totalRevenue,
    });
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
});

module.exports = router;
