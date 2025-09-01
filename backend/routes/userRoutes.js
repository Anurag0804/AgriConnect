const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

// @desc    Get user profile
// @route   GET /api/users/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  // Ensure the logged-in user is requesting their own profile
  if (req.user.id !== req.params.id) {
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
  // Ensure the logged-in user is updating their own profile
  if (req.user.id !== req.params.id) {
    return res.status(403).json({ error: 'Not authorized to update this profile' });
  }

  try {
    const user = await User.findById(req.params.id);

    if (user) {
      user.username = req.body.username || user.username;
      user.phone = req.body.phone || user.phone;
      user.gender = req.body.gender || user.gender;
      user.address = req.body.address || user.address;
      user.profilePicture = req.body.profilePicture || user.profilePicture;
      
      // Note: For actual file uploads, you would use middleware like 'multer' here
      // and handle the file object, e.g., saving the path to user.profilePicture.

      const updatedUser = await user.save();
      res.json({
        _id: updatedUser._id,
        username: updatedUser.username,
        phone: updatedUser.phone,
        role: updatedUser.role,
        gender: updatedUser.gender,
        address: updatedUser.address,
        profilePicture: updatedUser.profilePicture,
      });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
