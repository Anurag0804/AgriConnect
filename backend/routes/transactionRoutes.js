const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Transaction = require('../models/Transaction');
const Crop = require('../models/Crop');
const Inventory = require('../models/Inventory');
const { protect, authorize } = require('../middleware/authMiddleware');

// @desc    Create a new transaction (buy a crop)
// @route   POST /api/transactions
// @access  Private (Customer)
router.post('/', protect, authorize('customer'), async (req, res) => {
  const { cropId, quantity } = req.body;
  const customerId = req.user.id;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const crop = await Crop.findById(cropId).session(session);

    if (!crop) {
      throw new Error('Crop not found');
    }
    if (crop.stock < quantity) {
      throw new Error('Not enough stock available');
    }

    const totalPrice = crop.pricePerKg * quantity;

    // 1. Create the transaction
    const transaction = new Transaction({
      crop: cropId,
      customer: customerId,
      farmer: crop.farmer,
      quantity,
      totalPrice,
    });
    await transaction.save({ session });

    // 2. Decrease crop stock
    crop.stock -= quantity;
    await crop.save({ session });

    // 3. Update or create customer inventory
    const inventoryItem = await Inventory.findOne({ customer: customerId, cropName: crop.name }).session(session);
    if (inventoryItem) {
      inventoryItem.weight += quantity;
      await inventoryItem.save({ session });
    } else {
      await Inventory.create([{
        customer: customerId,
        cropName: crop.name,
        weight: quantity,
        purchasePrice: crop.pricePerKg,
      }], { session });
    }

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({ message: 'Transaction successful', transaction });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(400).json({ error: error.message });
  }
});

// @desc    Get purchase history for the logged-in customer
// @route   GET /api/transactions/history/customer
// @access  Private (Customer)
router.get('/history/customer', protect, authorize('customer'), async (req, res) => {
    try {
        const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Transaction = require('../models/Transaction');
const Crop = require('../models/Crop');
const Inventory = require('../models/Inventory');
const { protect, authorize } = require('../middleware/authMiddleware');

// @desc    Create a new transaction (buy a crop)
// @route   POST /api/transactions
// @access  Private (Customer)
router.post('/', protect, authorize('customer'), async (req, res) => {
  const { cropId, quantity } = req.body;
  const customerId = req.user.id;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const crop = await Crop.findById(cropId).session(session);

    if (!crop) {
      throw new Error('Crop not found');
    }
    if (crop.stock < quantity) {
      throw new Error('Not enough stock available');
    }

    const totalPrice = crop.pricePerKg * quantity;

    // 1. Create the transaction
    const transaction = new Transaction({
      crop: cropId,
      customer: customerId,
      farmer: crop.farmer,
      quantity,
      totalPrice,
    });
    await transaction.save({ session });

    // 2. Decrease crop stock
    crop.stock -= quantity;
    await crop.save({ session });

    // 3. Update or create customer inventory
    const inventoryItem = await Inventory.findOne({ customer: customerId, cropName: crop.name }).session(session);
    if (inventoryItem) {
      inventoryItem.weight += quantity;
      await inventoryItem.save({ session });
    } else {
      await Inventory.create([{
        customer: customerId,
        cropName: crop.name,
        weight: quantity,
        purchasePrice: crop.pricePerKg,
      }], { session });
    }

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({ message: 'Transaction successful', transaction });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(400).json({ error: error.message });
  }
});

// @desc    Get purchase history for the logged-in customer
// @route   GET /api/transactions/history/customer
// @access  Private (Customer)
router.get('/history/customer', protect, authorize('customer'), async (req, res) => {
    try {
        const transactions = await Transaction.find({ customer: req.user.id })
            .populate('crop', 'name')
            .sort({ date: -1 });
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ error: 'Server Error' });
    }
});

// @desc    Get sales history for the logged-in farmer
// @route   GET /api/transactions/history/farmer
// @access  Private (Farmer)
router.get('/history/farmer', protect, authorize('farmer'), async (req, res) => {
    try {
        const transactions = await Transaction.find({ farmer: req.user.id })
            .populate('crop', 'name')
            .populate('customer', 'username')
            .sort({ date: -1 });
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ error: 'Server Error' });
    }
});

// @desc    Get all transactions (Admin)
// @route   GET /api/transactions/all
// @access  Private (Admin)
router.get('/all', protect, authorize('admin'), async (req, res) => {
    try {
        const { search } = req.query;
        let query = {};
        if (search) {
            query = {
                $or: [
                    { 'crop.name': { $regex: search, $options: 'i' } },
                    { 'customer.username': { $regex: search, $options: 'i' } },
                    { 'farmer.username': { $regex: search, $options: 'i' } },
                ],
            };
        }
        const transactions = await Transaction.find(query)
            .populate('crop', 'name')
            .populate('customer', 'username')
            .populate('farmer', 'username')
            .sort({ date: -1 });
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ error: 'Server Error' });
    }
});

module.exports = router;

        res.json(transactions);
    } catch (error) {
        res.status(500).json({ error: 'Server Error' });
    }
});

// @desc    Get sales history for the logged-in farmer
// @route   GET /api/transactions/history/farmer
// @access  Private (Farmer)
router.get('/history/farmer', protect, authorize('farmer'), async (req, res) => {
    try {
        const transactions = await Transaction.find({ farmer: req.user.id })
            .populate('crop', 'name')
            .populate('customer', 'username')
            .sort({ date: -1 });
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ error: 'Server Error' });
    }
});

// @desc    Get all transactions (Admin)
// @route   GET /api/transactions/all
// @access  Private (Admin)
router.get('/all', protect, authorize('admin'), async (req, res) => {
    try {
        const transactions = await Transaction.find({})
            .populate('crop', 'name')
            .populate('customer', 'username')
            .populate('farmer', 'username')
            .sort({ date: -1 });
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ error: 'Server Error' });
    }
});

module.exports = router;
