<template>
  <AppLayout>
    <div class="space-y-6 p-6">
      <!-- Header -->
      <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 class="text-2xl lg:text-3xl font-bold text-gray-900">إدارة المهام</h1>
          <p class="text-gray-600 mt-2">نظرة شاملة على جميع مهامك</p>
        </div>
        
        <div class="flex items-center space-x-4 space-x-reverse">
          <!-- View Toggle -->
          <div class="flex bg-gray-100 rounded-2xl p-1">
            <button @click="viewMode = 'grid'" 
                    class="p-2 rounded-xl transition-all duration-300"
                    :class="viewMode === 'grid' ? 'bg-white shadow-lg' : 'text-gray-500 hover:text-gray-700'">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
              </svg>
            </button>
            <button @click="viewMode = 'list'" 
                    class="p-2 rounded-xl transition-all duration-300"
                    :class="viewMode === 'list' ? 'bg-white shadow-lg' : 'text-gray-500 hover:text-gray-700'">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>

          <!-- Create Task Button -->
          <router-link to="/tasks/create"
                      class="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-2xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-2xl shadow-blue-500/25 flex items-center space-x-3">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
            <span>مهمة جديدة</span>
          </router-link>
        </div>
      </div>

      <!-- Filters and Search -->
      <div class="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/60 p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Search -->
          <div class="lg:col-span-2">
            <SearchInput
              v-model="tasksStore.filters.search"
              placeholder="ابحث في المهام..."
              @search="handleSearch"
            />
          </div>
          
          <!-- Priority Filter -->
          <select v-model="tasksStore.filters.priority" @change="handleFilterChange"
                  class="px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm">
            <option value="all">جميع الأولويات</option>
            <option value="high">عالي</option>
            <option value="medium">متوسط</option>
            <option value="low">منخفض</option>
          </select>
          
          <!-- Status Filter -->
          <select v-model="tasksStore.filters.completed" @change="handleFilterChange"
                  class="px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm">
            <option :value="null">جميع الحالات</option>
            <option :value="false">قيد التنفيذ</option>
            <option :value="true">مكتملة</option>
          </select>
        </div>

        <!-- Advanced Filters -->
        <div class="mt-4 flex flex-wrap gap-3">
          <button v-for="dateFilter in dateFilters" :key="dateFilter.value"
                  @click="setDateFilter(dateFilter.value)"
                  class="px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300"
                  :class="tasksStore.filters.dueDate === dateFilter.value 
                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'">
            {{ dateFilter.label }}
          </button>
          
          <!-- Clear Filters -->
          <button @click="clearFilters"
                  class="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-all duration-300">
            مسح الفلترة
          </button>
        </div>
      </div>

      <!-- Tasks Content -->
      <div class="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/60 p-6">
        <!-- Loading State -->
        <div v-if="tasksStore.isLoading" class="flex justify-center py-12">
          <LoadingSpinner size="large" />
        </div>

        <!-- Tasks Grid/List -->
        <div v-else>
          <!-- Stats Summary -->
          <div class="flex flex-wrap gap-4 mb-6">
            <div class="flex items-center space-x-2 space-x-reverse text-sm text-gray-600">
              <span class="font-semibold text-gray-900">{{ tasksStore.pagination.total }}</span>
              <span>مهمة</span>
            </div>
            <div class="flex items-center space-x-2 space-x-reverse text-sm text-gray-600">
              <span class="w-2 h-2 bg-green-500 rounded-full"></span>
              <span class="font-semibold text-gray-900">{{ tasksStore.completedTasks.length }}</span>
              <span>مكتملة</span>
            </div>
            <div class="flex items-center space-x-2 space-x-reverse text-sm text-gray-600">
              <span class="w-2 h-2 bg-red-500 rounded-full"></span>
              <span class="font-semibold text-gray-900">{{ tasksStore.overdueTasks.length }}</span>
              <span>متأخرة</span>
            </div>
          </div>

          <!-- Tasks View -->
          <div v-if="viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <TaskCard
              v-for="task in tasksStore.filteredTasks"
              :key="task._id"
              :task="task"
              @edit="handleEditTask"
              @delete="handleDeleteTask"
              @toggle-completion="handleToggleCompletion"
            />
          </div>

          <div v-else class="space-y-4">
            <TaskListItem
              v-for="task in tasksStore.filteredTasks"
              :key="task._id"
              :task="task"
              @edit="handleEditTask"
              @delete="handleDeleteTask"
              @toggle-completion="handleToggleCompletion"
            />
          </div>

          <!-- Empty State -->
          <div v-if="tasksStore.tasks.length === 0 && !tasksStore.isLoading" class="text-center py-12">
            <div class="max-w-md mx-auto">
              <div class="w-24 h-24 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">لا توجد مهام</h3>
              <p class="text-gray-600 mb-6">ابدأ بإنشاء مهمة جديدة لتنظيم عملك</p>
              <router-link to="/tasks/create"
                          class="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-2xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 inline-flex items-center space-x-3">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                </svg>
                <span>إنشاء مهمة جديدة</span>
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <Pagination
        :current-page="tasksStore.pagination.currentPage"
        :total-items="tasksStore.pagination.total"
        :page-size="tasksStore.pagination.limit"
        :total-pages="tasksStore.pagination.totalPages"
        @page-change="handlePageChange"
      />
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTasksStore } from '@/stores/tasks'
import AppLayout from '@/components/layout/AppLayout.vue'
import TaskCard from '@/components/tasks/TaskCard.vue'
import TaskListItem from '@/components/tasks/TaskList.vue'
import SearchInput from '@/components/common/SearchInput.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import Pagination from '@/components/common/PaginationCommon.vue'

const router = useRouter()
const tasksStore = useTasksStore()

const viewMode = ref('grid')

const dateFilters = [
  { value: 'today', label: 'اليوم' },
  { value: 'week', label: 'هذا الأسبوع' },
  { value: 'overdue', label: 'متأخرة' }
]

const handleSearch = () => {
  tasksStore.fetchTasks()
}



const handleFilterChange = () => {
  tasksStore.fetchTasks()
}

const setDateFilter = (dateValue) => {
  tasksStore.filters.dueDate = tasksStore.filters.dueDate === dateValue ? '' : dateValue
  tasksStore.fetchTasks()
}

const clearFilters = () => {
  tasksStore.clearFilters()
}

const handlePageChange = (page) => {
  tasksStore.setPage(page)
}

const handleEditTask = (task) => {
  router.push(`/tasks/${task._id}/edit`)
}

const handleDeleteTask = async (taskId) => {
  try {
    await tasksStore.deleteTask(taskId)
  } catch (error) {
    console.error('Error deleting task:', error)
  }
}

const handleToggleCompletion = async (taskId) => {
  try {
    await tasksStore.toggleCompletion(taskId)
  } catch (error) {
    console.error('Error toggling task completion:', error)
  }
}

onMounted(() => {
  tasksStore.fetchTasks()
  tasksStore.initializeSocketListeners()
})
</script>