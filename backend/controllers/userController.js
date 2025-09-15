const User = require('../models/User');
const asyncHandler = require('express-async-handler'); // Assuming this is used elsewhere, or will be needed.
const jwt = require('jsonwebtoken'); // Assuming JWT is used for user authentication/token generation.

// @desc    Register new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  // Placeholder for registration logic
  res.status(501).json({ message: 'Register user not implemented yet.' });
});

// @desc    Authenticate user
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  // Placeholder for login logic
  res.status(501).json({ message: 'Login user not implemented yet.' });
});

// @desc    Get user data
// @route   GET /api/users/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  // Placeholder for getMe logic
  res.status(501).json({ message: 'Get user data not implemented yet.' });
});

// @desc    Update user profile
// @route   PUT /api/users/:id
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  // Placeholder for update user profile logic
  res.status(501).json({ message: 'Update user profile not implemented yet.' });
});

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getAllUsers = asyncHandler(async (req, res) => {
  // Placeholder for get all users logic
  res.status(501).json({ message: 'Get all users not implemented yet.' });
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  // Placeholder for get user by ID logic
  res.status(501).json({ message: 'Get user by ID not implemented yet.' });
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  // Placeholder for delete user logic
  res.status(501).json({ message: 'Delete user not implemented yet.' });
});

// @desc    Get nearest farmers
// @route   GET /api/users/nearest-farmers
// @access  Private
const getNearestFarmers = asyncHandler(async (req, res) => {
  const { lat, lon, radius = 10000 } = req.query; // radius in meters, default 10km

  if (!lat || !lon) {
    return res.status(400).json({ message: 'Latitude and longitude are required.' });
  }

  const latitude = parseFloat(lat);
  const longitude = parseFloat(lon);
  const searchRadius = parseInt(radius);

  if (isNaN(latitude) || isNaN(longitude) || isNaN(searchRadius)) {
    return res.status(400).json({ message: 'Invalid latitude, longitude, or radius.' });
  }

  try {
    const farmers = await User.find({
      role: 'farmer',
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude],
          },
          $maxDistance: searchRadius,
        },
      },
    }).select('-password'); // Exclude password from the result

    res.status(200).json(farmers);
  } catch (error) {
    console.error('Error fetching nearest farmers:', error);
    res.status(500).json({ message: 'Failed to fetch nearest farmers.' });
  }
});

// @desc    Get nearest customers
// @route   GET /api/users/nearest-customers
// @access  Private
const getNearestCustomers = asyncHandler(async (req, res) => {
  const { lat, lon, radius = 10000 } = req.query; // radius in meters, default 10km

  if (!lat || !lon) {
    return res.status(400).json({ message: 'Latitude and longitude are required.' });
  }

  const latitude = parseFloat(lat);
  const longitude = parseFloat(lon);
  const searchRadius = parseInt(radius);

  if (isNaN(latitude) || isNaN(longitude) || isNaN(searchRadius)) {
    return res.status(400).json({ message: 'Invalid latitude, longitude, or radius.' });
  }

  try {
    const customers = await User.find({
      role: 'customer',
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude],
          },
          $maxDistance: searchRadius,
        },
      },
    }).select('-password'); // Exclude password from the result

    res.status(200).json(customers);
  } catch (error) {
    console.error('Error fetching nearest customers:', error);
    res.status(500).json({ message: 'Failed to fetch nearest customers.' });
  }
});


module.exports = {
  registerUser,
  loginUser,
  getMe,
  updateUserProfile,
  getAllUsers,
  getUserById,
  deleteUser,
  getNearestFarmers,
  getNearestCustomers,
};
