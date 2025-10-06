const Task = require('../models/Task');
const Activity = require('../models/Activity');
const User = require('../models/User');
const { taskValidation } = require('../middleware/validation');
const { 
  generatePagination, 
  buildTaskSearchQuery, 
  buildTaskSortOptions,
  sanitizeUserInput 
} = require('../helpers');
const logger = require('../utils/logger');

// Helper function to log activities
const logActivity = async (type, taskId, userId, details = {}, req = null) => {
  try {
    const activityData = {
      type,
      taskId,
      userId,
      details
    };

    if (req) {
      activityData.ipAddress = req.ip;
      activityData.userAgent = req.get('User-Agent');
    }

    const activity = new Activity(activityData);
    await activity.save();
    
    logger.info(`Activity logged: ${type} for task ${taskId} by user ${userId}`);
  } catch (error) {
    logger.error('Activity logging error:', error);
  }
};

// Get all tasks for user
exports.getTasks = async (req, res, next) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search, 
      priority, 
      tags, 
      completed,
      dueDate,
      sortBy = 'createdAt',
      order = 'desc'
    } = req.query;

    // Build query
    const query = buildTaskSearchQuery(req.user._id, {
      search: sanitizeUserInput(search),
      priority: sanitizeUserInput(priority),
      tags: tags ? tags.split(',').map(tag => sanitizeUserInput(tag)) : [],
      completed: sanitizeUserInput(completed),
      dueDate: sanitizeUserInput(dueDate)
    });

    // Build sort options
    const sortOptions = buildTaskSortOptions(sortBy, order);

    const tasks = await Task.find(query)
      .populate('createdBy', 'username avatar')
      .populate('assignedTo', 'username avatar')
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Task.countDocuments(query);

    res.json({
      success: true,
      data: tasks,
      pagination: generatePagination(parseInt(page), parseInt(limit), total)
    });
  } catch (error) {
    logger.error('Get tasks error:', error);
    next(error);
  }
};

// Get single task
exports.getTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      $or: [
        { createdBy: req.user._id },
        { assignedTo: req.user._id }
      ]
    })
    .populate('createdBy', 'username avatar')
    .populate('assignedTo', 'username avatar');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({
      success: true,
      data: task
    });
  } catch (error) {
    logger.error('Get task error:', error);
    next(error);
  }
};

// Create task
exports.createTask = async (req, res, next) => {
  try {
    // Validate input
    const { error } = taskValidation(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // Sanitize input
    const sanitizedData = {
      title: sanitizeUserInput(req.body.title),
      description: sanitizeUserInput(req.body.description),
      priority: sanitizeUserInput(req.body.priority),
      tags: req.body.tags ? req.body.tags.map(tag => sanitizeUserInput(tag)) : [],
      dueDate: req.body.dueDate,
      completed: req.body.completed || false,
      createdBy: req.user._id,
      assignedTo: req.body.assignedTo || null
    };

    const task = new Task(sanitizedData);
    await task.save();

    // Populate for response
    await task.populate('createdBy', 'username avatar');
    await task.populate('assignedTo', 'username avatar');

    // Log activity
    await logActivity('create', task._id, req.user._id, {
      task: task.title,
      priority: task.priority,
      dueDate: task.dueDate
    }, req);

    // Emit real-time event
    const io = req.app.get('io');
    if (io) {
      io.to(req.user._id.toString()).emit('task-created', task);
      
      // Also emit to assigned user if different from creator
      if (task.assignedTo && task.assignedTo._id.toString() !== req.user._id.toString()) {
        io.to(task.assignedTo._id.toString()).emit('task-created', task);
      }
    }

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: task
    });
  } catch (error) {
    logger.error('Create task error:', error);
    next(error);
  }
};

// Update task
exports.updateTask = async (req, res, next) => {
  try {
    // Validate input
    const { error } = taskValidation(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const task = await Task.findOne({
      _id: req.params.id,
      $or: [
        { createdBy: req.user._id },
        { assignedTo: req.user._id }
      ]
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if user has permission to update (only creator or assigned user)
    const canUpdate = task.createdBy.toString() === req.user._id.toString() || 
                     (task.assignedTo && task.assignedTo.toString() === req.user._id.toString());

    if (!canUpdate) {
      return res.status(403).json({ 
        message: 'Access denied. You can only update tasks created by you or assigned to you.' 
      });
    }

    // Sanitize input
    const updates = {};
    const allowedFields = ['title', 'description', 'priority', 'tags', 'dueDate', 'completed', 'assignedTo'];
    
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        if (field === 'tags') {
          updates[field] = req.body[field].map(tag => sanitizeUserInput(tag));
        } else if (field === 'title' || field === 'description') {
          updates[field] = sanitizeUserInput(req.body[field]);
        } else {
          updates[field] = req.body[field];
        }
      }
    });

    const oldTask = { ...task.toObject() };
    
    Object.keys(updates).forEach(key => {
      task[key] = updates[key];
    });

    await task.save();
    await task.populate('createdBy', 'username avatar');
    await task.populate('assignedTo', 'username avatar');

    // Log activity
    const changes = {};
    Object.keys(updates).forEach(key => {
      if (JSON.stringify(oldTask[key]) !== JSON.stringify(updates[key])) {
        changes[key] = {
          from: oldTask[key],
          to: updates[key]
        };
      }
    });

    await logActivity('update', task._id, req.user._id, {
      task: task.title,
      changes
    }, req);

    // Emit real-time event
    const io = req.app.get('io');
    if (io) {
      io.to(req.user._id.toString()).emit('task-updated', task);
      
      // Emit to creator if different from updater
      if (task.createdBy._id.toString() !== req.user._id.toString()) {
        io.to(task.createdBy._id.toString()).emit('task-updated', task);
      }
      
      // Emit to assigned user if different
      if (task.assignedTo && task.assignedTo._id.toString() !== req.user._id.toString()) {
        io.to(task.assignedTo._id.toString()).emit('task-updated', task);
      }
    }

    res.json({
      success: true,
      message: 'Task updated successfully',
      data: task
    });
  } catch (error) {
    logger.error('Update task error:', error);
    next(error);
  }
};

