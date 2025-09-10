const express = require('express');
const router = express.Router();
const Crop = require('../models/Crop');
const { protect, authorize } = require('../middleware/authMiddleware');

// @desc    Create a new crop listing
// @route   POST /api/crops
// @access  Private (Farmer)
router.post('/', protect, authorize('farmer'), async (req, res) => {
  try {
    const { name, stock, pricePerKg, location } = req.body;
    const crop = new Crop({
      name,
      stock,
      pricePerKg,
      location,
      farmer: req.user.id,
    });
    const createdCrop = await crop.save();
    res.status(201).json(createdCrop);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// @desc    Get all crop listings for the marketplace with search and filtering
// @route   GET /api/crops
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { search, location, minPrice, maxPrice, sortBy } = req.query;

    let query = { stock: { $gt: 0 } };

    if (search) {
      query.name = { $regex: search, $options: 'i' }; // Case-insensitive search
    }
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }
    if (minPrice || maxPrice) {
      query.pricePerKg = {};
      if (minPrice) {
        query.pricePerKg.$gte = parseFloat(minPrice);
      }
      if (maxPrice) {
        query.pricePerKg.$lte = parseFloat(maxPrice);
      }
    }

    let sortOptions = {};
    if (sortBy) {
      switch (sortBy) {
        case 'price_asc':
          sortOptions.pricePerKg = 1;
          break;
        case 'price_desc':
          sortOptions.pricePerKg = -1;
          break;
        case 'name_asc':
          sortOptions.name = 1;
          break;
        case 'name_desc':
          sortOptions.name = -1;
          break;
        default:
          // For relevance or default, no specific sort or sort by date
          sortOptions.createdAt = -1;
          break;
      }
    } else {
      sortOptions.createdAt = -1; // Default sort by newest
    }

    const crops = await Crop.find(query)
      .populate('farmer', 'username address')
      .sort(sortOptions);
      
    res.json(crops);
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
});

// @desc    Get all crops for a specific farmer (Farmer's Inventory)
// @route   GET /api/crops/farmer/:farmerId
// @access  Private
router.get('/farmer/:farmerId', protect, async (req, res) => {
    // Ensure the logged-in user is the one requesting their crops
    if (req.user.id !== req.params.farmerId) {
        return res.status(403).json({ error: 'Not authorized to view this inventory' });
    }
    try {
        const crops = await Crop.find({ farmer: req.params.farmerId });
        res.json(crops);
    } catch (error) {
        res.status(500).json({ error: 'Server Error' });
    }
});


// @desc    Get a single crop by ID
// @route   GET /api/crops/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const crop = await Crop.findById(req.params.id).populate('farmer', 'username address');
    if (crop) {
      res.json(crop);
    } else {
      res.status(404).json({ error: 'Crop not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
});

// @desc    Update a crop listing
// @route   PUT /api/crops/:id
// @access  Private (Farmer)
router.put('/:id', protect, authorize('farmer'), async (req, res) => {
  try {
    const { name, stock, pricePerKg, location } = req.body;
    const crop = await Crop.findById(req.params.id);

    if (crop) {
      // Check if the farmer owns the crop listing
      if (crop.farmer.toString() !== req.user.id) {
        return res.status(403).json({ error: 'Not authorized to update this crop' });
      }
      crop.name = name || crop.name;
      crop.stock = stock === undefined ? crop.stock : stock;
      crop.pricePerKg = pricePerKg || crop.pricePerKg;
      crop.location = location || crop.location;

      const updatedCrop = await crop.save();
      res.json(updatedCrop);
    } else {
      res.status(404).json({ error: 'Crop not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// @desc    Delete a crop listing
// @route   DELETE /api/crops/:id
// @access  Private (Farmer)
router.delete('/:id', protect, authorize('farmer'), async (req, res) => {
  try {
    const crop = await Crop.findById(req.params.id);

    if (crop) {
      // Check if the farmer owns the crop listing
      if (crop.farmer.toString() !== req.user.id) {
        return res.status(403).json({ error: 'Not authorized to delete this crop' });
      }
      await crop.deleteOne(); // Using deleteOne() instead of remove() which is deprecated
      res.json({ message: 'Crop removed' });
    } else {
      res.status(404).json({ error: 'Crop not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
});

module.exports = router;
