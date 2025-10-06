<template>
  <AppLayout>
    <div class="space-y-6 p-6">
      <!-- Header -->
      <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 class="text-2xl lg:text-3xl font-bold text-gray-900">إدارة المستخدمين</h1>
          <p class="text-gray-600 mt-2">إدارة حسابات المستخدمين في النظام</p>
        </div>
        
        <div class="flex items-center space-x-4 space-x-reverse">
          <!-- Search -->
          <SearchInput
            v-model="searchQuery"
            placeholder="ابحث عن مستخدم..."
            @search="handleSearch"
          />
          
          <!-- Add User Button -->
          <button @click="openAddUserModal"
                  class="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-2xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-2xl shadow-blue-500/25 flex items-center space-x-3">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
            <span>إضافة مستخدم</span>
          </button>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/60 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">إجمالي المستخدمين</p>
              <p class="text-2xl font-bold text-gray-900 mt-1">{{ usersStore.users.length }}</p>
            </div>
            <div class="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/60 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">المستخدمين النشطين</p>
              <p class="text-2xl font-bold text-gray-900 mt-1">{{ usersStore.activeUsers.length }}</p>
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
              <p class="text-sm font-medium text-gray-600">المسؤولين</p>
              <p class="text-2xl font-bold text-gray-900 mt-1">{{ usersStore.adminUsers.length }}</p>
            </div>
            <div class="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/60 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">المستخدمين الجدد</p>
              <p class="text-2xl font-bold text-gray-900 mt-1">{{ newUsersThisMonth }}</p>
            </div>
            <div class="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center">
              <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Users Table -->
      <div class="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/60 overflow-hidden">
        <!-- Loading State -->
        <div v-if="usersStore.isLoading" class="flex justify-center py-12">
          <LoadingSpinner size="large" />
        </div>

        <!-- Users List -->
        <div v-else>
          <!-- Table Header -->
          <div class="grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50/50 border-b border-gray-200/60">
            <div class="col-span-3">
              <span class="text-sm font-medium text-gray-700">المستخدم</span>
            </div>
            <div class="col-span-3">
              <span class="text-sm font-medium text-gray-700">البريد الإلكتروني</span>
            </div>
            <div class="col-span-2">
              <span class="text-sm font-medium text-gray-700">الدور</span>
            </div>
            <div class="col-span-2">
              <span class="text-sm font-medium text-gray-700">الحالة</span>
            </div>
            <div class="col-span-2">
              <span class="text-sm font-medium text-gray-700">الإجراءات</span>
            </div>
          </div>

          <!-- Users Rows -->
          <div v-for="user in usersStore.filteredUsers" :key="user._id" 
               class="grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-200/60 hover:bg-gray-50/30 transition-colors duration-200">
            <!-- User Info -->
            <div class="col-span-3 flex items-center space-x-3 space-x-reverse">
              <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-semibold">
                {{ user.username?.charAt(0)?.toUpperCase() || 'U' }}
              </div>
              <div>
                <p class="font-medium text-gray-900">{{ user.username }}</p>
                <p class="text-sm text-gray-500">  {{ user && user.createdAt ? formatDate(user.createdAt) : 'غير محدد' }}</p>
              </div>
            </div>

            <!-- Email -->
            <div class="col-span-3 flex items-center">
              <p class="text-gray-600">{{ user.email }}</p>
            </div>

            <!-- Role -->
            <div class="col-span-2 flex items-center">
              <span class="px-3 py-1 rounded-full text-xs font-medium" 
                    :class="user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'">
                {{ user.role === 'admin' ? 'مسؤول' : 'مستخدم' }}
              </span>
            </div>

            <!-- Status -->
            <div class="col-span-2 flex items-center">
              <span class="px-3 py-1 rounded-full text-xs font-medium" 
                    :class="user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                {{ user.isActive ? 'نشط' : 'غير نشط' }}
              </span>
            </div>

            <!-- Actions -->
            <div class="col-span-2 flex items-center space-x-2 space-x-reverse">
              <!-- Edit Button -->
             <button type="button" 
        @click.prevent="editUser(user)"
        class="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors duration-200"
        title="تعديل المستخدم">
  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
  </svg>
