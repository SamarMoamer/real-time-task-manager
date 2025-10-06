const express = require('express');
const { upload, handleUploadError } = require('../middleware/upload');
const User = require('../models/User');
const Activity = require('../models/Activity');
const { authorizeRoles } = require('../middleware/auth');
const { userUpdateValidation } = require('../middleware/validation');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// Get user profile
router.get('/profile', async (req, res) => {
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
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update user profile
router.put('/profile', upload.single('avatar'), handleUploadError, async (req, res) => {
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
          { 
            $or: [
              ...(updates.username ? [{ username: updates.username }] : []),
              ...(updates.email ? [{ email: updates.email }] : [])
            ]
          }
        ]
      });

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
        const oldAvatarPath = path.join(__dirname, '..', 'uploads', 'avatars', path.basename(req.user.avatar));
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
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all users (admin only)
router.get('/', authorizeRoles('admin'), async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;

    const query = {};
    
    if (search) {
      query.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
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
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user activities
router.get('/activities', async (req, res) => {
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
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Deactivate account
router.post('/deactivate', async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    user.isActive = false;
    await user.save();

    res.json({
      success: true,
      message: 'Account deactivated successfully'
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});
// Create user (admin only)
router.post('/', authorizeRoles('admin'), async (req, res) => {
  try {
    console.log('📝 Creating user with data:', req.body);
    
    const { username, email, password, role = 'user', isActive = true } = req.body;

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(409).json({ 
        message: 'User with this email or username already exists' 
      });
    }

    // Create user
    const user = new User({
      username,
      email,
      password,
      role,
      isActive
    });

    await user.save();

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    console.log('✅ User created successfully:', userResponse._id);

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: userResponse
    });
  } catch (error) {
    console.error('❌ Error creating user:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update user (admin only)
router.put('/:id', authorizeRoles('admin'), async (req, res) => {
  try {
    console.log('🔄 Updating user:', req.params.id, req.body);
    
    const { error } = userUpdateValidation(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const updates = {};
    const allowedFields = ['username', 'email', 'role', 'isActive'];
    
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    // Check if username or email already exists (excluding current user)
    if (updates.username || updates.email) {
      const existingUser = await User.findOne({
        $and: [
          { _id: { $ne: req.params.id } },
          { 
            $or: [
              ...(updates.username ? [{ username: updates.username }] : []),
              ...(updates.email ? [{ email: updates.email }] : [])
            ]
          }
        ]
      });

      if (existingUser) {
        return res.status(409).json({ 
          message: 'Username or email already exists' 
        });
      }
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('✅ User updated successfully:', user._id);

    res.json({
      success: true,
      message: 'User updated successfully',
      data: user
    });
  } catch (error) {
    console.error('❌ Error updating user:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete user (admin only)
router.delete('/:id', authorizeRoles('admin'), async (req, res) => {
  try {
    console.log('🗑️ Deleting user:', req.params.id);
    
    const user = await User.findByIdAndDelete(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('✅ User deleted successfully:', req.params.id);

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('❌ Error deleting user:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Toggle user status (admin only)
router.patch('/:id/toggle-status', authorizeRoles('admin'), async (req, res) => {
  try {
    console.log('🔄 Toggling user status:', req.params.id);
    
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isActive = !user.isActive;
    await user.save();

    console.log('✅ User status toggled:', user._id, 'New status:', user.isActive);

    res.json({
      success: true,
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      data: user
    });
  } catch (error) {
    console.error('❌ Error toggling user status:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;