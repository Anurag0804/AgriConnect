const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Order = require('../models/Order');
const Transaction = require('../models/Transaction');
const Crop = require('../models/Crop');
const Inventory = require('../models/Inventory');
const Receipt = require('../models/Receipt');
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

// @desc    Get all orders for a vendor (not delivered)
// @route   GET /api/orders/vendor
// @access  Private (Vendor)
router.get('/vendor', protect, authorize('vendor'), async (req, res) => {
  try {
    const orders = await Order.find({ vendor: req.user.id, status: { $ne: 'delivered' } }).populate('crop').populate('farmer').populate('customer');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
});

// @desc    Update an order status
// @route   PUT /api/orders/:id
// @access  Private (Farmer)
router.put('/:id', protect, authorize('farmer'), async (req, res) => {
  const { status } = req.body;
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const order = await Order.findById(req.params.id).session(session);

    if (!order) {
      throw new Error('Order not found');
    }
    if (order.farmer.toString() !== req.user.id) {
      throw new Error('Not authorized to update this order');
    }
    if (order.status !== 'pending') {
      throw new Error(`Order is already ${order.status}`);
    }

    order.status = status;

    if (status === 'confirmed') {
      const crop = await Crop.findById(order.crop).session(session);
      if (!crop) {
        throw new Error('Crop not found');
      }
      if (crop.stock < order.quantity) {
        throw new Error('Not enough stock available');
      }

      // 1. Create the transaction
      const transaction = new Transaction({
        crop: order.crop,
        farmer: order.farmer,
        customer: order.customer,
        quantity: order.quantity,
        totalPrice: order.totalPrice,
      });
      await transaction.save({ session });

      // 2. Decrease crop stock
      crop.stock -= order.quantity;
      await crop.save({ session });

      // 3. Update or create customer inventory
      const inventoryItem = await Inventory.findOne({ customer: order.customer, cropName: crop.name }).session(session);
      if (inventoryItem) {
        inventoryItem.weight += order.quantity;
        await inventoryItem.save({ session });
      } else {
        await Inventory.create([{
          customer: order.customer,
          cropName: crop.name,
          weight: order.quantity,
          purchasePrice: crop.pricePerKg,
        }], { session });
      }

      // 4. Create a Receipt
      try {
        const receipt = new Receipt({
          order: order._id,
          customer: order.customer,
          farmer: order.farmer,
          paymentStatus: 'unpaid'
        });
        await receipt.save({ session });
        console.log("✅ Auto-created receipt:", receipt);
      } catch (error) {
        console.error("❌ Error creating receipt:", error);
      }

    }

    const updatedOrder = await order.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.json(updatedOrder);

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    // Determine status code based on error
    if (error.message.includes('Not authorized') || error.message.includes('already')) {
      res.status(403).json({ error: error.message });
    } else if (error.message.includes('not found')) {
      res.status(404).json({ error: error.message });
    } else {
      res.status(400).json({ error: error.message });
    }
  }
});

// @desc    Get all orders (Admin)
// @route   GET /api/orders/all
// @access  Private (Admin)
router.get('/all', protect, authorize('admin'), async (req, res) => {
    try {
        const orders = await Order.find({})
            .populate('crop', 'name')
            .populate('customer', 'username')
            .populate('farmer', 'username')
            .sort({ date: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Server Error' });
    }
});

module.exports = router;