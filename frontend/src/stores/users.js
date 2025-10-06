import { defineStore } from 'pinia'
import { ref, reactive, computed } from 'vue'
import { userService } from '@/services/userService'

export const useUsersStore = defineStore('users', () => {
  // State
  const users = ref([])
  const currentUser = ref(null)
  const isLoading = ref(false)
  const error = ref(null)
  const userActivities = ref([])

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

  // Getters
const activeUsers = computed(() => 
  users.value.filter(user => user && user.isActive === true)
)

const adminUsers = computed(() => 
  users.value.filter(user => user && user.role === 'admin')
)

const filteredUsers = computed(() => {
  let filtered = users.value.filter(user => user) // تصفية المستخدمين غير المعرفين

  // Search filter
  if (filters.search) {
    const searchLower = filters.search.toLowerCase()
    filtered = filtered.filter(user => {
      const username = user.username || ''
      const email = user.email || ''
      return username.toLowerCase().includes(searchLower) ||
             email.toLowerCase().includes(searchLower)
    })
  }

  // Role filter
  if (filters.role !== 'all') {
    filtered = filtered.filter(user => user.role === filters.role)
  }

  // Active status filter - مع معالجة القيم غير المعرفة
  if (filters.isActive !== 'all') {
    const isActive = filters.isActive === 'true'
    filtered = filtered.filter(user => {
      // إذا كانت isActive غير معرفة، تعتبر غير نشط
      if (user.isActive === undefined) return !isActive
      return user.isActive === isActive
    })
  }

  return filtered
})

  // Actions
  const fetchUsers = async (params = {}) => {
    isLoading.value = true
    error.value = null
    
    try {
      console.log('📤 Fetching users from API...')
      const response = await userService.getAllUsers(params)
      console.log('📥 Users API response:', response)
      
      if (response.data && Array.isArray(response.data)) {
        users.value = response.data
        console.log('✅ Users loaded to store:', users.value.length)
      } else if (response.data && response.data.data) {
        users.value = response.data.data
        console.log('✅ Users loaded from data property:', users.value.length)
      } else {
        users.value = []
        console.warn('⚠️ No users data in response')
      }
      
    } catch (err) {
      console.error('❌ Fetch users error:', err)
      error.value = err.message
    } finally {
      isLoading.value = false
    }
  }

  const fetchUser = async (id) => {
    try {
      const response = await userService.getUserById(id)
      currentUser.value = response.data.data
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'فشل في جلب بيانات المستخدم'
      throw err
    }
  }

  const createUser = async (userData) => {
  isLoading.value = true
  error.value = null
  
  try {
    console.log('📝 Creating user with data:', userData)
    const response = await userService.createUser(userData)
    
    // التأكد من أن البيانات موجودة وتحتوي على الحقول المطلوبة
    const newUser = response.data?.data || response.data
    if (newUser) {
      // التأكد من وجود الحقول الأساسية
      const userWithDefaults = {
        ...newUser,
        isActive: newUser.isActive !== undefined ? newUser.isActive : true,
        username: newUser.username || 'مستخدم جديد',
        email: newUser.email || '',
        role: newUser.role || 'user',
        createdAt: newUser.createdAt || new Date().toISOString()
      }
      users.value.unshift(userWithDefaults)
      console.log('✅ User created successfully:', userWithDefaults)
    } else {
      console.warn('⚠️ No user data in response')
    }
    
    return response.data
  } catch (err) {
    console.error('❌ Error creating user:', err)
    error.value = err.response?.data?.message || 'فشل في إنشاء المستخدم'
    throw err
  } finally {
    isLoading.value = false
  }
}
   const updateUser = async (id, updates) => {
  isLoading.value = true
  error.value = null
  
  try {
    const response = await userService.updateUser(id, updates)
    const index = users.value.findIndex(user => user._id === id)
    if (index !== -1) {
      users.value[index] = response.data.data
    }
    
    return response.data
  } catch (err) {
    error.value = err.response?.data?.message || 'فشل في تحديث المستخدم'
    throw err
  } finally {
    isLoading.value = false
  }
}
  const deleteUser = async (id) => {
    isLoading.value = true
    error.value = null
    
    try {
      await userService.deleteUser(id)
      users.value = users.value.filter(user => user._id !== id)
      
      // Clear current user if it's the one being deleted
      if (currentUser.value && currentUser.value._id === id) {
        currentUser.value = null
      }
      
      return { success: true }
    } catch (err) {
      error.value = err.response?.data?.message || 'فشل في حذف المستخدم'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // في users.js store - تحديث هذه الدوال:

const toggleUserStatus = async (id) => {
  try {
    const response = await userService.toggleUserStatus(id)
    
    const index = users.value.findIndex(u => u._id === id)
    if (index !== -1) {
      users.value[index] = response.data.data
    }
    
    return response.data
  } catch (err) {
    error.value = err.response?.data?.message || 'فشل في تغيير حالة المستخدم'
    throw err
  }
}



  const fetchUserActivities = async (params = {}) => {
    try {
      const response = await userService.getActivities(params)
      userActivities.value = response.data.data
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'فشل في جلب أنشطة المستخدم'
      throw err
    }
  }

  const updateProfile = async (profileData) => {
    try {
      const response = await userService.updateProfile(profileData)
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'فشل في تحديث الملف الشخصي'
      throw err
    }
  }

  const deactivateAccount = async () => {
    try {
      const response = await userService.deactivateAccount()
      return response
    } catch (err) {
      error.value = err.response?.data?.message || 'فشل في تعطيل الحساب'
      throw err
    }
  }

  const updateFilters = (newFilters) => {
    Object.assign(filters, newFilters)
    pagination.currentPage = 1
    fetchUsers()
  }

  const clearFilters = () => {
    Object.assign(filters, {
      search: '',
      role: 'all',
      isActive: 'all'
    })
    pagination.currentPage = 1
    fetchUsers()
  }

  const setPage = (page) => {
    pagination.currentPage = page
    fetchUsers()
  }

  const clearError = () => {
    error.value = null
  }

  const clearCurrentUser = () => {
    currentUser.value = null
  }

  return {
    // State
    users,
    currentUser,
    isLoading,
    error,
    userActivities,
    filters,
    pagination,
    
    // Getters
    activeUsers,
    adminUsers,
    filteredUsers,
    
    // Actions
    fetchUsers,
    fetchUser,
    createUser,
    updateUser,
    deleteUser,
    toggleUserStatus,
    fetchUserActivities,
    updateProfile,
    deactivateAccount,
    updateFilters,
    clearFilters,
    setPage,
    clearError,
    clearCurrentUser
  }
})