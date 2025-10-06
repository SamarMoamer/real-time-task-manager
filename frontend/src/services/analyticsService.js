import api from './api'
import { handleApiError } from './api'

export const analyticsService = {
  /**
   * جلب إحصائيات التحليلات حسب النطاق الزمني
   */
  async getAnalytics(dateRange = '30d') {
    try {
      const response = await api.get('/analytics', {
        params: { range: dateRange }
      })
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  },

  /**
   * جلب توزيع المهام حسب الحالة
   */
  async getTaskStatusDistribution(dateRange = '30d') {
    try {
      const response = await api.get('/analytics/tasks/status-distribution', {
        params: { range: dateRange }
      })
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  },

  /**
   * جلب نشاط المستخدمين
   */
  async getUserActivities(dateRange = '30d') {
    try {
      const response = await api.get('/analytics/users/activities', {
        params: { range: dateRange }
      })
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  },

  /**
   * جلب توزيع الأولويات
   */
  async getPriorityDistribution(dateRange = '30d') {
    try {
      const response = await api.get('/analytics/tasks/priority-distribution', {
        params: { range: dateRange }
      })
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  },

  /**
   * جلب إحصائيات لوحة التحكم
   */
  async getDashboardStats(dateRange = '30d') {
    try {
      const response = await api.get('/analytics/dashboard', {
        params: { range: dateRange }
      })
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  },

  /**
   * جلب أحدث الأنشطة
   */
  async getRecentActivities(limit = 10) {
    try {
      const response = await api.get('/analytics/activities/recent', {
        params: { limit }
      })
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  },

  /**
   * جلب أداء النظام
   */
  async getSystemPerformance() {
    try {
      const response = await api.get('/analytics/system/performance')
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  },

  /**
   * تصدير تقرير التحليلات
   */
  async exportAnalyticsReport(dateRange = '30d', format = 'pdf') {
    try {
      const response = await api.get('/analytics/export', {
        params: { range: dateRange, format },
        responseType: 'blob'
      })
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  }
}