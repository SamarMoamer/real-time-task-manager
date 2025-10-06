<template>
  <AppLayout>
    <div class="space-y-8 p-6">
      <!-- Welcome Section -->
      <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div class="flex-1">
          <div class="flex items-center space-x-4 space-x-reverse mb-4">
            <div class="relative">
              <div class="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/25">
                <span class="text-2xl font-bold text-white">{{ authStore.userInitials }}</span>
              </div>
              <div class="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
            <div>
              <h1 class="text-3xl lg:text-4xl font-bold text-gray-900">
                مرحباً، {{ authStore.user?.username }}
              </h1>
              <p class="text-gray-600 text-lg mt-2">{{ welcomeMessage }}</p>
            </div>
          </div>
        </div>
        
        <!-- Quick Actions & Date Range -->
        <div class="flex items-center space-x-4 space-x-reverse">
          <select v-model="dateRange" @change="fetchDashboardData"
                  class="px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm">
            <option value="7d">آخر 7 أيام</option>
            <option value="30d">آخر 30 يوم</option>
            <option value="90d">آخر 90 يوم</option>
          </select>
          
          <button @click="showCreateTaskModal = true"
                  class="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-2xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-2xl shadow-blue-500/25 flex items-center space-x-3">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
            <span>مهمة جديدة</span>
          </button>
        </div>
      </div>

      <!-- Admin Dashboard -->
      <div v-if="authStore.isAdmin" class="space-y-8">
        <!-- Admin Stats Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="إجمالي المستخدمين"
            :value="dashboardData.totalUsers || 0"
            icon="users"
            color="blue"
            :trend="dashboardData.userGrowth || 0"
            trendLabel="هذا الشهر"
            :loading="isLoading"
          />
          <StatCard 
            title="المهام الكلية"
            :value="dashboardData.totalTasks || 0"
            icon="tasks"
            color="emerald"
            :percentage="dashboardData.completionRate || 0"
            percentageLabel="نسبة الإنجاز"
            :loading="isLoading"
          />
          <StatCard 
            title="المستخدمين النشطين"
            :value="dashboardData.activeUsers || 0"
            icon="activity"
            color="purple"
            :loading="isLoading"
          />
          <StatCard 
            title="متوسط وقت الإنجاز"
            :value="dashboardData.avgCompletionTime || 0"
            icon="health"
            color="green"
            suffix="يوم"
            :loading="isLoading"
          />
        </div>

        <!-- Charts Section -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Task Status Chart -->
          <div class="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/60 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-6">توزيع المهام</h3>
            <div v-if="isLoading" class="flex justify-center py-8">
              <LoadingSpinner size="medium" />
            </div>
            <div v-else class="h-64">
              <TaskStatusChart :data="taskStatusData" />
            </div>
          </div>

          <!-- User Activity Chart -->
          <div class="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/60 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-6">نشاط المستخدمين</h3>
            <div v-if="isLoading" class="flex justify-center py-8">
              <LoadingSpinner size="medium" />
            </div>
            <div v-else class="h-64">
              <UserActivityChart :data="userActivityData" />
            </div>
          </div>
        </div>

        <!-- Priority Distribution & Recent Users -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Priority Distribution -->
          <div class="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/60 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-6">توزيع الأولويات</h3>
            <div v-if="isLoading" class="flex justify-center py-8">
              <LoadingSpinner size="medium" />
            </div>
            <div v-else class="h-64">
              <PriorityChart :data="priorityData" />
            </div>
          </div>

          <!-- Recent Users -->
          <div class="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/60 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-6">أحدث المستخدمين</h3>
            <div v-if="usersStore.isLoading" class="flex justify-center py-8">
              <LoadingSpinner size="medium" />
            </div>
            <div v-else-if="recentUsers.length === 0" class="text-center py-8 text-gray-500">
              لا توجد بيانات
            </div>
            <div v-else class="space-y-4">
              <div v-for="user in recentUsers" :key="user._id" 
                   class="flex items-center space-x-3 space-x-reverse p-3 bg-gray-50/50 rounded-2xl">
                <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-semibold text-sm">
                  {{ user.username?.charAt(0)?.toUpperCase() }}
                </div>
                <div class="flex-1">
                  <p class="font-medium text-gray-900">{{ user.username }}</p>
                  <p class="text-sm text-gray-500">{{ user.email }}</p>
                </div>
                <span class="px-3 py-1 rounded-full text-xs font-medium" 
                      :class="user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'">
                  {{ user.role === 'admin' ? 'مسؤول' : 'مستخدم' }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Performance Metrics -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- System Performance -->
          <div class="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/60 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-6">أداء النظام</h3>
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium text-gray-700">إجمالي المهام</span>
                <span class="text-sm text-green-600 font-medium">{{ tasksStore.tasks.length }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium text-gray-700">المستخدمين النشطين</span>
                <span class="text-sm text-green-600 font-medium">{{ usersStore.activeUsers.length }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium text-gray-700">معدل الإنجاز</span>
                <span class="text-sm text-green-600 font-medium">{{ dashboardData.completionRate || 0 }}%</span>
              </div>
            </div>
          </div>

          <!-- Quick Stats -->
          <div class="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/60 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-6">إحصائيات سريعة</h3>
            <div class="space-y-3">
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600">مهام اليوم</span>
                <span class="text-sm font-semibold text-gray-900">{{ todayTasksCount }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600">مهام هذا الأسبوع</span>
                <span class="text-sm font-semibold text-gray-900">{{ weekTasksCount }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600">مهام متأخرة</span>
                <span class="text-sm font-semibold text-red-600">{{ tasksStore.overdueTasks.length }}</span>
              </div>
            </div>
          </div>

          <!-- Export Report -->
          <div class="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/60 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-6">التقارير</h3>
            <div class="space-y-4">
              <button @click="exportReport" 
                      class="w-full bg-gradient-to-r from-green-500 to-blue-600 text-white px-4 py-3 rounded-2xl font-semibold hover:from-green-600 hover:to-blue-700 transition-all duration-300 flex items-center justify-center space-x-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                <span>تصدير تقرير {{ dateRange }}</span>
              </button>
              <p class="text-xs text-gray-500 text-center">يتضمن جميع الإحصائيات والرسوم البيانية</p>
            </div>
          </div>
        </div>
      </div>

      <!-- User Dashboard -->
      <div v-else class="space-y-8">
        <!-- User Stats Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="المهام الكلية"
            :value="userStats.totalTasks"
            icon="tasks"
            color="blue"
            :loading="tasksStore.isLoading"
          />
          <StatCard 
            title="مكتملة"
            :value="userStats.completedTasks"
            icon="check"
            color="green"
            :loading="tasksStore.isLoading"
          />
          <StatCard 
            title="قيد الانتظار"
            :value="userStats.pendingTasks"
            icon="clock"
            color="yellow"
            :loading="tasksStore.isLoading"
          />
          <StatCard 
            title="متأخرة"
            :value="userStats.overdueTasks"
            icon="alert"
            color="red"
            :loading="tasksStore.isLoading"
          />
        </div>

        <!-- User Charts -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- User Task Distribution -->
          <div class="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/60 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-6">توزيع مهامي</h3>
            <div class="h-64">
              <TaskStatusChart :data="userTaskDistribution" />
            </div>
          </div>

          <!-- Completion Trend -->
          <div class="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/60 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-6">مهامي حسب الأولوية</h3>
            <div class="h-64">
              <PriorityChart :data="userPriorityData" />
            </div>
          </div>
        </div>

        <!-- Recent Tasks & Quick Actions -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Recent Tasks -->
          <div class="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/60 p-6">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl font-semibold text-gray-900">المهام الأخيرة</h2>
              <router-link to="/tasks" class="text-blue-600 hover:text-blue-700 text-sm font-semibold transition-colors duration-200">
                عرض الكل
              </router-link>
            </div>
            
            <div v-if="tasksStore.isLoading" class="flex justify-center py-8">
              <LoadingSpinner size="medium" />
            </div>
            <div v-else-if="recentTasks.length === 0" class="text-center py-8 text-gray-500">
              لا توجد مهام
            </div>
            <div v-else class="space-y-4">
              <div v-for="task in recentTasks" :key="task._id" 
                   class="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-200/60 hover:shadow-lg transition-all duration-300">
                <div class="flex items-center space-x-3 space-x-reverse">
                  <div class="w-3 h-3 rounded-full" :class="getPriorityColor(task.priority)"></div>
                  <div>
                    <p class="font-medium text-gray-900">{{ task.title }}</p>
                    <p class="text-sm text-gray-500">{{ formatDate(task.dueDate) }}</p>
                  </div>
                </div>
                <span class="px-3 py-1 text-xs rounded-full" :class="task.completed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'">
                  {{ task.completed ? 'مكتملة' : 'قيد التنفيذ' }}
                </span>
              </div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/60 p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-6">إجراءات سريعة</h2>
            
            <div class="grid grid-cols-2 gap-4">
              <button @click="showCreateTaskModal = true"
                      class="p-4 bg-blue-50 rounded-2xl border border-blue-200 hover:bg-blue-100 transition-all duration-300 group">
                <div class="text-center">
                  <div class="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-200 transition-colors duration-300">
                    <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                    </svg>
                  </div>
                  <span class="text-sm font-medium text-gray-900">مهمة جديدة</span>
                </div>
              </button>

              <router-link to="/tasks"
                      class="p-4 bg-green-50 rounded-2xl border border-green-200 hover:bg-green-100 transition-all duration-300 group">
                <div class="text-center">
                  <div class="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:bg-green-200 transition-colors duration-300">
                    <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                    </svg>
                  </div>
                  <span class="text-sm font-medium text-gray-900">عرض المهام</span>
                </div>
              </router-link>

              <router-link to="/profile"
                      class="p-4 bg-purple-50 rounded-2xl border border-purple-200 hover:bg-purple-100 transition-all duration-300 group">
                <div class="text-center">
                  <div class="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:bg-purple-200 transition-colors duration-300">
                    <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                  </div>
                  <span class="text-sm font-medium text-gray-900">الملف الشخصي</span>
                </div>
              </router-link>

              <router-link to="/activities"
                      class="p-4 bg-orange-50 rounded-2xl border border-orange-200 hover:bg-orange-100 transition-all duration-300 group">
                <div class="text-center">
                  <div class="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:bg-orange-200 transition-colors duration-300">
                    <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                    </svg>
                  </div>
                  <span class="text-sm font-medium text-gray-900">الأنشطة</span>
                </div>
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <!-- Create Task Modal -->
      <Modal v-model:show="showCreateTaskModal" title="إنشاء مهمة جديدة" size="medium">
        <TaskForm
          @submit="handleCreateTask"
          @cancel="showCreateTaskModal = false"
        />
      </Modal>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useTasksStore } from '@/stores/tasks'
import { useUsersStore } from '@/stores/users'
import { useAnalyticsStore } from '@/stores/analytics'
import AppLayout from '@/components/layout/AppLayout.vue'
import StatCard from '@/components/dashboard/StatCard.vue'
import TaskForm from '@/components/tasks/TaskForm.vue'
import Modal from '@/components/common/ModalCommon.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

// المخططات البيانية
import TaskStatusChart from '@/components/charts/TaskStatusChart.vue'
import UserActivityChart from '@/components/charts/UserActivityChart.vue'
import PriorityChart from '@/components/charts/PriorityChart.vue'

const authStore = useAuthStore()
const tasksStore = useTasksStore()
const usersStore = useUsersStore()
const analyticsStore = useAnalyticsStore()

const showCreateTaskModal = ref(false)
const dateRange = ref('30d')
const isLoading = ref(false)

// بيانات لوحة التحكم
const dashboardData = ref({})

// Computed properties - بيانات حقيقية
const recentUsers = computed(() => {
  return usersStore.users.slice(0, 5)
})

const recentTasks = computed(() => tasksStore.tasks?.slice(0, 5) || [])

const welcomeMessage = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12) return 'صباح الخير! نظرة عامة على أدائك وإنجازاتك'
  if (hour < 18) return 'مساء الخير! تتبع تقدمك اليومي'
  return 'مساء الخير! راجع إنجازاتك اليوم'
})

const userStats = computed(() => ({
  totalTasks: tasksStore.tasks?.length || 0,
  completedTasks: tasksStore.completedTasks?.length || 0,
  pendingTasks: tasksStore.pendingTasks?.length || 0,
  overdueTasks: tasksStore.overdueTasks?.length || 0
}))

// بيانات المخططات البيانية - حقيقية
const taskStatusData = computed(() => {
  const tasks = tasksStore.tasks || []
  const completed = tasks.filter(task => task.completed).length
  const pending = tasks.filter(task => !task.completed).length
  const overdue = tasksStore.overdueTasks.length
  
  return [
    { status: 'مكتملة', count: completed, color: '#10B981' },
    { status: 'قيد التنفيذ', count: pending, color: '#3B82F6' },
    { status: 'متأخرة', count: overdue, color: '#EF4444' }
  ]
})

const userActivityData = computed(() => {
  // بيانات حقيقية من المستخدمين ومهامهم
  return usersStore.users.slice(0, 6).map(user => {
    const userTasks = tasksStore.tasks?.filter(task => 
      task.userId === user._id || (task.userId && task.userId._id === user._id)
    ) || []
    
    const completedTasks = userTasks.filter(task => task.completed).length
    const completionRate = userTasks.length > 0 ? Math.round((completedTasks / userTasks.length) * 100) : 0
    
    return {
      user: user.username,
      tasks: userTasks.length,
      completion: completionRate
    }
  })
})

const priorityData = computed(() => {
  const tasks = tasksStore.tasks || []
  const high = tasks.filter(task => task.priority === 'high').length
  const medium = tasks.filter(task => task.priority === 'medium').length
  const low = tasks.filter(task => task.priority === 'low').length
  
  return [
    { priority: 'عالي', count: high, color: '#EF4444' },
    { priority: 'متوسط', count: medium, color: '#F59E0B' },
    { priority: 'منخفض', count: low, color: '#10B981' }
  ]
})

const userTaskDistribution = computed(() => {
  const tasks = tasksStore.tasks || []
  const completed = tasks.filter(task => task.completed).length
  const pending = tasks.filter(task => !task.completed).length
  const overdue = tasksStore.overdueTasks.length
  
  return [
    { status: 'مكتملة', count: completed, color: '#10B981' },
    { status: 'قيد التنفيذ', count: pending, color: '#3B82F6' },
    { status: 'متأخرة', count: overdue, color: '#EF4444' }
  ]
})

const userPriorityData = computed(() => {
  const tasks = tasksStore.tasks || []
  const high = tasks.filter(task => task.priority === 'high').length
  const medium = tasks.filter(task => task.priority === 'medium').length
  const low = tasks.filter(task => task.priority === 'low').length
  
  return [
    { priority: 'عالي', count: high, color: '#EF4444' },
    { priority: 'متوسط', count: medium, color: '#F59E0B' },
    { priority: 'منخفض', count: low, color: '#10B981' }
  ]
})

const todayTasksCount = computed(() => {
  const today = new Date().toDateString()
  return tasksStore.tasks?.filter(task => {
    const taskDate = new Date(task.createdAt).toDateString()
    return today === taskDate
  }).length || 0
})

const weekTasksCount = computed(() => {
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  return tasksStore.tasks?.filter(task => {
    return new Date(task.createdAt) > weekAgo
  }).length || 0
})

// Helper methods
const getPriorityColor = (priority) => {
  const colors = {
    high: 'bg-red-500',
    medium: 'bg-yellow-500',
    low: 'bg-green-500'
  }
  return colors[priority] || 'bg-gray-500'
}

const formatDate = (date) => {
  if (!date) return 'لا يوجد تاريخ'
  return new Date(date).toLocaleDateString('ar-EG')
}

// Methods
const fetchDashboardData = async () => {
  isLoading.value = true
  try {
    if (authStore.isAdmin) {
      // جلب بيانات حقيقية للمسؤول
      await Promise.all([
        usersStore.fetchUsers(),
        tasksStore.fetchAllAdminTasks()
      ])
      
      // حساب البيانات الحقيقية
      const totalTasks = tasksStore.tasks.length
      const completedTasks = tasksStore.completedTasks.length
      const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
      
      dashboardData.value = {
        totalUsers: usersStore.users.length,
        userGrowth: calculateUserGrowth(),
        totalTasks: totalTasks,
        completionRate: completionRate,
        activeUsers: usersStore.activeUsers.length,
        avgCompletionTime: calculateAvgCompletionTime(),
        completedTasks: completedTasks,
        inProgressTasks: tasksStore.pendingTasks.length,
        overdueTasks: tasksStore.overdueTasks.length,
        highPriorityTasks: tasksStore.tasks.filter(t => t.priority === 'high').length,
        mediumPriorityTasks: tasksStore.tasks.filter(t => t.priority === 'medium').length,
        lowPriorityTasks: tasksStore.tasks.filter(t => t.priority === 'low').length
      }
    } else {
      // جلب بيانات المستخدم العادي
      await tasksStore.fetchTasks()
    }
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
  } finally {
    isLoading.value = false
  }
}

const calculateUserGrowth = () => {
  // حساب نمو المستخدمين - يمكن تحسين هذا المنطق بناءً على بيانات حقيقية
  const currentMonth = new Date().getMonth()
  const lastMonthUsers = usersStore.users.filter(user => {
    const userDate = new Date(user.createdAt)
    return userDate.getMonth() === (currentMonth - 1 + 12) % 12
  }).length
  
  const currentMonthUsers = usersStore.users.filter(user => {
    const userDate = new Date(user.createdAt)
    return userDate.getMonth() === currentMonth
  }).length
  
  if (lastMonthUsers === 0) return currentMonthUsers > 0 ? 100 : 0
  return Math.round(((currentMonthUsers - lastMonthUsers) / lastMonthUsers) * 100)
}

const calculateAvgCompletionTime = () => {
  // حساب متوسط وقت الإنجاز - يمكن تحسين هذا المنطق
  const completedTasks = tasksStore.completedTasks
  if (completedTasks.length === 0) return 0
  
  const totalDays = completedTasks.reduce((sum, task) => {
    if (task.createdAt && task.updatedAt) {
      const created = new Date(task.createdAt)
      const updated = new Date(task.updatedAt)
      const days = (updated - created) / (1000 * 60 * 60 * 24)
      return sum + days
    }
    return sum
  }, 0)
  
  return Math.round((totalDays / completedTasks.length) * 10) / 10
}

const exportReport = async () => {
  try {
    // استخدام خدمة التصدير الحقيقية إذا كانت موجودة
    if (authStore.isAdmin) {
      await analyticsStore.exportAnalyticsReport(dateRange.value)
    }
    // يمكن إضافة منطق تصدير للمستخدم العادي هنا
  } catch (error) {
    console.error('Error exporting report:', error)
  }
}

const handleCreateTask = async (taskData) => {
  try {
    await tasksStore.createTask(taskData)
    showCreateTaskModal.value = false
    await fetchDashboardData() // تحديث البيانات بعد إنشاء المهمة
  } catch (error) {
    console.error('Error creating task:', error)
  }
}

onMounted(async () => {
  await fetchDashboardData()
})
</script>