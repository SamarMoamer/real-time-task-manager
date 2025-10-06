<template>
  <AppLayout>
    <div class="space-y-6 p-6">
      <!-- Header -->
      <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 class="text-2xl lg:text-3xl font-bold text-gray-900">التحليلات</h1>
          <p class="text-gray-600 mt-2">نظرة على أدائك وإحصائيات المهام</p>
        </div>
        
        <div class="flex items-center space-x-4 space-x-reverse">
          <!-- Date Range Selector -->
          <select v-model="dateRange" @change="fetchAnalytics"
                  class="px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm">
            <option value="7d">آخر 7 أيام</option>
            <option value="30d">آخر 30 يوم</option>
            <option value="90d">آخر 90 يوم</option>
          </select>
        </div>
      </div>

      <!-- User-specific Analytics -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/60 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">مهامي الكلية</p>
              <p class="text-2xl font-bold text-gray-900 mt-1">{{ userStats.totalTasks }}</p>
            </div>
            <div class="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/60 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">مكتملة</p>
              <p class="text-2xl font-bold text-gray-900 mt-1">{{ userStats.completedTasks }}</p>
              <p class="text-sm text-green-600 mt-1">{{ userStats.completionRate }}%</p>
            </div>
            <div class="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/60 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">متأخرة</p>
              <p class="text-2xl font-bold text-gray-900 mt-1">{{ userStats.overdueTasks }}</p>
            </div>
            <div class="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center">
              <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/60 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">معدل الإنجاز</p>
              <p class="text-2xl font-bold text-gray-900 mt-1">{{ userStats.avgCompletionTime }} يوم</p>
            </div>
            <div class="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Task Distribution -->
        <div class="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/60 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-6">توزيع مهامي</h3>
          <div class="space-y-4">
            <div v-for="status in taskDistribution" :key="status.name" 
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
      </div>

      <!-- Recent Activity -->
      <div class="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/60 p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-6">أحدث الأنشطة</h3>
        <div class="space-y-4">
          <div v-for="activity in recentActivities" :key="activity.id" 
               class="flex items-center space-x-4 space-x-reverse p-4 bg-white rounded-2xl border border-gray-200/60 hover:shadow-lg transition-all duration-300">
            <div class="w-10 h-10 rounded-2xl flex items-center justify-center" :class="activity.iconBg">
              <svg class="w-5 h-5" :class="activity.iconColor" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="activity.iconPath"></path>
              </svg>
            </div>
            <div class="flex-1">
              <p class="font-medium text-gray-900">{{ activity.description }}</p>
              <p class="text-sm text-gray-500">{{ activity.time }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue' // أزل reactive
import { useTasksStore } from '@/stores/tasks'
// import { useAuthStore } from '@/stores/auth'
import AppLayout from '@/components/layout/AppLayout.vue'

const dateRange = ref('30d')
const tasksStore = useTasksStore()
// const authStore = useAuthStore()

// استخدم computed بدلاً من reactive
const userStats = computed(() => {
  const stats = tasksStore.stats
  const total = stats.total || tasksStore.tasks.length
  const completed = stats.completed || tasksStore.completedTasks.length
  const overdue = stats.overdue || tasksStore.overdueTasks.length
  
  return {
    totalTasks: total,
    completedTasks: completed,
    overdueTasks: overdue,
    completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
    avgCompletionTime: calculateAvgCompletionTime()
  }
})

const taskDistribution = computed(() => {
  const total = userStats.value.totalTasks
  const completed = userStats.value.completedTasks
  const pending = total - completed
  const overdue = userStats.value.overdueTasks
  
  return [
    { 
      name: 'مكتملة', 
      count: completed, 
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0, 
      color: 'bg-green-500' 
    },
    { 
      name: 'قيد التنفيذ', 
      count: pending, 
      percentage: total > 0 ? Math.round((pending / total) * 100) : 0, 
      color: 'bg-blue-500' 
    },
    { 
      name: 'متأخرة', 
      count: overdue, 
      percentage: total > 0 ? Math.round((overdue / total) * 100) : 0, 
      color: 'bg-red-500' 
    }
  ]
})

const priorityDistribution = computed(() => {
  const tasks = tasksStore.tasks
  const high = tasks.filter(t => t.priority === 'high').length
  const medium = tasks.filter(t => t.priority === 'medium').length
  const low = tasks.filter(t => t.priority === 'low').length
  const total = tasks.length
  
  return [
    { 
      level: 'عالي', 
      count: high, 
      percentage: total > 0 ? Math.round((high / total) * 100) : 0, 
      color: 'bg-red-500' 
    },
    { 
      level: 'متوسط', 
      count: medium, 
      percentage: total > 0 ? Math.round((medium / total) * 100) : 0, 
      color: 'bg-yellow-500' 
    },
    { 
      level: 'منخفض', 
      count: low, 
      percentage: total > 0 ? Math.round((low / total) * 100) : 0, 
      color: 'bg-green-500' 
    }
  ]
})

const recentActivities = computed(() => {
  return tasksStore.tasks.slice(0, 5).map(task => ({
    id: task._id,
    description: `${task.completed ? 'تم إكمال' : 'تم إنشاء'} مهمة: ${task.title}`,
    time: formatTaskTime(task.createdAt),
    iconBg: task.completed ? 'bg-green-100' : 'bg-blue-100',
    iconColor: task.completed ? 'text-green-600' : 'text-blue-600',
    iconPath: task.completed ? 'M5 13l4 4L19 7' : 'M12 4v16m8-8H4'
  }))
})

const formatTaskTime = (date) => {
  const now = new Date()
  const taskDate = new Date(date)
  const diffMs = now - taskDate
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)
  
  if (diffMins < 60) return `منذ ${diffMins} دقيقة`
  if (diffHours < 24) return `منذ ${diffHours} ساعة`
  return `منذ ${diffDays} يوم`
}

const calculateAvgCompletionTime = () => {
  const completedTasks = tasksStore.tasks.filter(task => task.completed && task.completedAt && task.createdAt)
  if (completedTasks.length === 0) return 0
  
  const totalDays = completedTasks.reduce((sum, task) => {
    const created = new Date(task.createdAt)
    const completed = new Date(task.completedAt)
    const diffDays = (completed - created) / (1000 * 60 * 60 * 24)
    return sum + diffDays
  }, 0)
  
  return Math.round((totalDays / completedTasks.length) * 10) / 10
}

const fetchAnalytics = async () => {
  try {
    await tasksStore.fetchTasks()
    await tasksStore.fetchStats()
  } catch (error) {
    console.error('Error fetching analytics:', error)
  }
}

onMounted(() => {
  fetchAnalytics()
})

watch(dateRange, fetchAnalytics)
</script>