// Delete task
exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      createdBy: req.user._id // Only creator can delete
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const taskTitle = task.title;
    const taskId = task._id;

    await Task.findByIdAndDelete(req.params.id);

    // Log activity
    await logActivity('delete', taskId, req.user._id, {
      task: taskTitle
    }, req);

    // Emit real-time event
    const io = req.app.get('io');
    if (io) {
      io.to(req.user._id.toString()).emit('task-deleted', taskId);
      
      // Also emit to assigned user if different from creator
      if (task.assignedTo && task.assignedTo.toString() !== req.user._id.toString()) {
        io.to(task.assignedTo.toString()).emit('task-deleted', taskId);
      }
    }

    res.json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    logger.error('Delete task error:', error);
    next(error);
  }
};

// Toggle task completion
exports.toggleTaskCompletion = async (req, res, next) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      $or: [
        { createdBy: req.user._id },
        { assignedTo: req.user._id }
      ]
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const oldStatus = task.completed;
    task.completed = !task.completed;
    
    if (task.completed && !oldStatus) {
      task.completedAt = new Date();
    } else if (!task.completed && oldStatus) {
      task.completedAt = null;
    }

    await task.save();
    await task.populate('createdBy', 'username avatar');
    await task.populate('assignedTo', 'username avatar');

    // Log activity
    const activityType = task.completed ? 'complete' : 'update';
    await logActivity(activityType, task._id, req.user._id, {
      task: task.title,
      completed: task.completed,
      completedAt: task.completedAt
    }, req);

    // Emit real-time event
    const io = req.app.get('io');
    if (io) {
      io.to(req.user._id.toString()).emit('task-updated', task);
      
      // Emit to creator if different from updater
      if (task.createdBy._id.toString() !== req.user._id.toString()) {
        io.to(task.createdBy._id.toString()).emit('task-updated', task);
      }
      
      // Emit to assigned user if different
      if (task.assignedTo && task.assignedTo._id.toString() !== req.user._id.toString()) {
        io.to(task.assignedTo._id.toString()).emit('task-updated', task);
      }
    }

    res.json({
      success: true,
      message: `Task ${task.completed ? 'completed' : 'reopened'} successfully`,
      data: task
    });
  } catch (error) {
    logger.error('Toggle task completion error:', error);
    next(error);
  }
};

// Get task activities
exports.getTaskActivities = async (req, res, next) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      $or: [
        { createdBy: req.user._id },
        { assignedTo: req.user._id }
      ]
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const { page = 1, limit = 20 } = req.query;

    const activities = await Activity.find({ taskId: req.params.id })
      .populate('userId', 'username avatar')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Activity.countDocuments({ taskId: req.params.id });

    res.json({
      success: true,
      data: activities,
      pagination: generatePagination(parseInt(page), parseInt(limit), total)
    });
  } catch (error) {
    logger.error('Get task activities error:', error);
    next(error);
  }
};

// Get task statistics
// تأكد من أن هذا الكود موجود في taskController.js
exports.getTaskStatistics = async (req, res, next) => {
  try {
    const stats = await Task.aggregate([
      {
        $match: {
          $or: [
            { createdBy: req.user._id },
            { assignedTo: req.user._id }
          ]
        }
      },
      {
        $facet: {
          totalTasks: [{ $count: "count" }],
          completedTasks: [
            { $match: { completed: true } },
            { $count: "count" }
          ],
          tasksByPriority: [
            { $group: { _id: "$priority", count: { $sum: 1 } } }
          ],
          tasksByStatus: [
            { $group: { _id: "$completed", count: { $sum: 1 } } }
          ],
          overdueTasks: [
            { 
              $match: { 
                dueDate: { $lt: new Date() },
                completed: false
              }
            },
            { $count: "count" }
          ],
          recentCompleted: [
            { 
              $match: { 
                completed: true,
                completedAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
              }
            },
            { $count: "count" }
          ]
        }
      }
    ]);

    const result = {
      total: stats[0].totalTasks[0]?.count || 0,
      completed: stats[0].completedTasks[0]?.count || 0,
      overdue: stats[0].overdueTasks[0]?.count || 0,
      recentCompleted: stats[0].recentCompleted[0]?.count || 0,
      byPriority: stats[0].tasksByPriority.reduce((acc, curr) => {
        acc[curr._id] = curr.count;
        return acc;
      }, {}),
      byStatus: stats[0].tasksByStatus.reduce((acc, curr) => {
        acc[curr._id ? 'completed' : 'pending'] = curr.count;
        return acc;
      }, {})
    };

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    logger.error('Get task statistics error:', error);
    next(error);
  }
};