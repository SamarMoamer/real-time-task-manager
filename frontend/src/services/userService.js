import api from './api'
import { handleApiError, createFormData } from './api'

export const userService = {
  
   // جلب جميع المستخدمين (للمديرين فقط)
   
  async getAllUsers(params = {}) {
    try {
      const response = await api.get('/users', { params })
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  },

  
   // جلب مستخدم محدد
   
  async getUserById(id) {
    try {
      const response = await api.get(`/users/${id}`)
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  },

  
   // إنشاء مستخدم جديد (للمديرين فقط)
   
  async createUser(userData) {
    try {
      const response = await api.post('/users', userData)
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  },

  
   // تحديث مستخدم
   
  async updateUser(id, userData) {
    try {
      const response = await api.put(`/users/${id}`, userData)
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  },

  

   // حذف مستخدم (للمديرين فقط)
  
  async deleteUser(id) {
    try {
      const response = await api.delete(`/users/${id}`)
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  },

 
   // جلب الملف الشخصي للمستخدم الحالي
   
  async getProfile() {
    try {
      const response = await api.get('/users/profile')
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  },

  
   // تحديث الملف الشخصي
   
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

  
   // جلب أنشطة المستخدم
   
  async getActivities(params = {}) {
    try {
      const response = await api.get('/users/activities', { params })
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  },

  
   // تعطيل الحساب
   
  async deactivateAccount() {
    try {
      const response = await api.post('/users/deactivate')
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  },

  
   // تفعيل الحساب
   
  async activateAccount(id) {
    try {
      const response = await api.patch(`/users/${id}/activate`)
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  },

  
   // تغيير دور المستخدم (للمديرين فقط)
  
  async changeUserRole(id, role) {
    try {
      const response = await api.patch(`/users/${id}/role`, { role })
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  },

  
   // جلب إحصائيات المستخدم
   
  async getUserStats(id) {
    try {
      const response = await api.get(`/users/${id}/stats`)
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  },

  
   // جلب مهام المستخدم
   
  async getUserTasks(id, params = {}) {
    try {
      const response = await api.get(`/users/${id}/tasks`, { params })
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  },

 
   // البحث عن المستخدمين
   
  async searchUsers(query, params = {}) {
    try {
      const response = await api.get('/users/search', {
        params: { q: query, ...params }
      })
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  },

  
   // جلب المستخدمين المقترحين للتعيين
   
  async getAssignableUsers(params = {}) {
    try {
      const response = await api.get('/users/assignable', { params })
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  },

   async toggleUserStatus(id) {
    try {
      console.log('🔄 Toggling user status for:', id)
      const user = await this.getUserById(id)
      const newStatus = !user.data.isActive
      
      const response = await this.updateUser(id, { isActive: newStatus })
      return response
    } catch (error) {
      console.error(' Error toggling user status:', error)
      throw handleApiError(error)
    }
  },

}