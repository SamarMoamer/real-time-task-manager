import { defineStore } from 'pinia'
import { ref, reactive, computed } from 'vue'
import { taskService } from '@/services/taskService'
import socketService from '@/services/socket'

export const useTasksStore = defineStore('tasks', () => {
  // State
  const tasks = ref([])
  const currentTask = ref(null)
  const isLoading = ref(false)
  const error = ref(null)
  const stats = ref({})
  
  const filters = reactive({
    search: '',
    priority: 'all',
    tags: [],
    completed: null,
    dueDate: '',
    sortBy: 'createdAt',
    order: 'desc'
  })

  const pagination = reactive({
    currentPage: 1,
    total: 0,
    limit: 10,
    totalPages: 0
  })

  // Getters
  const recentTasks = computed(() => tasks.value.slice(0, 5))
  
  const completedTasks = computed(() => 
    tasks.value.filter(task => task.completed)
  )
  
  const pendingTasks = computed(() => 
    tasks.value.filter(task => !task.completed)
  )
  
  const highPriorityTasks = computed(() =>
    tasks.value.filter(task => task.priority === 'high' && !task.completed)
  )
  
  const overdueTasks = computed(() =>
    tasks.value.filter(task => {
      if (!task.dueDate || task.completed) return false
      return new Date(task.dueDate) < new Date()
    })
  )

  const filteredTasks = computed(() => {
    let filtered = tasks.value

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(searchLower) ||
        task.description?.toLowerCase().includes(searchLower)
      )
    }

    // Priority filter
    if (filters.priority !== 'all') {
      filtered = filtered.filter(task => task.priority === filters.priority)
    }

    // Tags filter
    if (filters.tags.length > 0) {
      filtered = filtered.filter(task => 
        task.tags?.some(tag => filters.tags.includes(tag))
      )
    }

    // Completion filter
    if (filters.completed !== null) {
      filtered = filtered.filter(task => task.completed === filters.completed)
    }

    // Due date filter
    if (filters.dueDate) {
      const now = new Date()
      switch (filters.dueDate) {
        case 'today': {
          const tomorrow = new Date(now)
          tomorrow.setDate(tomorrow.getDate() + 1)
          filtered = filtered.filter(task => 
            task.dueDate && 
            new Date(task.dueDate) >= now && 
            new Date(task.dueDate) < tomorrow
          )
          break
        }
        case 'week': {
          const nextWeek = new Date(now)
          nextWeek.setDate(nextWeek.getDate() + 7)
          filtered = filtered.filter(task => 
            task.dueDate && 
            new Date(task.dueDate) >= now && 
            new Date(task.dueDate) < nextWeek
          )
          break
        }
        case 'overdue': {
          filtered = filtered.filter(task => 
            task.dueDate && 
            new Date(task.dueDate) < now && 
            !task.completed
          )
          break
        }
      }
    }

    // Sorting
    filtered.sort((a, b) => {
      let aValue = a[filters.sortBy]
      let bValue = b[filters.sortBy]

      if (filters.sortBy === 'dueDate') {
        aValue = aValue ? new Date(aValue) : new Date(8640000000000000)
        bValue = bValue ? new Date(bValue) : new Date(8640000000000000)
      }

      if (filters.order === 'desc') {
        return aValue < bValue ? 1 : -1
      } else {
        return aValue > bValue ? 1 : -1
      }
    })

    return filtered
  })

  // Helper function to extract task data from response
  const extractTaskData = (response) => {
    console.log('🔍 Extracting task data from:', response)
    
    if (!response) {
      console.error('❌ No response received')
      return null
    }
    
    // Handle different response structures
    if (response.data && response.data._id) {
      console.log('✅ Found task in response.data')
      return response.data
    }
    
    if (response._id) {
      console.log('✅ Found task in response directly')
      return response
    }
    
    if (response.data && response.data.data && response.data.data._id) {
      console.log('✅ Found task in response.data.data')
      return response.data.data
    }
    
    // If no clear task object found, return what's available
    console.log('⚠️ Using available data:', response.data || response)
    return response.data || response
  }

  // Actions
