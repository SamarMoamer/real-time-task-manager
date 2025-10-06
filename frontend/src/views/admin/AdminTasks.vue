<template>
  <AppLayout>
    <div class="space-y-6 p-6">
      <!-- Header -->
      <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 class="text-2xl lg:text-3xl font-bold text-gray-900">إدارة مهام المستخدمين</h1>
          <p class="text-gray-600 mt-2">عرض وإدارة جميع مهام النظام</p>
        </div>
        
        <div class="flex items-center space-x-4 space-x-reverse">
          <!-- Add Task Button -->
          <button @click="openCreateTaskModal"
                  class="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-2xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-2xl shadow-blue-500/25 flex items-center space-x-3">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
            <span>إضافة مهمة</span>
          </button>
        </div>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/60 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">إجمالي المهام</p>
              <p class="text-2xl font-bold text-gray-900 mt-1">{{ allTasks.length }}</p>
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
              <p class="text-2xl font-bold text-gray-900 mt-1">{{ completedTasksCount }}</p>
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
              <p class="text-sm font-medium text-gray-600">قيد التنفيذ</p>
              <p class="text-2xl font-bold text-gray-900 mt-1">{{ pendingTasksCount }}</p>
            </div>
            <div class="w-12 h-12 bg-yellow-100 rounded-2xl flex items-center justify-center">
              <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/60 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">متأخرة</p>
              <p class="text-2xl font-bold text-gray-900 mt-1">{{ overdueTasksCount }}</p>
            </div>
            <div class="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center">
              <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/60 p-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <!-- Search -->
          <div class="md:col-span-2">
            <SearchInput
              v-model="filters.search"
              placeholder="ابحث في المهام..."
              @search="fetchTasks"
            />
          </div>
          
          <!-- Status Filter -->
          <select v-model="filters.status" @change="fetchTasks"
                  class="px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm">
            <option value="all">جميع الحالات</option>
            <option value="completed">مكتملة</option>
            <option value="pending">قيد التنفيذ</option>
            <option value="overdue">متأخرة</option>
          </select>
          
          <!-- User Filter -->
          <select v-model="filters.userId" @change="fetchTasks"
                  class="px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm">
            <option value="all">جميع المستخدمين</option>
            <option v-for="user in usersStore.users" :key="user._id" :value="user._id">
              {{ user.username }}
            </option>
          </select>
        </div>
      </div>

      <!-- Tasks List -->
      <div class="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/60 overflow-hidden">
        <!-- Loading -->
        <div v-if="tasksStore.isLoading" class="flex justify-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>

        <!-- Tasks -->
        <div v-else class="divide-y divide-gray-200/60">
          <div v-for="task in filteredTasks" :key="task._id || task.id" 
               class="p-6 hover:bg-gray-50/50 transition-colors duration-200">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-4 space-x-reverse flex-1">
                <!-- Status Indicator -->
                <div class="w-3 h-3 rounded-full" :class="getStatusColor(task)"></div>
                
                <!-- Task Info -->
                <div class="flex-1">
                  <div class="flex items-center space-x-3 space-x-reverse mb-2">
                    <h3 class="font-semibold text-gray-900">{{ task.title || 'بدون عنوان' }}</h3>
                    <span class="px-2 py-1 text-xs rounded-full" :class="getPriorityClass(task.priority)">
                      {{ getPriorityText(task.priority) }}
                    </span>
                  </div>
                  <p class="text-sm text-gray-600 mb-3">{{ task.description || 'بدون وصف' }}</p>
                  
                  <div class="flex items-center space-x-4 space-x-reverse flex-wrap gap-2">
                    <!-- User -->
                    <div class="flex items-center space-x-2 space-x-reverse">
                      <div class="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs">
                        {{ getInitials(task.userId) }}
                      </div>
                      <span class="text-sm text-gray-500">{{ getUsername(task.userId) }}</span>
                    </div>
                    
                    <!-- Due Date -->
                    <span v-if="task.dueDate" class="text-sm text-gray-500" :class="isOverdue(task) ? 'text-red-600' : ''">
                      <svg class="w-4 h-4 inline ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                      {{ formatDate(task.dueDate) }}
                    </span>

                    <!-- Created Date -->
                    <span v-if="task.createdAt" class="text-sm text-gray-400">
                      أنشئت: {{ formatDate(task.createdAt) }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Actions & Status -->
              <div class="flex items-center space-x-2 space-x-reverse">
                <!-- Status Badge -->
                <span class="px-3 py-1 rounded-full text-sm font-medium" 
                      :class="task.completed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'">
                  {{ task.completed ? 'مكتملة' : 'قيد التنفيذ' }}
                </span>

                <!-- Actions -->
                <div class="flex items-center space-x-1 space-x-reverse">
                  <!-- Edit Button -->
                  <button @click="openEditModal(task)"
                          class="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors duration-200"
                          title="تعديل المهمة">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                  </button>
                  
                  <!-- Toggle Status -->
                  <button @click="toggleTaskStatus(task)"
                          class="p-2 rounded-xl transition-colors duration-200"
                          :class="task.completed ? 'text-orange-600 hover:bg-orange-50' : 'text-green-600 hover:bg-green-50'"
                          :title="task.completed ? 'إلغاء الإكمال' : 'تعيين كمكتملة'">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path v-if="task.completed" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                      <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </button>
                  
                  <!-- Delete Button -->
                  <button @click="confirmDelete(task)"
                          class="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors duration-200"
                          title="حذف المهمة">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="!tasksStore.isLoading && filteredTasks.length === 0" class="text-center py-12">
          <div class="max-w-md mx-auto">
            <div class="w-24 h-24 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">لا توجد مهام</h3>
            <p class="text-gray-600 mb-6">ابدأ بإضافة مهام جديدة للمستخدمين</p>
            <button @click="openCreateTaskModal"
                    class="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-2xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 inline-flex items-center space-x-3">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
              </svg>
              <span>إضافة مهمة جديدة</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <Pagination
        :current-page="pagination.currentPage"
        :total-items="pagination.total"
        :page-size="pagination.limit"
        :total-pages="pagination.totalPages"
        @page-change="handlePageChange"
      />

      <!-- Create/Edit Task Modal -->
      <Modal v-model:show="showTaskModal" :title="modalTitle" size="medium">
        <TaskForm
          v-if="showTaskModal"
          :task="editingTask"
          :users="usersStore.users"
          :is-admin="true"
          :loading="formLoading"
          :error="formError"
          @submit="handleTaskSubmit"
          @cancel="closeTaskModal"
        />
      </Modal>

      <!-- Confirmation Modal -->
      <ConfirmationModal
        v-model:show="showConfirmModal"
        :title="confirmTitle"
        :message="confirmMessage"
        :description="confirmDescription"
        :type="confirmType"
        @confirm="confirmAction"
        @cancel="closeConfirmModal"
      />

      <!-- Toast Notification -->
      <ToastNotification
        v-model:show="showToast"
        :type="toastType"
        :title="toastTitle"
        :message="toastMessage"
        @close="showToast = false"
      />
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useTasksStore } from '@/stores/tasks'
import { useUsersStore } from '@/stores/users'
import AppLayout from '@/components/layout/AppLayout.vue'
import SearchInput from '@/components/common/SearchInput.vue'
import Modal from '@/components/common/ModalCommon.vue'
import ConfirmationModal from '@/components/common/ConfirmationModal.vue'
import ToastNotification from '@/components/common/ToastNotification.vue'
import TaskForm from '@/components/tasks/TaskForm.vue'
import Pagination from '@/components/common/PaginationCommon.vue'

