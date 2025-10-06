import api from './api'
import { handleApiError } from './api'

export const taskService = {
  /**
   * جلب جميع المهام
   */
async getAll(params = {}) {
  try {
    console.log('📤 Fetching tasks with params:', params)
    const response = await api.get('/tasks', { params })
    console.log('📥 Tasks API response structure:', response.data)
    
    // فحص هيكل الاستجابة بدقة
    if (response.data && response.data.success) {
      const tasksData = response.data.data || []
      console.log('🔍 Tasks data found:', tasksData.length, 'tasks')
      
      return {
        data: tasksData,
        pagination: response.data.pagination || {
          currentPage: params.page || 1,
          total: response.data.total || tasksData.length,
          limit: params.limit || 10,
          totalPages: Math.ceil((response.data.total || tasksData.length) / (params.limit || 10))
        }
      }
    }
    
    return { data: [], pagination: {} }
  } catch (error) {
    console.error('❌ Get tasks error:', error.response?.data || error)
    throw handleApiError(error)
  }
},
/**
 * جلب جميع المهام للمسؤول
 */
async getAllAdminTasks(params = {}) {
  try {
    console.log('📤 Fetching all tasks for admin with params:', params)
    const response = await api.get('/tasks/admin/all', { params })
    console.log('📥 Admin tasks API response structure:', response.data)
    
    if (response.data && response.data.success) {
      const tasksData = response.data.data || []
      console.log('🔍 Admin tasks data found:', tasksData.length, 'tasks')
      
      return {
        data: tasksData,
        pagination: response.data.pagination || {
          currentPage: params.page || 1,
          total: response.data.total || tasksData.length,
          limit: params.limit || 100,
          totalPages: Math.ceil((response.data.total || tasksData.length) / (params.limit || 100))
        }
      }
    }
    
    return { data: [], pagination: {} }
  } catch (error) {
    console.error('❌ Get admin tasks error:', error.response?.data || error)
    throw handleApiError(error)
  }
},

  /**
   * إنشاء مهمة جديدة
   */
  async create(taskData) {
    try {
      console.log('📤 Creating task:', taskData)
      const response = await api.post('/tasks', taskData)
      console.log('📥 Create task response:', response)
      
      // إرجاع البيانات بشكل منظم
      return {
        data: response.data.data || response.data,
        message: response.data.message || 'تم إنشاء المهمة بنجاح'
      }
    } catch (error) {
      console.error('❌ Create task error:', error.response?.data || error)
      throw handleApiError(error)
    }
  },

  /**
   * تحديث مهمة
   */
  async update(id, taskData) {
    try {
      console.log('📤 Updating task:', id, taskData)
      const response = await api.put(`/tasks/${id}`, taskData)
      console.log('📥 Update task response:', response)
      
      return {
        data: response.data.data || response.data,
        message: response.data.message || 'تم تحديث المهمة بنجاح'
      }
    } catch (error) {
      console.error('❌ Update task error:', error.response?.data || error)
      throw handleApiError(error)
    }
  },

  /**
   * جلب مهمة محددة
   */
  async getById(id) {
    try {
      console.log('📤 Fetching task:', id)
      const response = await api.get(`/tasks/${id}`)
      console.log('📥 Get task response:', response)
      
      return {
        data: response.data.data || response.data
      }
    } catch (error) {
      console.error('❌ Get task error:', error.response?.data || error)
      throw handleApiError(error)
    }
  },

  /**
   * حذف مهمة
   */
  async delete(id) {
    try {
      console.log('📤 Deleting task:', id)
      const response = await api.delete(`/tasks/${id}`)
      console.log('📥 Delete task response:', response)
      
      return {
        message: response.data.message || 'تم حذف المهمة بنجاح'
      }
    } catch (error) {
      console.error('❌ Delete task error:', error.response?.data || error)
      throw handleApiError(error)
    }
  },

  async toggleCompletion(id) {
    try {
      console.log('📤 Toggling task completion:', id)
      const response = await api.patch(`/tasks/${id}/toggle`)
      console.log('📥 Toggle completion response:', response)
      
      return {
        data: response.data.data || response.data,
        message: response.data.message || 'تم تغيير حالة المهمة بنجاح'
      }
    } catch (error) {
      console.error('❌ Toggle completion error:', error.response?.data || error)
      throw handleApiError(error)
    }
  },

  // في taskService.js - تحديث دالة getStats
async getStats() {
  try {
    const response = await api.get('/tasks/stats')
    return response.data
  } catch (error) {
    console.error('❌ Get stats error:', error)
    // إرجاع بيانات افتراضية في حالة الخطأ
    return {
      data: {
        totalTasks: 0,
        completedTasks: 0,
        pendingTasks: 0,
        overdueTasks: 0,
        completionRate: 0
      }
    }
  }
},
  /**
   * جلب أنشطة المهمة
   */
  async getActivities(taskId, params = {}) {
    try {
      const response = await api.get(`/tasks/${taskId}/activities`, { params })
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  },

  /**
   * تعيين مهمة لمستخدم
   */
  async assignTask(taskId, userId) {
    try {
      const response = await api.patch(`/tasks/${taskId}/assign`, { assignedTo: userId })
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  },

  /**
   * إضافة تعليق على المهمة
   */
  async addComment(taskId, comment) {
    try {
      const response = await api.post(`/tasks/${taskId}/comments`, { comment })
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  },

  /**
   * جلب المهام المتعلقة بالمستخدم الحالي
   */
  async getMyTasks(params = {}) {
    try {
      const response = await api.get('/tasks/my', { params })
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  },

  /**
   * جلب المهام الموكلة للمستخدم
   */
  async getAssignedTasks(params = {}) {
    try {
      const response = await api.get('/tasks/assigned', { params })
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  },

  /**
   * استيراد مهام
   */
  async importTasks(tasksData) {
    try {
      const response = await api.post('/tasks/import', tasksData)
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  },

  /**
   * تصدير المهام
   */
  async exportTasks(params = {}) {
    try {
      const response = await api.get('/tasks/export', { 
        params,
        responseType: 'blob'
      })
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  }
}