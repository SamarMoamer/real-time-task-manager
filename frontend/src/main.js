import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/main.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

app.mount('#app')

// تحديث عنوان الصفحة عند تغيير المسار
router.afterEach((to) => {
  const pageTitles = {
    'Dashboard': 'لوحة التحكم',
    'Login': 'تسجيل الدخول',
    'Register': 'إنشاء حساب',
    'Profile': 'الملف الشخصي',
    'TasksIndex': 'المهام',
    'TasksCreate': 'إنشاء مهمة',
    'TasksEdit': 'تعديل مهمة',
    'admin-users': 'إدارة المستخدمين',
    'admin-analytics': 'التحليلات',
    'AdminTasks': 'إدارة المهام',
    'analytics': 'التحليلات'
  }
  
  const pageTitle = pageTitles[to.name] || 'نظام إدارة المهام'
  document.title = pageTitle
})