const tasksStore = useTasksStore()
const usersStore = useUsersStore()

// States
const showTaskModal = ref(false)
const showConfirmModal = ref(false)
const editingTask = ref(null)
const formLoading = ref(false)
const formError = ref('')

// Toast states
const showToast = ref(false)
const toastType = ref('success')
const toastTitle = ref('')
const toastMessage = ref('')

// Confirmation modal data
const confirmActionType = ref('')
const confirmTask = ref(null)
const confirmCallback = ref(null)

// Filters and Pagination
const filters = reactive({
  search: '',
  status: 'all',
  userId: 'all'
})

const pagination = reactive({
  currentPage: 1,
  total: 0,
  limit: 10,
  totalPages: 0
})

// Computed properties
const allTasks = computed(() => {
  return tasksStore.tasks || []
})

const filteredTasks = computed(() => {
  let filtered = allTasks.value

  // Search filter
  if (filters.search) {
    const searchLower = filters.search.toLowerCase()
    filtered = filtered.filter(task => 
      task.title?.toLowerCase().includes(searchLower) ||
      task.description?.toLowerCase().includes(searchLower)
    )
  }

  // Status filter
  if (filters.status !== 'all') {
    switch (filters.status) {
      case 'completed':
        filtered = filtered.filter(task => task.completed)
        break
      case 'pending':
        filtered = filtered.filter(task => !task.completed)
        break
      case 'overdue':
        filtered = filtered.filter(task => isOverdue(task))
        break
    }
  }

  // User filter
  if (filters.userId !== 'all') {
    filtered = filtered.filter(task => {
      const userId = typeof task.userId === 'object' ? task.userId._id : task.userId
      return userId === filters.userId
    })
  }

  return filtered
})

