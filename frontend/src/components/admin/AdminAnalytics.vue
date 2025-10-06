<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">لوحة التحليلات</h1>
        <p class="text-gray-600 mt-1">نظرة شاملة على أداء النظام</p>
      </div>
      
      <!-- Date Range Selector -->
      <div class="flex items-center space-x-3 space-x-reverse">
        <select v-model="dateRange" @change="fetchAnalytics"
                class="px-4 py-2 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm">
          <option value="7d">آخر 7 أيام</option>
          <option value="30d">آخر 30 يوم</option>
          <option value="90d">آخر 90 يوم</option>
          <option value="1y">آخر سنة</option>
        </select>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- Total Users -->
      <div class="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/60 p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
              </svg>
            </div>
          </div>
          <div class="mr-4">
            <p class="text-sm font-medium text-gray-600">إجمالي المستخدمين</p>
            <p class="text-2xl font-bold text-gray-900">{{ analytics.totalUsers }}</p>
            <p class="text-sm text-green-600 flex items-center">
              <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
              </svg>
              +{{ analytics.userGrowth }}% هذا الشهر
            </p>
          </div>
        </div>
      </div>

      <!-- Total Tasks -->
      <div class="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/60 p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
              </svg>
            </div>
          </div>
          <div class="mr-4">
            <p class="text-sm font-medium text-gray-600">إجمالي المهام</p>
            <p class="text-2xl font-bold text-gray-900">{{ analytics.totalTasks }}</p>
            <p class="text-sm text-blue-600">{{ analytics.completionRate }}% نسبة الإنجاز</p>
          </div>
        </div>
      </div>

      <!-- Active Sessions -->
      <div class="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/60 p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
          </div>
          <div class="mr-4">
            <p class="text-sm font-medium text-gray-600">جلسات نشطة</p>
            <p class="text-2xl font-bold text-gray-900">{{ analytics.activeSessions }}</p>
            <p class="text-sm text-gray-600">مستخدم نشط الآن</p>
          </div>
        </div>
      </div>

      <!-- System Health -->
      <div class="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/60 p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center">
              <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
            </div>
          </div>
          <div class="mr-4">
            <p class="text-sm font-medium text-gray-600">صحة النظام</p>
            <p class="text-2xl font-bold text-gray-900">{{ analytics.systemHealth }}%</p>
            <p class="text-sm text-green-600">جميع الخدمات تعمل</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- User Growth Chart -->
      <div class="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/60 p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">نمو المستخدمين</h3>
        <div class="h-64 flex items-center justify-center bg-gray-50/50 rounded-2xl">
          <div class="text-center text-gray-500">
            <svg class="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
            <p>رسم بياني لنمو المستخدمين</p>
          </div>
        </div>
      </div>

      <!-- Task Completion Chart -->
      <div class="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/60 p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">إنجاز المهام</h3>
        <div class="h-64 flex items-center justify-center bg-gray-50/50 rounded-2xl">
          <div class="text-center text-gray-500">
            <svg class="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
            <p>رسم بياني لإنجاز المهام</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/60 p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">النشاط الأخير</h3>
      <div class="space-y-4">
        <div v-for="activity in recentActivities" :key="activity.id" 
             class="flex items-center space-x-3 space-x-reverse p-3 bg-gray-50/50 rounded-2xl">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 rounded-xl flex items-center justify-center"
                 :class="getActivityColor(activity.type)">
              <component :is="getActivityIcon(activity.type)" class="w-4 h-4 text-white" />
            </div>
          </div>
          <div class="flex-1">
            <p class="text-sm text-gray-900">{{ activity.description }}</p>
            <p class="text-xs text-gray-500">{{ activity.time }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'

// Data
const dateRange = ref('7d')
const loading = ref(false)

const analytics = reactive({
  totalUsers: 0,
  userGrowth: 0,
  totalTasks: 0,
  completionRate: 0,
  activeSessions: 0,
  systemHealth: 100
})

const recentActivities = ref([
  {
    id: 1,
    type: 'user',
    description: 'مستخدم جديد سجل في النظام',
    time: 'منذ 5 دقائق'
  },
  {
    id: 2,
    type: 'task',
    description: 'تم إنشاء 3 مهام جديدة',
    time: 'منذ ساعة'
  },
  {
    id: 3,
    type: 'system',
    description: 'تم تحديث النظام إلى الإصدار 1.2.0',
    time: 'منذ 3 ساعات'
  },
  {
    id: 4,
    type: 'user',
    description: 'تم تعطيل حساب مستخدم',
    time: 'منذ 6 ساعات'
  }
])

// Methods
const fetchAnalytics = async () => {
  try {
    loading.value = true
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Mock data - replace with actual API call
    analytics.totalUsers = 1542
    analytics.userGrowth = 12
    analytics.totalTasks = 8924
    analytics.completionRate = 76
    analytics.activeSessions = 23
    analytics.systemHealth = 100
  } catch (error) {
    console.error('Error fetching analytics:', error)
  } finally {
    loading.value = false
  }
}

const getActivityColor = (type) => {
  const colors = {
    user: 'bg-blue-500',
    task: 'bg-green-500',
    system: 'bg-purple-500',
    warning: 'bg-orange-500'
  }
  return colors[type] || 'bg-gray-500'
}

const getActivityIcon = (type) => {
  const icons = {
    user: 'UserIcon',
    task: 'TaskIcon',
    system: 'CogIcon',
    warning: 'ExclamationIcon'
  }
  return icons[type] || 'InformationCircleIcon'
}

// // Mock icons (you should import actual icons)
// const UserIcon = { template: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>' }
// const TaskIcon = { template: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>' }
// const CogIcon = { template: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>' }
// const ExclamationIcon = { template: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"></path></svg>' }
// const InformationCircleIcon = { template: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>' }

// Lifecycle
onMounted(() => {
  fetchAnalytics()
})
</script>