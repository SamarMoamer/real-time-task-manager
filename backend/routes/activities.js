const express = require('express');
const Activity = require('../models/Activity');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const logger = require('../utils/logger');

const router = express.Router();

// الحصول على جميع الأنشطة (للمسؤولين فقط)
router.get('/', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const { page = 1, limit = 20, type, userId, taskId } = req.query;
    
    const query = {};
    if (type && type !== 'all') query.type = type;
    if (userId) query.userId = userId;
    if (taskId) query.taskId = taskId;

    const activities = await Activity.find(query)
      .populate('userId', 'username avatar')
      .populate('taskId', 'title')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Activity.countDocuments(query);

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
    logger.error('Get activities error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// الحصول على أنشطة مستخدم معين
router.get('/user/:userId', authenticateToken, async (req, res) => {
  try {
    // التحقق من الصلاحية (المستخدم الحالي أو المسؤول)
    if (req.user.role !== 'admin' && req.user._id.toString() !== req.params.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { page = 1, limit = 20 } = req.query;

    const activities = await Activity.find({ userId: req.params.userId })
      .populate('taskId', 'title')
      .populate('userId', 'username avatar')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Activity.countDocuments({ userId: req.params.userId });

    res.json({
      success: true,
      data: activities,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalActivities: total
      }
    });
  } catch (error) {
    logger.error('Get user activities error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// الحصول على أنشطة مهمة معينة
router.get('/task/:taskId', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const activities = await Activity.find({ taskId: req.params.taskId })
      .populate('userId', 'username avatar')
      .populate('taskId', 'title')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Activity.countDocuments({ taskId: req.params.taskId });

    res.json({
      success: true,
      data: activities,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalActivities: total
      }
    });
  } catch (error) {
    logger.error('Get task activities error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// الحصول على إحصائيات الأنشطة
router.get('/stats', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const stats = await Activity.aggregate([
      {
        $facet: {
          totalActivities: [{ $count: "count" }],
          activitiesByType: [
            { $group: { _id: "$type", count: { $sum: 1 } } }
          ],
          activitiesByUser: [
            { 
              $group: { 
                _id: "$userId", 
                count: { $sum: 1 } 
              } 
            },
            { $sort: { count: -1 } },
            { $limit: 10 }
          ],
          recentActivities: [
            { $sort: { createdAt: -1 } },
            { $limit: 5 }
          ]
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        total: stats[0].totalActivities[0]?.count || 0,
        byType: stats[0].activitiesByType,
        topUsers: stats[0].activitiesByUser,
        recent: stats[0].recentActivities
      }
    });
  } catch (error) {
    logger.error('Get activity stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// الحصول على الأنشطة الحديثة
router.get('/recent', authenticateToken, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    
    const activities = await Activity.find()
      .populate('userId', 'username avatar')
      .populate('taskId', 'title')
      .sort({ createdAt: -1 })
      .limit(limit);

    res.json({
      success: true,
      data: activities
    });
  } catch (error) {
    logger.error('Get recent activities error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;