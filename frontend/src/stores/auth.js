import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '@/services/authService'
import socketService from '@/services/socket'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(JSON.parse(localStorage.getItem('user')) || null)
  const token = ref(localStorage.getItem('authToken') || null)
  const isLoading = ref(false)
  const error = ref(null)

  // ✅ إضافة حالة منفصلة للصورة الشخصية
  const userAvatar = ref(localStorage.getItem('userAvatar') || null)

  // Getters
  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const isAdmin = computed(() => user.value?.role === 'admin')
  const userInitials = computed(() => {
    if (!user.value?.username) return ''
    return user.value.username.charAt(0).toUpperCase()
  })
  
  // ✅ getter للصورة - يعطي الأولوية للصورة المحلية
  const getUserAvatar = computed(() => {
    return userAvatar.value || user.value?.avatar || null
  })

  // Actions
  const login = async (credentials) => {
    isLoading.value = true
    error.value = null
    
    try {
      console.log('🔐 Attempting login with:', credentials)
      const response = await authService.login(credentials)
      console.log('✅ Login response:', response)
      
      const { token: authToken, user: userData } = response
      
      if (!authToken || !userData) {
        throw new Error('Invalid response format from server')
      }
      
      // Update state
      token.value = authToken
      user.value = userData
      
      // ✅ استعادة الصورة المحلية إذا كانت موجودة
      const savedAvatar = localStorage.getItem(`userAvatar_${userData._id}`)
      if (savedAvatar) {
        userAvatar.value = savedAvatar
      }
      
      // Persist to localStorage
      localStorage.setItem('authToken', authToken)
      localStorage.setItem('user', JSON.stringify(userData))
      
      // Initialize socket connection
      socketService.connect(authToken)
      
      console.log('🎉 Login successful')
      return response
    } catch (err) {
      console.error('❌ Login error:', err)
      error.value = err.response?.data?.message || err.message || 'فشل تسجيل الدخول'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const register = async (userData) => {
    isLoading.value = true
    error.value = null
    
    try {
      console.log('📝 Attempting registration with:', userData)
      
      const registerData = {
        username: userData.username,
        email: userData.email,
        password: userData.password,
        confirmPassword: userData.confirmPassword
      }
      
      const response = await authService.register(registerData)
      console.log('✅ Registration response:', response)
      
      const { token: authToken, user: newUser } = response
      
      if (!authToken || !newUser) {
        throw new Error('Invalid response format from server')
      }
      
      token.value = authToken
      user.value = newUser
      localStorage.setItem('authToken', authToken)
      localStorage.setItem('user', JSON.stringify(newUser))
      
      socketService.connect(authToken)
      
      console.log('🎉 Registration successful')
      return response
    } catch (err) {
      console.error('❌ Registration error:', err)
      error.value = err.response?.data?.message || err.message || 'فشل التسجيل'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const logout = async () => {
    try {
      await authService.logout()
    } catch (err) {
      console.error('❌ Logout error:', err)
    } finally {
      // Clear state
      token.value = null
      user.value = null
      userAvatar.value = null
      error.value = null
      
      // Clear localStorage
      localStorage.removeItem('authToken')
      localStorage.removeItem('user')
      localStorage.removeItem('userAvatar')
      
      // Disconnect socket
      socketService.disconnect()
      
      console.log('👋 Logout successful')
    }
  }

  const getCurrentUser = async () => {
    try {
      const response = await authService.getCurrentUser()
      user.value = response.user
      
      // ✅ استعادة الصورة المحلية
      if (user.value?._id) {
        const savedAvatar = localStorage.getItem(`userAvatar_${user.value._id}`)
        if (savedAvatar) {
          userAvatar.value = savedAvatar
        }
      }
      
      localStorage.setItem('user', JSON.stringify(user.value))
      return response
    } catch (err) {
      console.error('❌ Get current user error:', err)
      logout()
      throw err
    }
  }

  const updateProfile = async (profileData) => {
    try {
      const { ...userData } = profileData
      
      // ✅ إرسال فقط بيانات المستخدم للسيرفر
      const response = await authService.updateProfile(userData)
      
      // ✅ تحديث بيانات المستخدم
      user.value = { 
        ...user.value, 
        ...response.user
      }
      
      localStorage.setItem('user', JSON.stringify(user.value))
      
      console.log('✅ Profile updated successfully')
      return response
    } catch (err) {
      error.value = err.response?.data?.message || err.message || 'فشل تحديث الملف الشخصي'
      throw err
    }
  }

  // ✅ دالة جديدة لرفع الصورة محلياً فقط
  const uploadAvatar = async (avatarFile) => {
    try {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        
        reader.onload = (e) => {
          try {
            const avatarDataUrl = e.target.result
            
            // ✅ حفظ الصورة في localStorage
            if (user.value?._id) {
              localStorage.setItem(`userAvatar_${user.value._id}`, avatarDataUrl)
            } else {
              localStorage.setItem('userAvatar', avatarDataUrl)
            }
            
            // ✅ تحديث الحالة
            userAvatar.value = avatarDataUrl
            
            console.log('✅ Avatar uploaded locally')
            resolve({ success: true, avatar: avatarDataUrl })
          } catch (error) {
            reject(error)
          }
        }
        
        reader.onerror = () => {
          reject(new Error('Failed to read image file'))
        }
        
        reader.readAsDataURL(avatarFile)
      })
    } catch (err) {
      error.value = err.message || 'فشل في رفع الصورة'
      throw err
    }
  }

  // ✅ دالة لحذف الصورة محلياً
  const removeAvatar = async () => {
    try {
      // ✅ حذف الصورة من localStorage
      if (user.value?._id) {
        localStorage.removeItem(`userAvatar_${user.value._id}`)
      } else {
        localStorage.removeItem('userAvatar')
      }
      
      // ✅ تحديث الحالة
      userAvatar.value = null
      
      console.log('✅ Avatar removed')
      return { success: true }
    } catch (err) {
      error.value = err.message || 'فشل في إزالة الصورة'
      throw err
    }
  }

  // ✅ دالة changePassword
  const changePassword = async (passwordData) => {
    isLoading.value = true
    error.value = null
    
    try {
      console.log('🔑 Attempting to change password')
      const response = await authService.changePassword(passwordData)
      console.log('✅ Password changed successfully')
      
      return response
    } catch (err) {
      console.error('❌ Change password error:', err)
      error.value = err.response?.data?.message || err.message || 'فشل في تغيير كلمة المرور'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const initializeAuth = () => {
    const savedToken = localStorage.getItem('authToken')
    const savedUser = localStorage.getItem('user')
    
    if (savedToken && savedUser) {
      token.value = savedToken
      user.value = JSON.parse(savedUser)
      
      // ✅ استعادة الصورة المحلية
      if (user.value?._id) {
        const savedAvatar = localStorage.getItem(`userAvatar_${user.value._id}`)
        if (savedAvatar) {
          userAvatar.value = savedAvatar
        }
      }
      
      socketService.connect(savedToken)
      console.log('🔄 Auth initialized from localStorage')
    }
  }

  const clearError = () => {
    error.value = null
  }

  return {
    // State
    user,
    token,
    isLoading,
    error,
    userAvatar, 
    
    // Getters
    isAuthenticated,
    isAdmin,
    userInitials,
    getUserAvatar, 
    
    // Actions
    login,
    register,
    logout,
    getCurrentUser,
    updateProfile,
    changePassword,
    uploadAvatar,  
    removeAvatar,  
    initializeAuth,
    clearError
  }
})