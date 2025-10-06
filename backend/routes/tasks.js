const express = require('express');
const Task = require('../models/Task');
const Activity = require('../models/Activity');
const { taskValidation } = require('../middleware/validation');

const router = express.Router();



// Get all tasks for admin
router.get('/admin/all', async (req, res) => {
  try {
    // التحقق من أن المستخدم مسؤول
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const { 
      page = 1, 
      limit = 100,
      search, 
      priority, 
      tags, 
      completed 
    } = req.query;

    const query = {};

    // فلترة للبحث
    if (search && search.trim() !== '') {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (priority && priority !== 'all') {
      query.priority = priority;
    }

    if (tags) {
      query.tags = { $in: tags.split(',') };
    }

    if (completed !== undefined) {
      query.completed = completed === 'true';
    }

    const tasks = await Task.find(query)
      .populate('createdBy', 'username email avatar')
      .populate('assignedTo', 'username email avatar')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Task.countDocuments(query);

    res.json({
      success: true,
      data: tasks,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all tasks for user
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search, 
      priority, 
      tags, 
      completed 
    } = req.query;

    const query = { 
      $or: [
        { createdBy: req.user._id },
        { assignedTo: req.user._id }
      ]
    };

    if (search && search.trim() !== '') {
      query.$text = { $search: search };
    }

    if (priority && priority !== 'all') {
      query.priority = priority;
    }

    if (tags) {
      query.tags = { $in: tags.split(',') };
    }

    if (completed !== undefined) {
      query.completed = completed === 'true';
    }

    const tasks = await Task.find(query)
      .populate('createdBy', 'username avatar')
      .populate('assignedTo', 'username avatar')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Task.countDocuments(query);

    res.json({
      success: true,
      data: tasks,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single task
router.get('/:id', async (req, res) => {
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
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create task
router.post('/', async (req, res) => {
  try {
    // Validate input
    const { error } = taskValidation(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const task = new Task({
      ...req.body,
      createdBy: req.user._id
    });

    await task.save();
    await task.populate('createdBy', 'username avatar');
    await task.populate('assignedTo', 'username avatar');

    // Log activity
    const activity = new Activity({
      type: 'create',
      taskId: task._id,
      userId: req.user._id,
      details: { task: task.title }
    });
    await activity.save();

    // Emit real-time event
    const io = req.app.get('io');
    if (io) {
      io.to(req.user._id.toString()).emit('task-created', task);
      
      // Also emit to assigned user if different from creator
      if (task.assignedTo && task.assignedTo.toString() !== req.user._id.toString()) {
        io.to(task.assignedTo.toString()).emit('task-created', task);
      }
    }

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: task
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update task
router.put('/:id', async (req, res) => {
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

    // Update fields
    const allowedFields = ['title', 'description', 'priority', 'tags', 'dueDate', 'completed', 'assignedTo'];
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        task[field] = req.body[field];
      }
    });

    await task.save();
    await task.populate('createdBy', 'username avatar');
    await task.populate('assignedTo', 'username avatar');

    // Log activity
    const activity = new Activity({
      type: 'update',
      taskId: task._id,
      userId: req.user._id,
      details: { changes: req.body }
    });
    await activity.save();

    // Emit real-time event
    const io = req.app.get('io');
    if (io) {
      io.to(req.user._id.toString()).emit('task-updated', task);
      
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
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete task
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user._id // Only creator can delete
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Log activity
    const activity = new Activity({
      type: 'delete',
      taskId: task._id,
      userId: req.user._id,
      details: { task: task.title }
    });
    await activity.save();

    // Emit real-time event
    const io = req.app.get('io');
    if (io) {
      io.to(req.user._id.toString()).emit('task-deleted', task._id);
      
      // Also emit to assigned user if different from creator
      if (task.assignedTo && task.assignedTo.toString() !== req.user._id.toString()) {
        io.to(task.assignedTo.toString()).emit('task-deleted', task._id);
      }
    }

    res.json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Toggle task completion
router.patch('/:id/toggle', async (req, res) => {
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

    task.completed = !task.completed;
    
    if (task.completed) {
      task.completedAt = new Date();
    } else {
      task.completedAt = null;
    }

    await task.save();
    await task.populate('createdBy', 'username avatar');
    await task.populate('assignedTo', 'username avatar');

    // Log activity
    const activityType = task.completed ? 'complete' : 'update';
    const activity = new Activity({
      type: activityType,
      taskId: task._id,
      userId: req.user._id,
      details: { completed: task.completed }
    });
    await activity.save();

    // Emit real-time event
    const io = req.app.get('io');
    if (io) {
      io.to(req.user._id.toString()).emit('task-updated', task);
    }

    res.json({
      success: true,
      message: `Task ${task.completed ? 'completed' : 'reopened'} successfully`,
      data: task
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get task activities
router.get('/:id/activities', async (req, res) => {
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

    const activities = await Activity.find({
      taskId: req.params.id
    })
    .populate('userId', 'username avatar')
    .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: activities
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get task statistics
router.get('/stats', async (req, res) => {
  try {
    const tasks = await Task.find({
      $or: [
        { createdBy: req.user._id },
        { assignedTo: req.user._id }
      ]
    });

    const now = new Date();
    const stats = {
      total: tasks.length,
      completed: tasks.filter(task => task.completed).length,
      pending: tasks.filter(task => !task.completed).length,
      overdue: tasks.filter(task => 
        task.dueDate && 
        task.dueDate < now && 
        !task.completed
      ).length,
      byPriority: {
        high: tasks.filter(task => task.priority === 'high').length,
        medium: tasks.filter(task => task.priority === 'medium').length,
        low: tasks.filter(task => task.priority === 'low').length
      }
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});
module.exports = router;