import api from './api'
import { handleApiError } from './api'

export const activityService = {
  /**
   * جلب جميع الأنشطة
   */
  async getAll(params = {}) {
    try {
      const response = await api.get('/activities', { params })
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  },

  /**
   * جلب نشاط محدد
   */
  async getById(id) {
    try {
      const response = await api.get(`/activities/${id}`)
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  },

  /**
   * إنشاء نشاط جديد
   */
  async create(activityData) {
    try {
      const response = await api.post('/activities', activityData)
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  },

  /**
   * جلب أنشطة المستخدم
   */
  async getUserActivities(userId, params = {}) {
    try {
      const response = await api.get(`/activities/user/${userId}`, { params })
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  },

  /**
   * جلب أنشطة المهمة
   */
  async getTaskActivities(taskId, params = {}) {
    try {
      const response = await api.get(`/activities/task/${taskId}`, { params })
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  },

  /**
   * جلب إحصائيات الأنشطة
   */
  async getStats(params = {}) {
    try {
      const response = await api.get('/activities/stats', { params })
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  },

  /**
   * جلب الأنشطة الحديثة
   */
  async getRecentActivities(limit = 10) {
    try {
      const response = await api.get('/activities/recent', {
        params: { limit }
      })
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  },

  /**
   * جلب الأنشطة حسب النوع
   */
  async getActivitiesByType(type, params = {}) {
    try {
      const response = await api.get(`/activities/type/${type}`, { params })
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  },

  /**
   * حذف نشاط
   */
  async delete(id) {
    try {
      const response = await api.delete(`/activities/${id}`)
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  },

  /**
   * مسح جميع الأنشطة
   */
  async clearAll() {
    try {
      const response = await api.delete('/activities')
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  },

  /**
   * تصدير الأنشطة
   */
  async exportActivities(params = {}) {
    try {
      const response = await api.get('/activities/export', {
        params,
        responseType: 'blob'
      })
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  },

  /**
   * جلب توزيع الأنشطة
   */
  async getActivityDistribution(params = {}) {
    try {
      const response = await api.get('/activities/distribution', { params })
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  }
}