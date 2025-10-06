import { defineStore } from 'pinia'
import { ref, reactive, computed } from 'vue'
import { activityService } from '@/services/activityService'

export const useActivitiesStore = defineStore('activities', () => {
  // State
  const activities = ref([])
  const isLoading = ref(false)
  const error = ref(null)
  const stats = ref({})

  const filters = reactive({
    type: 'all',
    dateRange: '7d',
    userId: null
  })

  const pagination = reactive({
    currentPage: 1,
    total: 0,
    limit: 20,
    totalPages: 0
  })

  // Getters
  const recentActivities = computed(() => activities.value.slice(0, 10))

  const activitiesByType = computed(() => {
    const types = {}
    activities.value.forEach(activity => {
      types[activity.type] = (types[activity.type] || 0) + 1
    })
    return types
  })

  const filteredActivities = computed(() => {
    let filtered = activities.value

    // Type filter
    if (filters.type !== 'all') {
      filtered = filtered.filter(activity => activity.type === filters.type)
    }

    // User filter
    if (filters.userId) {
      filtered = filtered.filter(activity => activity.userId === filters.userId)
    }

    // Date range filter (you would implement this based on your date logic)
    if (filters.dateRange !== 'all') {
      // Implement date filtering logic here
    }

    return filtered
  })

  // Actions
  const fetchActivities = async (params = {}) => {
    isLoading.value = true
    error.value = null
    
    try {
      const queryParams = {
        page: pagination.currentPage,
        limit: pagination.limit,
        ...filters,
        ...params
      }

      const response = await activityService.getAll(queryParams)
      activities.value = response.data.data
      
      // Update pagination
      if (response.data.pagination) {
        Object.assign(pagination, response.data.pagination)
      }
      
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'فشل في جلب الأنشطة'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const fetchActivityStats = async () => {
    try {
      // This would typically come from your API
      const mockStats = {
        totalActivities: activities.value.length,
        activitiesToday: activities.value.filter(act => {
          const today = new Date().toDateString()
          const activityDate = new Date(act.createdAt).toDateString()
          return today === activityDate
        }).length,
        topUsers: getTopUsers(),
        activityTypes: activitiesByType.value
      }
      
      stats.value = mockStats
      return mockStats
    } catch (err) {
      error.value = err.response?.data?.message || 'فشل في جلب إحصائيات الأنشطة'
      throw err
    }
  }

  const logActivity = async (activityData) => {
    try {
      const response = await activityService.create(activityData)
      activities.value.unshift(response.data.data)
      return response.data
    } catch (err) {
      console.error('Failed to log activity:', err)
      // Don't throw error for activity logging to avoid breaking user flow
    }
  }

  const clearActivities = async () => {
    try {
      await activityService.clearAll()
      activities.value = []
      return { success: true }
    } catch (err) {
      error.value = err.response?.data?.message || 'فشل في مسح الأنشطة'
      throw err
    }
  }

  const updateFilters = (newFilters) => {
    Object.assign(filters, newFilters)
    pagination.currentPage = 1
    fetchActivities()
  }

  const setPage = (page) => {
    pagination.currentPage = page
    fetchActivities()
  }

  const clearError = () => {
    error.value = null
  }

  // Helper function
  const getTopUsers = () => {
    const userActivities = {}
    activities.value.forEach(activity => {
      const userId = activity.userId?._id || activity.userId
      const username = activity.userId?.username || 'Unknown'
      if (userId) {
        userActivities[userId] = userActivities[userId] || { username, count: 0 }
        userActivities[userId].count++
      }
    })

    return Object.entries(userActivities)
      .sort(([, a], [, b]) => b.count - a.count)
      .slice(0, 5)
      .map(([userId, data]) => ({ userId, ...data }))
  }

  return {
    // State
    activities,
    isLoading,
    error,
    stats,
    filters,
    pagination,
    
    // Getters
    recentActivities,
    activitiesByType,
    filteredActivities,
    
    // Actions
    fetchActivities,
    fetchActivityStats,
    logActivity,
    clearActivities,
    updateFilters,
    setPage,
    clearError
  }
})