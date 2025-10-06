const User = require('../models/User');
const Activity = require('../models/Activity');
const { userUpdateValidation } = require('../middleware/validation');
const logger = require('../utils/logger');
const fs = require('fs');
const path = require('path');

// Get user profile
exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    logger.error('Get profile error:', error);
    next(error);
  }
};

// Update user profile
exports.updateProfile = async (req, res, next) => {
  try {
    // Validate input
    const { error } = userUpdateValidation(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const updates = {};
    const allowedFields = ['username', 'email'];
    
    // Only allow specific fields to be updated
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    // Check if username or email already exists (excluding current user)
    if (updates.username || updates.email) {
      const existingUser = await User.findOne({
        $and: [
          { _id: { $ne: req.user._id } },
          { $or: [] }
        ]
      });

      if (updates.username) {
        existingUser.$or.push({ username: updates.username });
      }
      if (updates.email) {
        existingUser.$or.push({ email: updates.email });
      }

      if (existingUser) {
        return res.status(409).json({ 
          message: 'Username or email already exists' 
        });
      }
    }

    // Handle avatar upload
    if (req.file) {
      // Delete old avatar if exists
      if (req.user.avatar) {
        const oldAvatarPath = path.join(__dirname, '..', req.user.avatar);
        if (fs.existsSync(oldAvatarPath)) {
          fs.unlinkSync(oldAvatarPath);
        }
      }
      updates.avatar = `/uploads/avatars/${req.file.filename}`;
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: user
    });
  } catch (error) {
    logger.error('Update profile error:', error);
    next(error);
  }
};

// Get all users (admin only)
exports.getAllUsers = async (req, res, next) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search, 
      role, 
      isActive 
    } = req.query;

    const query = {};

    // Search filter
    if (search) {
      query.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    // Role filter
    if (role && role !== 'all') {
      query.role = role;
    }

    // Active status filter
    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      data: users,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalUsers: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    logger.error('Get all users error:', error);
    next(error);
  }
};

// Get user by ID (admin only)
exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    logger.error('Get user by ID error:', error);
    next(error);
  }
};

// Update user (admin only)
exports.updateUser = async (req, res, next) => {
  try {
    const { username, email, role, isActive } = req.body;
    
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if username or email already exists (excluding current user)
    if (username || email) {
      const existingUser = await User.findOne({
        $and: [
          { _id: { $ne: req.params.id } },
          { $or: [] }
        ]
      });

      if (username) existingUser.$or.push({ username });
      if (email) existingUser.$or.push({ email });

      if (existingUser) {
        return res.status(409).json({ 
          message: 'Username or email already exists' 
        });
      }
    }

    // Update fields
    if (username) user.username = username;
    if (email) user.email = email;
    if (role) user.role = role;
    if (isActive !== undefined) user.isActive = isActive;

    await user.save();

    res.json({
      success: true,
      message: 'User updated successfully',
      data: user
    });
  } catch (error) {
    logger.error('Update user error:', error);
    next(error);
  }
};

// Delete user (admin only)
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent admin from deleting themselves
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ 
        message: 'You cannot delete your own account' 
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    logger.error('Delete user error:', error);
    next(error);
  }
};

// Get user activities
exports.getUserActivities = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const activities = await Activity.find({ userId: req.user._id })
      .populate('taskId', 'title')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Activity.countDocuments({ userId: req.user._id });

    res.json({
      success: true,
      data: activities,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalActivities: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    logger.error('Get user activities error:', error);
    next(error);
  }
};

// Deactivate own account
exports.deactivateAccount = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    
    user.isActive = false;
    await user.save();

    res.json({
      success: true,
      message: 'Account deactivated successfully'
    });
  } catch (error) {
    logger.error('Deactivate account error:', error);
    next(error);
  }
};