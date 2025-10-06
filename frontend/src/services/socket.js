import { io } from 'socket.io-client'

class SocketService {
  constructor() {
    this.socket = null
    this.isConnected = false
    this.reconnectAttempts = 0
    this.maxReconnectAttempts = 5
    this.reconnectInterval = 1000
    this.eventListeners = new Map()
  }

  /**
   * الاتصال بالسيرفر
   */
  connect(token) {
    if (this.socket) {
      this.disconnect()
    }

    this.socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', {
      auth: {
        token: token
      },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: this.reconnectInterval,
      timeout: 10000
    })

    this.setupEventListeners()
  }

  /**
   * إعداد مستمعي الأحداث
   */
  setupEventListeners() {
    this.socket.on('connect', () => {
      console.log('✅ Connected to server via Socket.io')
      this.isConnected = true
      this.reconnectAttempts = 0
      this.emit('user-connected', { userId: this.getUserId() })
    })

    this.socket.on('disconnect', (reason) => {
      console.log('❌ Disconnected from server:', reason)
      this.isConnected = false
      
      if (reason === 'io server disconnect') {
        // Server intentionally disconnected, need to manually reconnect
        this.socket.connect()
      }
    })

    this.socket.on('connect_error', (error) => {
      console.error('🔌 Socket connection error:', error)
      this.isConnected = false
      this.reconnectAttempts++
      
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error('🚫 Max reconnection attempts reached')
      }
    })

    this.socket.on('reconnect_attempt', (attempt) => {
      console.log(`🔄 Reconnection attempt ${attempt}/${this.maxReconnectAttempts}`)
    })

    this.socket.on('reconnect', (attempt) => {
      console.log(`✅ Reconnected after ${attempt} attempts`)
      this.isConnected = true
    })

    this.socket.on('reconnect_failed', () => {
      console.error('🚫 Failed to reconnect after all attempts')
      this.isConnected = false
    })

    // إعادة تسجيل جميع المستمعين السابقين
    this.eventListeners.forEach((listeners, event) => {
      listeners.forEach(callback => {
        this.socket.on(event, callback)
      })
    })
  }

  /**
   * الاستماع لحدث معين
   */
  on(event, callback) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set())
    }
    this.eventListeners.get(event).add(callback)

    if (this.socket) {
      this.socket.on(event, callback)
    }
  }

  /**
   * إلغاء الاستماع لحدث
   */
  off(event, callback) {
    if (this.eventListeners.has(event)) {
      this.eventListeners.get(event).delete(callback)
    }

    if (this.socket) {
      this.socket.off(event, callback)
    }
  }

  /**
   * إرسال حدث للسيرفر
   */
  emit(event, data) {
    if (this.socket && this.isConnected) {
      this.socket.emit(event, data)
    } else {
      console.warn('⚠️ Socket not connected, cannot emit event:', event)
    }
  }

  /**
   * قطع الاتصال
   */
  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
      this.isConnected = false
      this.eventListeners.clear()
      console.log('🔌 Socket disconnected')
    }
  }

  /**
   * جلب حالة الاتصال
   */
  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      reconnectAttempts: this.reconnectAttempts,
      maxReconnectAttempts: this.maxReconnectAttempts
    }
  }

  /**
   * إعادة الاتصال
   */
  reconnect() {
    if (this.socket) {
      this.socket.connect()
    }
  }

  /**
   * جلب معرف المستخدم من التوكن
   */
  getUserId() {
    try {
      const token = localStorage.getItem('authToken')
      if (!token) return null
      
      const payload = JSON.parse(atob(token.split('.')[1]))
      return payload.userId
    } catch (error) {
      console.error('Error parsing token:', error)
      return null
    }
  }

  /**
   * إعداد مستمعي الأحداث الخاصة بالمهام
   */
  setupTaskListeners(store) {
    this.on('task-created', (task) => {
      console.log('📝 Task created via socket:', task.title)
      store.tasks.unshift(task)
    })

    this.on('task-updated', (task) => {
      console.log('✏️ Task updated via socket:', task.title)
      const index = store.tasks.findIndex(t => t._id === task._id)
      if (index !== -1) {
        store.tasks[index] = task
      }
    })

    this.on('task-deleted', (taskId) => {
      console.log('🗑️ Task deleted via socket:', taskId)
      store.tasks = store.tasks.filter(task => task._id !== taskId)
    })

    this.on('task-assigned', (data) => {
      console.log('👤 Task assigned via socket:', data)
      // Handle task assignment updates
    })
  }

  /**
   * إعداد مستمعي الأحداث الخاصة بالمستخدمين
   */
  setupUserListeners(store) {
    this.on('user-status-changed', (data) => {
      console.log('👤 User status changed via socket:', data)
      const user = store.users.find(u => u._id === data.userId)
      if (user) {
        user.isActive = data.isActive
      }
    })

    this.on('user-updated', (user) => {
      console.log('✏️ User updated via socket:', user.username)
      const index = store.users.findIndex(u => u._id === user._id)
      if (index !== -1) {
        store.users[index] = user
      }
    })
  }

  /**
   * إعداد مستمعي الأحداث الخاصة بالأنشطة
   */
  setupActivityListeners(store) {
    this.on('activity-created', (activity) => {
      console.log('📊 Activity created via socket:', activity.type)
      store.activities.unshift(activity)
    })
  }
}

// Create singleton instance
const socketService = new SocketService()

export default socketService