</button>

              <!-- Toggle Status Button -->
              <button @click="toggleUserStatus(user)"
                      class="p-2 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50 transition-colors duration-200"
                      :title="user.isActive ? 'تعطيل' : 'تفعيل'">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path v-if="user.isActive" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path>
                  <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
              </button>

              <!-- Delete Button -->
              <button @click="deleteUser(user)"
                      class="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors duration-200"
                      title="حذف">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
              </button>
            </div>
          </div>

          <!-- Empty State -->
          <div v-if="usersStore.filteredUsers.length === 0" class="text-center py-12">
            <div class="max-w-md mx-auto">
              <div class="w-24 h-24 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">لا يوجد مستخدمين</h3>
              <p class="text-gray-600 mb-6">ابدأ بإضافة مستخدمين جديدين إلى النظام</p>
              <button @click="openAddUserModal"
                      class="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-2xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 inline-flex items-center space-x-3">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                </svg>
                <span>إضافة مستخدم</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <Pagination
        :current-page="usersStore.pagination.currentPage"
        :total-items="usersStore.pagination.total"
        :page-size="usersStore.pagination.limit"
        :total-pages="usersStore.pagination.totalPages"
        @page-change="handlePageChange"
      />

      <!-- Add/Edit User Modal -->
      <Modal v-model:show="showUserModal" :title="modalTitle" size="medium">
        <UserForm
           v-if="showUserModal"
          :user="editingUser"
          :loading="formLoading"
          :error="formError"
          @submit="handleUserSubmit"
          @cancel="closeUserModal"
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
import { ref, computed, onMounted, watch } from 'vue'
import { useUsersStore } from '@/stores/users'
import { useAuthStore } from '@/stores/auth'
import AppLayout from '@/components/layout/AppLayout.vue'
import SearchInput from '@/components/common/SearchInput.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import Modal from '@/components/common/ModalCommon.vue'
import ConfirmationModal from '@/components/common/ConfirmationModal.vue'
import ToastNotification from '@/components/common/ToastNotification.vue'
import UserForm from '@/components/admin/UserForm.vue'
import Pagination from '@/components/common/PaginationCommon.vue'

const usersStore = useUsersStore()
const authStore = useAuthStore()

// States
const searchQuery = ref('')
const showUserModal = ref(false)
const showConfirmModal = ref(false)
const editingUser = ref(null)
const formLoading = ref(false)
const formError = ref('')

// Toast states
const showToast = ref(false)
const toastType = ref('success')
const toastTitle = ref('')
const toastMessage = ref('')

// Confirmation modal data
const confirmActionType = ref('')
const confirmUser = ref(null)
const confirmCallback = ref(null)

// Computed properties
const newUsersThisMonth = computed(() => {
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()
  return usersStore.users.filter(user => {
    const userDate = new Date(user.createdAt)
    return userDate.getMonth() === currentMonth && userDate.getFullYear() === currentYear
  }).length
})

const modalTitle = computed(() => {
  return editingUser.value ? 'تعديل المستخدم' : 'إضافة مستخدم جديد'
})

const confirmTitle = computed(() => {
  switch (confirmActionType.value) {
    case 'delete': return 'حذف المستخدم'
    case 'toggle': return confirmUser.value?.isActive ? 'تعطيل المستخدم' : 'تفعيل المستخدم'
    default: return 'تأكيد الإجراء'
  }
})

const confirmMessage = computed(() => {
  switch (confirmActionType.value) {
    case 'delete': return `حذف المستخدم ${confirmUser.value?.username}`
    case 'toggle': return confirmUser.value?.isActive 
      ? `تعطيل المستخدم ${confirmUser.value?.username}`
      : `تفعيل المستخدم ${confirmUser.value?.username}`
    default: return 'هل أنت متأكد من تنفيذ هذا الإجراء؟'
  }
})

const confirmDescription = computed(() => {
  switch (confirmActionType.value) {
    case 'delete': return 'سيتم حذف المستخدم بشكل دائم ولا يمكن التراجع عن هذا الإجراء.'
    case 'toggle': return confirmUser.value?.isActive 
      ? 'لن يتمكن المستخدم من الدخول إلى النظام بعد التعطيل.'
      : 'سيتمكن المستخدم من الدخول إلى النظام بعد التفعيل.'
    default: return 'هذا الإجراء لا يمكن التراجع عنه.'
  }
})

const confirmType = computed(() => {
  return confirmActionType.value === 'delete' ? 'danger' : 'warning'
})