const completedTasksCount = computed(() => 
  allTasks.value.filter(task => task.completed).length
)

const pendingTasksCount = computed(() => 
  allTasks.value.filter(task => !task.completed).length
)

const overdueTasksCount = computed(() => 
  allTasks.value.filter(task => isOverdue(task)).length
)

const modalTitle = computed(() => {
  return editingTask.value ? 'تعديل المهمة' : 'إضافة مهمة جديدة'
})

const confirmTitle = computed(() => {
  switch (confirmActionType.value) {
    case 'delete': return 'حذف المهمة'
    case 'toggle': return confirmTask.value?.completed ? 'إلغاء إكمال المهمة' : 'تعيين كمكتملة'
    default: return 'تأكيد الإجراء'
  }
})

const confirmMessage = computed(() => {
  switch (confirmActionType.value) {
    case 'delete': return `حذف المهمة "${confirmTask.value?.title}"`
    case 'toggle': return confirmTask.value?.completed 
      ? `إلغاء إكمال المهمة "${confirmTask.value?.title}"`
      : `تعيين المهمة "${confirmTask.value?.title}" كمكتملة`
    default: return 'هل أنت متأكد من تنفيذ هذا الإجراء؟'
  }
})

const confirmDescription = computed(() => {
  switch (confirmActionType.value) {
    case 'delete': return 'سيتم حذف المهمة بشكل دائم ولا يمكن التراجع عن هذا الإجراء.'
    case 'toggle': return confirmTask.value?.completed 
      ? 'سيتم إرجاع المهمة إلى قائمة المهام قيد التنفيذ.'
      : 'سيتم تعيين المهمة كمكتملة.'
    default: return 'هذا الإجراء لا يمكن التراجع عنه.'
  }
})

const confirmType = computed(() => {
  return confirmActionType.value === 'delete' ? 'danger' : 'warning'
})

// Helper methods
const getStatusColor = (task) => {
  if (task.completed) return 'bg-green-500'
  if (isOverdue(task)) return 'bg-red-500'
  return 'bg-yellow-500'
}

const isOverdue = (task) => {
  if (!task.dueDate || task.completed) return false
  return new Date(task.dueDate) < new Date()
}

const getPriorityClass = (priority) => {
  const classes = {
    high: 'bg-red-100 text-red-800',
    medium: 'bg-yellow-100 text-yellow-800',
    low: 'bg-green-100 text-green-800'
  }
  return classes[priority] || 'bg-gray-100 text-gray-800'
}

const getPriorityText = (priority) => {
  const texts = {
    high: 'عالي',
    medium: 'متوسط',
    low: 'منخفض'
  }
  return texts[priority] || priority
}

const getInitials = (userId) => {
  if (!userId) return 'U'
  if (typeof userId === 'object' && userId.username) {
    return userId.username.charAt(0).toUpperCase()
  }
  if (typeof userId === 'string') {
    const user = usersStore.users.find(u => u._id === userId)
    return user?.username?.charAt(0).toUpperCase() || 'U'
  }
  return 'U'
}

const getUsername = (userId) => {
  if (!userId) return 'غير معين'
  if (typeof userId === 'object' && userId.username) {
    return userId.username
  }
  if (typeof userId === 'string') {
    const user = usersStore.users.find(u => u._id === userId)
    return user?.username || 'مستخدم'
  }
  return 'غير معين'
}

