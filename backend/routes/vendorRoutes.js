const express = require('express');
const router = express.Router();
const { getAvailableOrders, acceptOrder, updateOrderStatus, getVendorOrderHistory } = require('../controllers/vendorController');
const { protect, isVendor } = require('../middleware/authMiddleware');

// @route   GET api/vendors/orders/available
// @desc    Get all available orders for vendors
// @access  Private/Vendor
router.get('/orders/available', protect, isVendor, getAvailableOrders);

// @route   PUT api/vendors/orders/:id/accept
// @desc    Accept an order
// @access  Private/Vendor
router.put('/orders/:id/accept', protect, isVendor, acceptOrder);

// @route   PUT api/vendors/orders/:id/status
// @desc    Update order status
// @access  Private/Vendor
router.put('/orders/:id/status', protect, isVendor, updateOrderStatus);

// @route   GET api/vendors/history
// @desc    Get vendor's order history
// @access  Private/Vendor
router.get('/history', protect, isVendor, getVendorOrderHistory);

module.exports = router;
