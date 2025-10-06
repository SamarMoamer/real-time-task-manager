<template>
  <AppLayout>
    <div class="space-y-6 p-6">
      <!-- Header -->
      <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 class="text-2xl lg:text-3xl font-bold text-gray-900">التحليلات والإحصائيات</h1>
          <p class="text-gray-600 mt-2">نظرة شاملة على أداء النظام وإحصائيات الاستخدام</p>
        </div>
        
        <div class="flex items-center space-x-4 space-x-reverse">
          <!-- Date Range Selector -->
          <select v-model="dateRange" @change="fetchAnalytics"
                  class="px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm">
            <option value="7d">آخر 7 أيام</option>
            <option value="30d">آخر 30 يوم</option>
            <option value="90d">آخر 90 يوم</option>
            <option value="1y">آخر سنة</option>
          </select>
          
          <!-- Export Button -->
          <button @click="exportAnalytics"
                  class="bg-gradient-to-r from-green-500 to-blue-600 text-white px-6 py-3 rounded-2xl font-semibold hover:from-green-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-2xl shadow-green-500/25 flex items-center space-x-3">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <span>تصدير التقرير</span>
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="analyticsStore.isLoading" class="flex justify-center py-12">
        <LoadingSpinner size="large" />
      </div>

      <!-- Error State -->
      <div v-else-if="analyticsStore.error" class="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
        <div class="text-red-600 mb-2">
          <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-red-800 mb-2">خطأ في تحميل البيانات</h3>
        <p class="text-red-600">{{ analyticsStore.error }}</p>
        <button @click="fetchAnalytics" class="mt-4 bg-red-600 text-white px-4 py-2 rounded-2xl hover:bg-red-700 transition-colors">
          إعادة المحاولة
        </button>
      </div>

      <!-- Analytics Content -->
      <div v-else>
        <!-- Key Metrics -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <!-- Total Tasks -->
          <div class="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/60 p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">إجمالي المهام</p>
                <p class="text-2xl font-bold text-gray-900 mt-1">{{ analyticsStore.analytics.totalTasks || 0 }}</p>
              </div>
              <div class="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                </svg>
              </div>
            </div>
          </div>

          <!-- Completion Rate -->
          <div class="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/60 p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">معدل الإنجاز</p>
                <p class="text-2xl font-bold text-gray-900 mt-1">{{ analyticsStore.analytics.completionRate || 0 }}%</p>
              </div>
              <div class="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </div>
          </div>

          <!-- Active Users -->
          <div class="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/60 p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">المستخدمين النشطين</p>
                <p class="text-2xl font-bold text-gray-900 mt-1">{{ analyticsStore.analytics.activeUsers || 0 }}</p>
              </div>
              <div class="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center">
                <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </div>
            </div>
          </div>

          <!-- Avg Completion Time -->
          <div class="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/60 p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">متوسط وقت الإنجاز</p>
                <p class="text-2xl font-bold text-gray-900 mt-1">{{ analyticsStore.analytics.avgCompletionTime || 0 }} يوم</p>
              </div>
              <div class="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center">
                <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Charts and Detailed Analytics -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Tasks Status Distribution -->
          <div class="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/60 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-6">توزيع المهام</h3>
            <div class="space-y-4">
              <div v-for="status in taskStatusDistribution" :key="status.name" 
                   class="flex items-center justify-between">
                <div class="flex items-center space-x-3 space-x-reverse">
                  <div class="w-3 h-3 rounded-full" :class="status.color"></div>
                  <span class="text-sm font-medium text-gray-700">{{ status.name }}</span>
                </div>
                <div class="flex items-center space-x-4 space-x-reverse">
                  <span class="text-sm text-gray-600">{{ status.count }} مهمة</span>
                  <span class="text-sm text-gray-500">{{ status.percentage }}%</span>
                </div>
              </div>
            </div>
          </div>

          <!-- User Activity -->
          <div class="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/60 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-6">نشاط المستخدمين</h3>
            <div class="space-y-4">
              <div v-for="activity in userActivities" :key="activity.user" 
                   class="flex items-center justify-between">
                <div class="flex items-center space-x-3 space-x-reverse">
                  <div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-xs font-semibold">
                    {{ activity.user.charAt(0) }}
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-900">{{ activity.user }}</p>
                    <p class="text-xs text-gray-500">{{ activity.role }}</p>
                  </div>
                </div>
                <div class="text-right">
                  <p class="text-sm font-medium text-gray-900">{{ activity.tasks }} مهمة</p>
                  <p class="text-xs text-gray-500">{{ activity.completionRate }}% إنجاز</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Priority Distribution -->
          <div class="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/60 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-6">توزيع الأولويات</h3>
            <div class="space-y-4">
              <div v-for="priority in priorityDistribution" :key="priority.level" 
                   class="flex items-center justify-between">
                <div class="flex items-center space-x-3 space-x-reverse">
                  <div class="w-3 h-3 rounded-full" :class="priority.color"></div>
                  <span class="text-sm font-medium text-gray-700">{{ priority.level }}</span>
                </div>
                <div class="flex items-center space-x-4 space-x-reverse">
                  <span class="text-sm text-gray-600">{{ priority.count }} مهمة</span>
                  <span class="text-sm text-gray-500">{{ priority.percentage }}%</span>
                </div>
              </div>
            </div>
          </div>

          <!-- System Performance -->
          <div class="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/60 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-6">أداء النظام</h3>
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium text-gray-700">وقت الاستجابة</span>
                <span class="text-sm text-green-600 font-medium">{{ analyticsStore.systemPerformance.responseTime || 'N/A' }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium text-gray-700">معدل الخطأ</span>
                <span class="text-sm text-green-600 font-medium">{{ analyticsStore.systemPerformance.errorRate || 'N/A' }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium text-gray-700">وقت التشغيل</span>
                <span class="text-sm text-green-600 font-medium">{{ analyticsStore.systemPerformance.uptime || 'N/A' }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Activities -->
        <div class="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/60 p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-semibold text-gray-900">أحدث الأنشطة</h3>
          </div>
          
          <div class="space-y-4">
            <div v-for="activity in analyticsStore.recentActivities" :key="activity.id" 
                 class="flex items-center space-x-4 space-x-reverse p-4 bg-white rounded-2xl border border-gray-200/60 hover:shadow-lg transition-all duration-300">
              <div class="w-10 h-10 rounded-2xl flex items-center justify-center" :class="getActivityColor(activity.type)">
                <component :is="getActivityIcon(activity.type)" class="w-5 h-5 text-white" />
              </div>
              <div class="flex-1">
                <p class="font-medium text-gray-900">{{ activity.description }}</p>
                <p class="text-sm text-gray-500">{{ formatTime(activity.createdAt) }}</p>
              </div>
              <span class="px-3 py-1 rounded-full text-xs font-medium" :class="getActivityTypeClass(activity.type)">
                {{ getActivityTypeText(activity.type) }}
              </span>
            </div>
            
            <!-- Empty State for Activities -->
            <div v-if="analyticsStore.recentActivities.length === 0" class="text-center py-8 text-gray-500">
              لا توجد أنشطة حديثة
            </div>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAnalyticsStore } from '@/stores/analytics'
import AppLayout from '@/components/layout/AppLayout.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

const analyticsStore = useAnalyticsStore()
const dateRange = ref('30d')

// Computed properties
const taskStatusDistribution = computed(() => {
  return analyticsStore.taskStatusDistribution.map(status => ({
    ...status,
    color: getStatusColor(status.status)
  }))
})

const userActivities = computed(() => {
  return analyticsStore.userActivities.slice(0, 5) // Show top 5 users
})

const priorityDistribution = computed(() => {
  return analyticsStore.priorityDistribution.map(priority => ({
    ...priority,
    color: getPriorityColor(priority.priority)
  }))
})

// Methods
const getStatusColor = (status) => {
  const colors = {
    completed: 'bg-green-500',
    pending: 'bg-yellow-500',
    overdue: 'bg-red-500'
  }
  return colors[status] || 'bg-gray-500'
}

const getPriorityColor = (priority) => {
  const colors = {
    high: 'bg-red-500',
    medium: 'bg-yellow-500',
    low: 'bg-green-500'
  }
  return colors[priority] || 'bg-gray-500'
}

const getActivityColor = (type) => {
  const colors = {
    task: 'bg-blue-500',
    user: 'bg-green-500',
    system: 'bg-purple-500'
  }
  return colors[type] || 'bg-gray-500'
}

const getActivityIcon = (type) => {
  const icons = {
    task: 'TaskIcon',
    user: 'UserIcon',
    system: 'SystemIcon'
  }
  return icons[type] || 'InfoIcon'
}

const getActivityTypeClass = (type) => {
  const classes = {
    task: 'bg-blue-100 text-blue-800',
    user: 'bg-green-100 text-green-800',
    system: 'bg-purple-100 text-purple-800'
  }
  return classes[type] || 'bg-gray-100 text-gray-800'
}

const getActivityTypeText = (type) => {
  const texts = {
    task: 'مهمة',
    user: 'مستخدم',
    system: 'نظام'
  }
  return texts[type] || 'نشاط'
}

const formatTime = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleString('ar-EG')
}

const fetchAnalytics = async () => {
  try {
    await analyticsStore.fetchAnalytics(dateRange.value)
  } catch (error) {
    console.error('Error fetching analytics:', error)
  }
}

const exportAnalytics = async () => {
  try {
    await analyticsStore.exportAnalyticsReport()
  } catch (error) {
    console.error('Error exporting analytics:', error)
  }
}

// Lifecycle
onMounted(() => {
  fetchAnalytics()
})
</script>