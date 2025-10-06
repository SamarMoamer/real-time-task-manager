import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'
import { analyticsService } from '@/services/analyticsService'

export const useAnalyticsStore = defineStore('analytics', () => {
  // State
  const analytics = reactive({
    totalTasks: 0,
    completionRate: 0,
    activeUsers: 0,
    avgCompletionTime: 0
  })

  const taskStatusDistribution = ref([])
  const userActivities = ref([])
  const priorityDistribution = ref([])
  const recentActivities = ref([])
  const systemPerformance = ref({})
  
  const isLoading = ref(false)
  const error = ref(null)
  const dateRange = ref('30d')

  // Actions
  // في stores/analytics.js - تحديث fetchAnalytics
const fetchAnalytics = async (range = dateRange.value) => {
  isLoading.value = true
  error.value = null
  dateRange.value = range
  
  try {
    const response = await analyticsService.getAnalytics(range)
    
    if (response.data) {
      Object.assign(analytics, response.data)
    }
    
    // جلب البيانات الأخرى
    const [statusData, userData, priorityData, recentData, systemData] = await Promise.all([
      analyticsService.getTaskStatusDistribution(range),
      analyticsService.getUserActivities(range),
      analyticsService.getPriorityDistribution(range),
      analyticsService.getRecentActivities(10),
      analyticsService.getSystemPerformance()
    ])

    taskStatusDistribution.value = statusData.data || []
    userActivities.value = userData.data || []
    priorityDistribution.value = priorityData.data || []
    recentActivities.value = recentData.data || []
    systemPerformance.value = systemData.data || {}

  } catch (err) {
    error.value = err.message || 'فشل في جلب بيانات التحليلات'
    console.error('Analytics fetch error:', err)
  } finally {
    isLoading.value = false
  }
}
// إضافة هذا الـ action إلى الـ store الموجود
const fetchDashboardStats = async (range = dateRange.value) => {
  isLoading.value = true
  error.value = null
  dateRange.value = range
  
  try {
    const response = await analyticsService.getDashboardStats(range)
    
    if (response.data) {
      Object.assign(analytics, response.data)
    }
    
    return response.data
  } catch (err) {
    error.value = err.message || 'فشل في جلب إحصائيات لوحة التحكم'
    console.error('Dashboard stats fetch error:', err)
    
    // استخدام البيانات المحلية كبديل
    await fetchLocalDashboardData()
  } finally {
    isLoading.value = false
  }
}

const fetchLocalDashboardData = async () => {
  // استخدام البيانات من الـ stores الأخرى كبديل
  // سيتم استدعاء هذه الدالة من DashboardPage.vue مباشرة
}

  const exportAnalyticsReport = async (format = 'pdf') => {
    try {
      const blob = await analyticsService.exportAnalyticsReport(dateRange.value, format)
      
      // إنشاء رابط تحميل
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `analytics-report-${dateRange.value}.${format}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      
      return { success: true }
    } catch (err) {
      error.value = err.message || 'فشل في تصدير التقرير'
      throw err
    }
  }

  const clearError = () => {
    error.value = null
  }

  return {
    // State
    analytics,
    taskStatusDistribution,
    userActivities,
    priorityDistribution,
    recentActivities,
    systemPerformance,
    isLoading,
    error,
    dateRange,
    
    // Actions
    fetchAnalytics,
    fetchDashboardStats,
    exportAnalyticsReport,
    clearError
  }
  
})