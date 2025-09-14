const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect, authorize } = require('../middleware/authMiddleware');
const { uploadImage } = require('../utils/cloudinary');

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
router.get('/', protect, authorize('admin'), async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};
    if (search) {
      query = {
        $or: [
          { username: { $regex: search, $options: 'i' } },
          { phone: { $regex: search, $options: 'i' } },
          { role: { $regex: search, $options: 'i' } },
        ],
      };
    }
    const users = await User.find(query).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
});

// @desc    Get user profile
// @route   GET /api/users/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  // Ensure the logged-in user is requesting their own profile or is an admin
  if (req.user.id !== req.params.id && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Not authorized to view this profile' });
  }

  try {
    const user = await User.findById(req.params.id).select('-password'); // Exclude password from response
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
});

// @desc    Update user profile
// @route   PUT /api/users/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
  // Ensure the logged-in user is updating their own profile or is an admin
  if (req.user.id !== req.params.id && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Not authorized to update this profile' });
  }

  try {
    const user = await User.findById(req.params.id);

    if (user) {
      user.username = req.body.username || user.username;
      user.phone = req.body.phone || user.phone;
      user.gender = req.body.gender || user.gender;
      user.address = req.body.address || user.address;
      user.defaultLandSize = req.body.defaultLandSize || user.defaultLandSize;
      if (req.body.profilePicture === '') {
        user.profilePicture = '';
      }

      const updatedUser = await user.save();
      res.json({
        _id: updatedUser._id,
        username: updatedUser.username,
        phone: updatedUser.phone,
        role: updatedUser.role,
        gender: updatedUser.gender,
        address: updatedUser.address,
        profilePicture: updatedUser.profilePicture,
        defaultLandSize: updatedUser.defaultLandSize,
      });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// @desc    Update user profile picture
// @route   PUT /api/users/:id/profile-picture
// @access  Private
router.put('/:id/profile-picture', protect, async (req, res) => {
  // Ensure the logged-in user is updating their own profile
  if (req.user.id !== req.params.id) {
    return res.status(403).json({ error: 'Not authorized to update this profile' });
  }

  try {
    const user = await User.findById(req.params.id);

    if (user) {
      const { image } = req.body;
      const imageUrl = await uploadImage(image);
      user.profilePicture = imageUrl;

      const updatedUser = await user.save();
      res.json({
        _id: updatedUser._id,
        username: updatedUser.username,
        phone: updatedUser.phone,
        role: updatedUser.role,
        gender: updatedUser.gender,
        address: updatedUser.address,
        profilePicture: updatedUser.profilePicture,
        defaultLandSize: updatedUser.defaultLandSize,
      });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// @desc    Delete a user
// @route   DELETE /api/users/:id
// @access  Private/Admin
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (user) {
      res.json({ message: 'User removed' });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
});

module.exports = router;
