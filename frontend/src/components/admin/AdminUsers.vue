<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">إدارة المستخدمين</h1>
        <p class="text-gray-600 mt-1">إدارة حسابات المستخدمين في النظام</p>
      </div>
      
      <!-- Stats -->
      <div class="flex items-center space-x-4 space-x-reverse">
        <div class="text-center">
          <div class="text-2xl font-bold text-blue-600">{{ stats.totalUsers }}</div>
          <div class="text-sm text-gray-500">إجمالي المستخدمين</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-green-600">{{ stats.activeUsers }}</div>
          <div class="text-sm text-gray-500">نشطين</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-purple-600">{{ stats.adminUsers }}</div>
          <div class="text-sm text-gray-500">مديرين</div>
        </div>
      </div>
    </div>

    <!-- Filters and Search -->
    <div class="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/60 p-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <!-- Search -->
        <div class="md:col-span-2">
          <SearchInput
            v-model="filters.search"
            placeholder="ابحث بالاسم أو البريد الإلكتروني..."
            @search="fetchUsers"
          />
        </div>
        
        <!-- Role Filter -->
        <select v-model="filters.role" @change="fetchUsers"
                class="px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm">
          <option value="all">جميع الصلاحيات</option>
          <option value="user">مستخدم</option>
          <option value="admin">مدير</option>
        </select>
        
        <!-- Status Filter -->
        <select v-model="filters.isActive" @change="fetchUsers"
                class="px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm">
          <option value="all">جميع الحالات</option>
          <option value="true">نشط</option>
          <option value="false">غير نشط</option>
        </select>
      </div>
    </div>

    <!-- Users Table -->
    <div class="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/60 overflow-hidden">
      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center py-12">
        <LoadingSpinner size="large" />
      </div>

      <!-- Users Table -->
      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="bg-gray-50/80 border-b border-gray-200/60">
              <th class="px-6 py-4 text-right text-sm font-semibold text-gray-900">المستخدم</th>
              <th class="px-6 py-4 text-right text-sm font-semibold text-gray-900">الدور</th>
              <th class="px-6 py-4 text-right text-sm font-semibold text-gray-900">الحالة</th>
              <th class="px-6 py-4 text-right text-sm font-semibold text-gray-900">آخر دخول</th>
              <th class="px-6 py-4 text-right text-sm font-semibold text-gray-900">تاريخ الإنشاء</th>
              <th class="px-6 py-4 text-right text-sm font-semibold text-gray-900">الإجراءات</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200/60">
            <tr v-for="user in users" :key="user._id" 
                class="hover:bg-gray-50/50 transition-colors duration-200">
              <!-- User Info -->
              <td class="px-6 py-4">
                <div class="flex items-center space-x-3 space-x-reverse">
                  <div class="flex-shrink-0">
                    <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-semibold text-sm">
                      {{ user.username?.charAt(0)?.toUpperCase() }}
                    </div>
                  </div>
                  <div class="text-right">
                    <div class="font-medium text-gray-900">{{ user.username }}</div>
                    <div class="text-sm text-gray-500">{{ user.email }}</div>
                  </div>
                </div>
              </td>
              
              <!-- Role -->
              <td class="px-6 py-4">
                <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
                      :class="user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'">
                  <span class="w-2 h-2 rounded-full mr-1"
                        :class="user.role === 'admin' ? 'bg-purple-500' : 'bg-blue-500'"></span>
                  {{ user.role === 'admin' ? 'مدير' : 'مستخدم' }}
                </span>
              </td>
              
              <!-- Status -->
              <td class="px-6 py-4">
                <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
                      :class="user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                  <span class="w-2 h-2 rounded-full mr-1"
                        :class="user.isActive ? 'bg-green-500' : 'bg-red-500'"></span>
                  {{ user.isActive ? 'نشط' : 'غير نشط' }}
                </span>
              </td>
              
              <!-- Last Login -->
              <td class="px-6 py-4 text-sm text-gray-900">
                {{ formatLastLogin(user.lastLogin) }}
              </td>
              
              <!-- Created At -->
              <td class="px-6 py-4 text-sm text-gray-900">
                {{ formatDate(user.createdAt) }}
              </td>
              
              <!-- Actions -->
              <td class="px-6 py-4">
                <div class="flex items-center space-x-2 space-x-reverse justify-end">
                  <!-- Edit Button -->
                  <button @click="openEditModal(user)"
                          class="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors duration-200"
                          title="تعديل المستخدم">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                  </button>
                  
                  <!-- Toggle Status -->
                  <button @click="toggleUserStatus(user)"
                          class="p-2 rounded-xl transition-colors duration-200"
                          :class="user.isActive ? 'text-orange-600 hover:bg-orange-50' : 'text-green-600 hover:bg-green-50'"
                          :title="user.isActive ? 'تعطيل الحساب' : 'تفعيل الحساب'">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path v-if="user.isActive" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path>
                      <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                    </svg>
                  </button>
                  
                  <!-- Delete Button -->
                  <button @click="confirmDelete(user)"
                          class="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors duration-200"
                          :disabled="user._id === authStore.user?._id"
                          title="حذف المستخدم">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div v-if="!loading && users.length === 0" class="text-center py-12">
        <div class="max-w-md mx-auto">
          <div class="w-24 h-24 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">لا يوجد مستخدمين</h3>
          <p class="text-gray-600">لم يتم العثور على مستخدمين مطابقين للبحث</p>
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

    <!-- Edit User Modal -->
    <Modal v-model:show="showEditModal" :title="editUser ? 'تعديل المستخدم' : 'إنشاء مستخدم'" size="medium">
      <UserForm
        v-if="showEditModal"
        :user="editUser"
        @submit="handleUserSubmit"
        @cancel="showEditModal = false"
      />
    </Modal>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { userService } from '@/services/userService'
