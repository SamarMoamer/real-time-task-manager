import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  }
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore()
    const token = authStore.token || localStorage.getItem('authToken')
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // Add timestamp to avoid caching
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        _t: Date.now()
      }
    }
    
    console.log(`🔄 API Request: ${config.method?.toUpperCase()} ${config.url}`, config.params || config.data)
    return config
  },
  (error) => {
    console.error(' API Request Error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(` API Response: ${response.status} ${response.config.url}`, response.data)
    return response
  },
  (error) => {
    const authStore = useAuthStore()
    
    console.error(' API Response Error:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.response?.data?.message || error.message
    })

    // Handle specific error cases
    if (error.response?.status === 401) {
      console.warn(' Authentication failed, logging out...')
      authStore.logout()
      window.location.href = '/login'
    } else if (error.response?.status === 403) {
      console.warn(' Access denied - insufficient permissions')
    } else if (error.response?.status === 429) {
      console.warn('Rate limit exceeded')
    } else if (error.code === 'NETWORK_ERROR') {
      console.error(' Network error - please check your connection')
    }

    return Promise.reject(error)
  }
)

// Helper functions
export const handleApiError = (error) => {
  const message = error.response?.data?.message || error.message || 'حدث خطأ غير متوقع'
  const status = error.response?.status
  
  return {
    message,
    status,
    originalError: error
  }
}

export const createFormData = (data) => {
  const formData = new FormData()
  Object.keys(data).forEach(key => {
    if (data[key] !== null && data[key] !== undefined) {
      formData.append(key, data[key])
    }
  })
  return formData
}

export default api