import api from './api'
import { handleApiError, createFormData } from './api'

export const authService = {
  /**
   * تسجيل الدخول
   */
  async login(credentials) {
    try {
      console.log(' Sending login request to server...')
      const response = await api.post('/auth/login', credentials)
      console.log(' Login response received:', response.data)
      return response.data // إرجاع response.data مباشرة
    } catch (error) {
      console.error(' Login service error:', error)
      throw handleApiError(error)
    }
  },

  /**
   * تسجيل مستخدم جديد
   */
  async register(userData) {
    try {
      console.log(' Sending register request to server...')
      const response = await api.post('/auth/register', userData)
      console.log('Register response received:', response.data)
      return response.data // إرجاع response.data مباشرة
    } catch (error) {
      console.error(' Register service error:', error)
      throw handleApiError(error)
    }
  },

  /**
   * تسجيل الخروج
   */
  async logout() {
    try {
      const response = await api.post('/auth/logout')
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  },

  /**
   * جلب بيانات المستخدم الحالي
   */
  async getCurrentUser() {
    try {
      const response = await api.get('/auth/me')
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  },

  /**
   * تحديث الملف الشخصي
   */
  async updateProfile(profileData) {
    try {
      const formData = createFormData(profileData)
      const response = await api.put('/users/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  },

  

  /**
   * تحديث كلمة المرور
   */
  async changePassword(passwordData) {
  try {
    const response = await api.put('/auth/change-password', passwordData)
    return response.data
  } catch (error) {
    throw handleApiError(error)
  }
},
  /**
   * طلب إعادة تعيين كلمة المرور
   */
  async forgotPassword(email) {
    try {
      const response = await api.post('/auth/forgot-password', { email })
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  },

  /**
   * إعادة تعيين كلمة المرور
   */
  async resetPassword(resetData) {
    try {
      const response = await api.post('/auth/reset-password', resetData)
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  },

  /**
   * تحديث التوكن
   */
  async refreshToken(refreshToken) {
    try {
      const response = await api.post('/auth/refresh-token', { refreshToken })
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  }
}