import SearchInput from '@/components/common/SearchInput.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import Pagination from '@/components/common/Pagination.vue'
import Modal from '@/components/common/ModalCommon.vue'
import UserForm from './UserForm.vue'
import { format, formatDistanceToNow } from 'date-fns'

const authStore = useAuthStore()

// Data
const users = ref([])
const loading = ref(false)
const showEditModal = ref(false)
const editUser = ref(null)

// Filters and Pagination
const filters = reactive({
  search: '',
  role: 'all',
  isActive: 'all'
})

const pagination = reactive({
  currentPage: 1,
  total: 0,
  limit: 10,
  totalPages: 0
})

const stats = reactive({
  totalUsers: 0,
  activeUsers: 0,
  adminUsers: 0
})

// Computed
const canEditUser = computed(() => (user) => {
  return user._id !== authStore.user?._id
})

// Methods
const fetchUsers = async (page = 1) => {
  try {
    loading.value = true
    const params = {
      page,
      limit: pagination.limit,
      ...filters
    }

    // Remove 'all' values from filters
    Object.keys(params).forEach(key => {
      if (params[key] === 'all') {
        delete params[key]
      }
    })

    const response = await userService.getAllUsers(params)
    users.value = response.data.data
    pagination.total = response.data.pagination?.totalUsers || response.data.total
    pagination.totalPages = Math.ceil(pagination.total / pagination.limit)
    
    // Update stats (you might want to fetch this separately)
    updateStats()
  } catch (error) {
    console.error('Error fetching users:', error)
  } finally {
    loading.value = false
  }
}

const updateStats = () => {
  stats.totalUsers = pagination.total
  stats.activeUsers = users.value.filter(user => user.isActive).length
  stats.adminUsers = users.value.filter(user => user.role === 'admin').length
}

const formatLastLogin = (date) => {
  if (!date) return 'لم يسجل دخول'
  return formatDistanceToNow(new Date(date), { addSuffix: true })
}

const formatDate = (date) => {
  return format(new Date(date), 'dd/MM/yyyy')
}

const openEditModal = (user = null) => {
  editUser.value = user
  showEditModal.value = true
}

const toggleUserStatus = async (user) => {
  if (!canEditUser.value(user)) return

  try {
    const newStatus = !user.isActive
    await userService.updateUser(user._id, { isActive: newStatus })
    
    // Update local state
    user.isActive = newStatus
    updateStats()
  } catch (error) {
    console.error('Error updating user status:', error)
  }
}

const confirmDelete = async (user) => {
  if (!canEditUser.value(user)) return

  if (confirm(`هل أنت متأكد من حذف المستخدم "${user.username}"؟`)) {
    try {
      await userService.deleteUser(user._id)
      await fetchUsers(pagination.currentPage)
    } catch (error) {
      console.error('Error deleting user:', error)
    }
  }
}

const handleUserSubmit = async (userData) => {
  try {
    if (editUser.value) {
      // Update existing user
      await userService.updateUser(editUser.value._id, userData)
    } else {
      // Create new user
      await userService.createUser(userData)
    }
    
    showEditModal.value = false
    await fetchUsers(pagination.currentPage)
  } catch (error) {
    console.error('Error saving user:', error)
  }
}

const handlePageChange = (page) => {
  pagination.currentPage = page
  fetchUsers(page)
}

// Lifecycle
onMounted(() => {
  fetchUsers()
})
</script>