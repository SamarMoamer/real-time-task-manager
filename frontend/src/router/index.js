import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const routes = [
  
  // Auth routes
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Auth/LoginPage.vue'),
    meta: { 
      requiresGuest: true,
      title: 'تسجيل الدخول'
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/Auth/RegisterPage.vue'),
    meta: { 
      requiresGuest: true,
      title: 'إنشاء حساب'
    }
  },


  // Dashboard
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('../views/DashboardPage.vue'),
    meta: { 
      requiresAuth: true,
      title: 'لوحة التحكم'
    }
  },

  // Tasks routes
  {
    path: '/tasks',
    name: 'TasksIndex',
    component: () => import('@/views/Tasks/IndexTask.vue'),
    meta: { 
      requiresAuth: true,
      title: 'المهام'
    }
  },
  {
    path: '/tasks/create',
    name: 'TasksCreate',
    component: () => import('../views/Tasks/CreateTask.vue'),
    meta: { 
      requiresAuth: true,
      title: 'إنشاء مهمة'
    }
  },
  {
    path: '/tasks/edit/:id',
    name: 'TasksEdit',
    component: () => import('@/views/Tasks/EditTask.vue'),
    meta: { 
      requiresAuth: true,
      title: 'تعديل مهمة'
    },
    props: true
  },

  // Profile
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('../views/ProfileUser.vue'),
    meta: { 
      requiresAuth: true,
      title: 'الملف الشخصي'
    }
  },

  // Admin routes
  {
    path: '/admin/users',
    name: 'admin-users',
    component: () => import('@/views/admin/UsersAdmin.vue'),
    meta: { 
      requiresAuth: true, 
      requiresAdmin: true,
      title: 'إدارة المستخدمين'
    }
  },
  {
    path: '/admin/tasks',
    name: 'AdminTasks',
    component: () => import('@/views/admin/AdminTasks.vue'),
    meta: { 
      requiresAuth: true, 
      requiresAdmin: true,
      title: 'إدارة المهام'
    }
  },
  
  // Analytics
  {
    path: '/analytics',
    name: 'analytics',
    component: () => import('@/views/AnalyticsPage.vue'),
    meta: { 
      requiresAuth: true,
      title: 'التحليلات'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard محسن
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  // تحديث العنوان قبل التنقل
  if (to.meta.title) {
    document.title = to.meta.title + ' | نظام إدارة المهام'
  }
  
  // التحقق من المصادقة
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
    return
  }
  
  // التحقق من صلاحيات المسؤول
  if (to.meta.requiresAdmin && !authStore.isAdmin) {
    next('/dashboard')
    return
  }
  
  // التحقق من أن المستخدم الضيف لا يصل للصفحات المحمية
  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next('/')
    return
  }
  
  next()
})

// تحديث العنوان بعد التنقل
router.afterEach((to) => {
  // إضافة تأثير سلس لتغيير العنوان
  setTimeout(() => {
    if (to.meta.title) {
      document.title = to.meta.title + ' | نظام إدارة المهام'
    } else {
      document.title = 'نظام إدارة المهام'
    }
  }, 100)
})

export default router