const fetchTasks = async (params = {}) => {
  isLoading.value = true
  error.value = null
  
  try {
    const queryParams = {
      page: pagination.currentPage,
      limit: pagination.limit,
      ...filters,
      ...params
    }

    // تنظيف البارامترات
    Object.keys(queryParams).forEach(key => {
      if (queryParams[key] === 'all' || queryParams[key] === '' || queryParams[key] === null) {
        delete queryParams[key]
      }
    })

    const response = await taskService.getAll(queryParams)
    console.log('📥 Fetch tasks store response:', response)
    
    // معالجة البيانات بشكل أكثر قوة
    if (response && response.data) {
      tasks.value = Array.isArray(response.data) ? response.data : []
      console.log('✅ Tasks loaded to store:', tasks.value.length)
    } else {
      tasks.value = []
      console.warn('⚠️ No tasks data in response')
    }
    
    // تحديث pagination
    if (response.pagination) {
      Object.assign(pagination, response.pagination)
    }
    
    return response
  } catch (err) {
    console.error('❌ Fetch tasks error:', err)
    error.value = err.response?.data?.message || err.message || 'فشل في جلب المهام'
    throw err
  } finally {
    isLoading.value = false
  }
}

// في tasks.js - إضافة action جديدة
const fetchAllAdminTasks = async (params = {}) => {
  isLoading.value = true
  error.value = null
  
  try {
    const queryParams = {
      page: pagination.currentPage,
      limit: pagination.limit,
      ...filters,
      ...params
    }

    // تنظيف البارامترات
    Object.keys(queryParams).forEach(key => {
      if (queryParams[key] === 'all' || queryParams[key] === '' || queryParams[key] === null) {
        delete queryParams[key]
      }
    })

    const response = await taskService.getAllAdminTasks(queryParams)
    console.log('📥 Fetch admin tasks store response:', response)
    
    if (response && response.data) {
      tasks.value = Array.isArray(response.data) ? response.data : []
      console.log('✅ Admin tasks loaded to store:', tasks.value.length)
    } else {
      tasks.value = []
      console.warn('⚠️ No admin tasks data in response')
    }
    
    if (response.pagination) {
      Object.assign(pagination, response.pagination)
    }
    
    return response
  } catch (err) {
    console.error('❌ Fetch admin tasks error:', err)
    error.value = err.response?.data?.message || err.message || 'فشل في جلب المهام'
    throw err
  } finally {
    isLoading.value = false
  }
}
  const fetchTask = async (id) => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await taskService.getById(id)
      console.log('📥 Fetch task full response:', response)
      
      currentTask.value = extractTaskData(response)
      
      return response
    } catch (err) {
      console.error('❌ Fetch task error:', err)
      error.value = err.response?.data?.message || err.message || 'فشل في جلب المهمة'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const createTask = async (taskData) => {
    isLoading.value = true
    error.value = null
    
    try {
      console.log('📝 Creating task with data:', taskData)
      const response = await taskService.create(taskData)
      console.log('✅ Create task full response:', response)
      
      const newTask = extractTaskData(response)
      
      if (!newTask) {
        console.error('❌ No task data returned from server')
        throw new Error('No task data returned from server')
      }
      
      console.log('➕ Adding new task to store:', newTask)
      tasks.value.unshift(newTask)
      
      return newTask
    } catch (err) {
      console.error('❌ Create task error:', err)
      error.value = err.response?.data?.message || err.message || 'فشل في إنشاء المهمة'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const updateTask = async (id, updates) => {
    isLoading.value = true
    error.value = null
    
    try {
      console.log('✏️ Updating task:', id, updates)
      const response = await taskService.update(id, updates)
      console.log('✅ Update task full response:', response)
      
      const updatedTask = extractTaskData(response)
      
      // Update in list
      const index = tasks.value.findIndex(task => task._id === id)
      if (index !== -1) {
        tasks.value[index] = { ...tasks.value[index], ...updatedTask }
      }
      
      // Update current task if it's the one being edited
      if (currentTask.value && currentTask.value._id === id) {
        currentTask.value = { ...currentTask.value, ...updatedTask }
      }
      
      return updatedTask
    } catch (err) {
      console.error('❌ Update task error:', err)
      error.value = err.response?.data?.message || err.message || 'فشل في تحديث المهمة'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const deleteTask = async (id) => {
    isLoading.value = true
    error.value = null
    
    try {
      console.log('🗑️ Deleting task:', id)
      await taskService.delete(id)
      
      // Remove from list
      tasks.value = tasks.value.filter(task => task._id !== id)
      
      // Clear current task if it's the one being deleted
      if (currentTask.value && currentTask.value._id === id) {
        currentTask.value = null
      }
      
      return { success: true, message: 'تم حذف المهمة بنجاح' }
    } catch (err) {
      console.error('❌ Delete task error:', err)
      error.value = err.response?.data?.message || err.message || 'فشل في حذف المهمة'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const toggleCompletion = async (id) => {
    try {
      console.log('🔄 Toggling task completion:', id)
      const response = await taskService.toggleCompletion(id)
      console.log('✅ Toggle completion response:', response)
      
      const updatedTask = extractTaskData(response)
      
      // Update in list
      const index = tasks.value.findIndex(task => task._id === id)
      if (index !== -1) {
        tasks.value[index] = updatedTask
      }
      
      return updatedTask
    } catch (err) {
      console.error('❌ Toggle completion error:', err)
      error.value = err.response?.data?.message || err.message || 'فشل في تغيير حالة المهمة'
      throw err
    }
  }

  const fetchStats = async () => {
    try {
      console.log('📊 Fetching task stats')
      const response = await taskService.getStats()
      console.log('✅ Stats response:', response)
      
      stats.value = response.data || {}
      
      return response
    } catch (err) {
      console.error('❌ Fetch stats error:', err)
      error.value = err.response?.data?.message || err.message || 'فشل في جلب الإحصائيات'
      throw err
    }
  }

  const fetchTaskActivities = async (taskId) => {
    try {
      const response = await taskService.getActivities(taskId)
      return response
    } catch (err) {
      error.value = err.response?.data?.message || err.message || 'فشل في جلب أنشطة المهمة'
      throw err
    }
  }

  const updateFilters = (newFilters) => {
    Object.assign(filters, newFilters)
    pagination.currentPage = 1
    fetchTasks()
  }

  const clearFilters = () => {
    Object.assign(filters, {
      search: '',
      priority: 'all',
      tags: [],
      completed: null,
      dueDate: '',
      sortBy: 'createdAt',
      order: 'desc'
    })
    pagination.currentPage = 1
    fetchTasks()
  }

  const setPage = (page) => {
    pagination.currentPage = page
    fetchTasks()
  }

  const initializeSocketListeners = () => {
    socketService.on('task-created', (newTask) => {
      if (!tasks.value.find(task => task._id === newTask._id)) {
        tasks.value.unshift(newTask)
      }
    })

    socketService.on('task-updated', (updatedTask) => {
      const index = tasks.value.findIndex(task => task._id === updatedTask._id)
      if (index !== -1) {
        tasks.value[index] = updatedTask
      }
    })

    socketService.on('task-deleted', (deletedTaskId) => {
      tasks.value = tasks.value.filter(task => task._id !== deletedTaskId)
    })
  }

  const clearError = () => {
    error.value = null
  }

  const clearCurrentTask = () => {
    currentTask.value = null
  }

  return {
    // State
    tasks,
    currentTask,
    isLoading,
    error,
    stats,
    filters,
    pagination,
    
    // Getters
    recentTasks,
    completedTasks,
    pendingTasks,
    highPriorityTasks,
    overdueTasks,
    filteredTasks,
    
    // Actions
    fetchTasks,
    fetchTask,
     fetchAllAdminTasks,
    createTask,
    updateTask,
    deleteTask,
    toggleCompletion,
    fetchStats,
    fetchTaskActivities,
    updateFilters,
    clearFilters,
    setPage,
    initializeSocketListeners,
    clearError,
    clearCurrentTask
  }
})