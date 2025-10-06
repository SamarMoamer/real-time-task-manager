const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../utils/logger');

class SocketService {
  constructor() {
    this.io = null;
    this.connectedUsers = new Map();
  }

  init(io) {
    this.io = io;
    
    io.use(this.authenticateSocket.bind(this));
    io.on('connection', this.handleConnection.bind(this));
  }

  async authenticateSocket(socket, next) {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error('Authentication error: No token provided'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
      const user = await User.findById(decoded.userId).select('-password');
      
      if (!user) {
        return next(new Error('Authentication error: User not found'));
      }

      if (!user.isActive) {
        return next(new Error('Authentication error: Account deactivated'));
      }

      socket.userId = user._id.toString();
      socket.user = user;
      next();
    } catch (error) {
      next(new Error('Authentication error: Invalid token'));
    }
  }

  handleConnection(socket) {
    logger.info(`User ${socket.user.username} connected with socket ID: ${socket.id}`);
    
    // Add user to connected users map
    this.connectedUsers.set(socket.userId, {
      socketId: socket.id,
      user: socket.user,
      connectedAt: new Date()
    });

    // Join user to their personal room
    socket.join(socket.userId);

    // Handle task events
    socket.on('task-created', (task) => {
      this.handleTaskCreated(socket, task);
    });

    socket.on('task-updated', (task) => {
      this.handleTaskUpdated(socket, task);
    });

    socket.on('task-deleted', (taskId) => {
      this.handleTaskDeleted(socket, taskId);
    });

    socket.on('disconnect', () => {
      this.handleDisconnect(socket);
    });

    socket.on('error', (error) => {
      logger.error('Socket error:', error);
    });
  }

  handleTaskCreated(socket, task) {
    // Broadcast to all connected clients of the same user
    socket.to(socket.userId).emit('task-created', task);
    logger.info(`Task created broadcast to user ${socket.userId}`);
  }

  handleTaskUpdated(socket, task) {
    socket.to(socket.userId).emit('task-updated', task);
    logger.info(`Task updated broadcast to user ${socket.userId}`);
  }

  handleTaskDeleted(socket, taskId) {
    socket.to(socket.userId).emit('task-deleted', taskId);
    logger.info(`Task deleted broadcast to user ${socket.userId}`);
  }

  handleDisconnect(socket) {
    this.connectedUsers.delete(socket.userId);
    logger.info(`User ${socket.user.username} disconnected`);
  }

  // Utility method to emit events to specific user
  emitToUser(userId, event, data) {
    const userSocket = this.connectedUsers.get(userId);
    if (userSocket) {
      this.io.to(userSocket.socketId).emit(event, data);
    }
  }

  // Get connected users count
  getConnectedUsersCount() {
    return this.connectedUsers.size;
  }

  // Get all connected users
  getConnectedUsers() {
    return Array.from(this.connectedUsers.values());
  }
}

module.exports = new SocketService();