const formatDate = (date) => {
  if (!date) return 'لا يوجد تاريخ'
  try {
    return new Date(date).toLocaleDateString('ar-EG')
  } catch (error) {
    console.error('❌ Error formatting date:', error)
    return 'تاريخ غير صالح'
  }
}

// Methods
const fetchTasks = async () => {
  try {
    await tasksStore.fetchAllAdminTasks({
      page: pagination.currentPage,
      limit: pagination.limit,
      ...filters
    })
  } catch (error) {
    console.error('Error fetching tasks:', error)
    showToastMessage('error', 'خطأ', 'فشل في جلب المهام')
  }
}

const openCreateTaskModal = () => {
  editingTask.value = null
  formError.value = ''
  showTaskModal.value = true
}

const openEditModal = (task) => {
  editingTask.value = {
    _id: task._id,
    title: task.title,
    description: task.description,
    priority: task.priority,
    dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
    completed: task.completed,
    userId: typeof task.userId === 'object' ? task.userId._id : task.userId
  }
  formError.value = ''
  showTaskModal.value = true
}

const toggleTaskStatus = (task) => {
  confirmTask.value = task
  confirmActionType.value = 'toggle'
  confirmCallback.value = async () => {
    try {
      await tasksStore.toggleCompletion(task._id)
      showToastMessage('success', 'تم بنجاح', `تم ${task.completed ? 'إلغاء إكمال' : 'إكمال'} المهمة بنجاح`)
    } catch (error) {
      console.error('Error toggling task status:', error)
      showToastMessage('error', 'خطأ', 'فشل في تغيير حالة المهمة')
    }
  }
  showConfirmModal.value = true
}

const confirmDelete = (task) => {
  confirmTask.value = task
  confirmActionType.value = 'delete'
  confirmCallback.value = async () => {
    try {
      await tasksStore.deleteTask(task._id)
      showToastMessage('success', 'تم بنجاح', `تم حذف المهمة "${task.title}" بنجاح`)
    } catch (error) {
      console.error('Error deleting task:', error)
      showToastMessage('error', 'خطأ', 'فشل في حذف المهمة')
    }
  }
  showConfirmModal.value = true
}

const handleTaskSubmit = async (taskData) => {
  formLoading.value = true
  formError.value = ''
  
  try {
    console.log('Saving task data:', taskData)
    
    if (editingTask.value) {
      await tasksStore.updateTask(editingTask.value._id, taskData)
      showToastMessage('success', 'تم بنجاح', `تم تحديث المهمة "${taskData.title}" بنجاح`)
    } else {
      await tasksStore.createTask(taskData)
      showToastMessage('success', 'تم بنجاح', `تم إنشاء المهمة "${taskData.title}" بنجاح`)
    }
    
    closeTaskModal()
    await fetchTasks()
    
  } catch (error) {
    console.error('❌ Error saving task:', error)
    formError.value = error.message || 'فشل في حفظ المهمة'
    showToastMessage('error', 'خطأ', formError.value)
  } finally {
    formLoading.value = false
  }
}

const confirmAction = () => {
  if (confirmCallback.value) {
    confirmCallback.value()
  }
  closeConfirmModal()
}

const closeTaskModal = () => {
  showTaskModal.value = false
  editingTask.value = null
  formError.value = ''
  formLoading.value = false
}

const closeConfirmModal = () => {
  showConfirmModal.value = false
  confirmTask.value = null
  confirmActionType.value = ''
  confirmCallback.value = null
}

const handlePageChange = (page) => {
  pagination.currentPage = page
  fetchTasks()
}

const showToastMessage = (type, title, message) => {
  toastType.value = type
  toastTitle.value = title
  toastMessage.value = message
  showToast.value = true
}

// Watch for filter changes
watch(() => filters, () => {
  pagination.currentPage = 1
  fetchTasks()
}, { deep: true })

// Lifecycle
onMounted(async () => {
  console.log('🚀 AdminTasks mounted - fetching data...')
  await Promise.all([
    usersStore.fetchUsers(),
    fetchTasks()
  ])
})
</script>