// Methods
const formatDate = (date) => {
  if (!date) return 'لا يوجد تاريخ'
  try {
    const dateObj = new Date(date)
    if (isNaN(dateObj.getTime())) {
      return 'تاريخ غير صالح'
    }
    return dateObj.toLocaleDateString('ar-EG')
  } catch (error) {
    console.error(' Error formatting date:', error, date)
    return 'تاريخ غير معروف'
  }
}

const handleSearch = () => {
  usersStore.updateFilters({ search: searchQuery.value })
}

const openAddUserModal = () => {
  editingUser.value = null
  formError.value = ''
  showUserModal.value = true
}

const editUser = (user, event = null) => {
  // منع إعادة التحميل بأي طريقة
  if (event) {
    event.preventDefault()
    event.stopPropagation()
    event.stopImmediatePropagation()
  }
  
  console.log('🎯 EDIT USER CALLED - Preventing default behavior')
  
  if (event && event.cancelable) {
    event.returnValue = false
  }
  
  editingUser.value = {
    _id: user._id,
    username: user.username,
    email: user.email,
    role: user.role,
    isActive: user.isActive
  }
  
  formError.value = ''
  showUserModal.value = true
  
  console.log('✅ Edit modal opened for:', user.username)
  
  return false
}
const toggleUserStatus = (user) => {
  if (user._id === authStore.user?._id) {
    showToastMessage('warning', 'تنبيه', 'لا يمكنك تعطيل حسابك الخاص!')
    return
  }
  
  confirmUser.value = user
  confirmActionType.value = 'toggle'
  confirmCallback.value = async () => {
    try {
      await usersStore.toggleUserStatus(user._id)
      showToastMessage('success', 'تم بنجاح', `تم ${user.isActive ? 'تعطيل' : 'تفعيل'} المستخدم "${user.username}" بنجاح`)
    } catch (error) {
      console.error('Error toggling user status:', error)
      showToastMessage('error', 'خطأ', 'فشل في تغيير حالة المستخدم')
    }
  }
  showConfirmModal.value = true
}

const deleteUser = (user) => {
  if (user._id === authStore.user?._id) {
    showToastMessage('warning', 'تنبيه', 'لا يمكنك حذف حسابك الخاص!')
    return
  }
  
  confirmUser.value = user
  confirmActionType.value = 'delete'
  confirmCallback.value = async () => {
    try {
      await usersStore.deleteUser(user._id)
      showToastMessage('success', 'تم بنجاح', `تم حذف المستخدم "${user.username}" بنجاح`)
    } catch (error) {
      console.error('Error deleting user:', error)
      showToastMessage('error', 'خطأ', 'فشل في حذف المستخدم')
    }
  }
  showConfirmModal.value = true
}

const handleUserSubmit = async (userData) => {
  formLoading.value = true
  formError.value = ''
  
  try {
    console.log(' Saving user data:', userData)
    
    if (editingUser.value) {
      await usersStore.updateUser(editingUser.value._id, userData)
      showToastMessage('success', 'تم بنجاح', `تم تحديث المستخدم "${userData.username}" بنجاح`)
    } else {
      await usersStore.createUser(userData)
      showToastMessage('success', 'تم بنجاح', `تم إنشاء المستخدم "${userData.username}" بنجاح`)
    }
    
    closeUserModal()
    
    await usersStore.fetchUsers()
    
  } catch (error) {
    console.error('❌ Error saving user:', error)
    formError.value = error.message || 'فشل في حفظ المستخدم'
    showToastMessage('error', 'خطأ', formError.value)
    
    // لا تغلق المودال في حالة الخطأ - يبقى مفتوحاً لعرض الخطأ
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

const closeUserModal = () => {
  console.log('🚪 Closing user modal')
  showUserModal.value = false
  editingUser.value = null
  formError.value = ''
  
  formLoading.value = false
}
const closeConfirmModal = () => {
  showConfirmModal.value = false
  confirmUser.value = null
  confirmActionType.value = ''
  confirmCallback.value = null
}

const handlePageChange = (page) => {
  usersStore.setPage(page)
}

const showToastMessage = (type, title, message) => {
  toastType.value = type
  toastTitle.value = title
  toastMessage.value = message
  showToast.value = true
}

// Watch for search query changes
watch(searchQuery, (newValue) => {
  usersStore.updateFilters({ search: newValue })
})

// Lifecycle
onMounted(() => {
  console.log('🚀 UsersAdmin mounted - fetching users...')
  usersStore.fetchUsers()
})
</script>