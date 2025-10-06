<template>
  <aside 
    class="fixed top-0 right-0 bg-white/95 backdrop-blur-xl border-l border-gray-200/60 shadow-xl z-40 transition-all duration-300 ease-in-out flex flex-col"
    :class="[
      // في الشاشات الكبيرة
      sidebarStore.isCollapsed ? 'w-20' : 'w-64',
      // في الجوال
      isMobile ? (sidebarStore.isMobileOpen ? 'translate-x-0' : 'translate-x-full') : 'translate-x-0'
    ]"
    style="height: 100vh; top: 0;"
    dir="rtl"
  >
    <!-- Sidebar Header -->
    <div class="p-4 md:p-6 border-b border-gray-200/60 flex-shrink-0">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3 space-x-reverse" :class="sidebarStore.isCollapsed && !isMobile ? 'justify-center w-full' : ''">
          <div class="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
            <svg class="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
            </svg>
          </div>
          <div v-if="!sidebarStore.isCollapsed || isMobile" class="min-w-0 flex-1 text-right">
            <h2 class="text-lg font-bold text-gray-900 truncate">نظام المهام</h2>
            <p class="text-xs text-gray-500 truncate">الإصدار 1.0.0</p>
          </div>
        </div>
        
        <!-- Close Button for Mobile -->
        <button 
          v-if="isMobile && sidebarStore.isMobileOpen"
          @click="sidebarStore.closeMobile()"
          class="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors duration-200 flex-shrink-0"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    </div>

    <!-- Navigation Menu -->
    <nav class="flex-1 p-4 space-y-2 overflow-y-auto">
      <!-- Dashboard -->
      <router-link 
        to="/" 
        class="flex items-center space-x-3 space-x-reverse p-3 rounded-2xl transition-all duration-300 group min-h-[50px]"
        :class="isActive('/') ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25' : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'"
        @click="handleNavigation"
      >
        <div class="relative flex-shrink-0">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
          </svg>
        </div>
        <span v-if="!sidebarStore.isCollapsed || isMobile" class="font-medium transition-all duration-300 flex-1 text-right">لوحة التحكم</span>
      </router-link>

      <!-- Tasks - يظهر للمستخدم العادي والمسؤول -->
      <router-link 
        v-if="!authStore.isAdmin"
        to="/tasks" 
        class="flex items-center space-x-3 space-x-reverse p-3 rounded-2xl transition-all duration-300 group min-h-[50px]"
        :class="isActive('/tasks') ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25' : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'"
        @click="handleNavigation"
      >
        <div class="relative flex-shrink-0">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
          </svg>
        </div>
        <span v-if="!sidebarStore.isCollapsed || isMobile" class="font-medium transition-all duration-300 flex-1 text-right">مهامي</span>
      </router-link>

      <!-- جميع المهام - يظهر للمسؤول فقط -->
      <router-link 
        v-if="authStore.isAdmin"
        to="/admin/tasks" 
        class="flex items-center space-x-3 space-x-reverse p-3 rounded-2xl transition-all duration-300 group min-h-[50px]"
        :class="isActive('/admin/tasks') ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25' : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'"
        @click="handleNavigation"
      >
        <div class="relative flex-shrink-0">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
          </svg>
        </div>
        <span v-if="!sidebarStore.isCollapsed || isMobile" class="font-medium transition-all duration-300 flex-1 text-right">جميع المهام</span>
      </router-link>

      <!-- Analytics -->
      <router-link 
        to="/analytics" 
        class="flex items-center space-x-3 space-x-reverse p-3 rounded-2xl transition-all duration-300 group min-h-[50px]"
        :class="isActive('/analytics') ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25' : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'"
        @click="handleNavigation"
      >
        <div class="relative flex-shrink-0">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
          </svg>
        </div>
        <span v-if="!sidebarStore.isCollapsed || isMobile" class="font-medium transition-all duration-300 flex-1 text-right">التحليلات</span>
      </router-link>

      <!-- Admin Section - يظهر للمسؤول فقط -->
      <div v-if="authStore.isAdmin && (!sidebarStore.isCollapsed || isMobile)" class="pt-4 border-t border-gray-200/60">
        <p v-if="!sidebarStore.isCollapsed || isMobile" class="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider truncate text-right">الإدارة</p>
        
        <router-link 
          to="/admin/users" 
          class="flex items-center space-x-3 space-x-reverse p-3 rounded-2xl transition-all duration-300 group min-h-[50px]"
          :class="isActive('/admin/users') ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/25' : 'text-gray-600 hover:bg-green-50 hover:text-green-600'"
          @click="handleNavigation"
        >
          <div class="relative flex-shrink-0">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
            </svg>
          </div>
          <span v-if="!sidebarStore.isCollapsed || isMobile" class="font-medium transition-all duration-300 flex-1 text-right">المستخدمين</span>
        </router-link>
      </div>      
    </nav>

    <div v-if="!sidebarStore.isCollapsed && !isMobile" class="p-4 border-t border-gray-200/60 flex-shrink-0">
      <div class="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-4 text-white shadow-lg text-right">
        <div class="flex items-center justify-between mb-2">
          <span class="text-lg font-bold">{{ completedTasks }}/{{ totalTasks }}</span>
          <span class="text-sm font-medium truncate">المهام المكتملة</span>
        </div>
        <div class="w-full bg-white/20 rounded-full h-2">
          <div class="bg-white h-2 rounded-full transition-all duration-500" :style="{ width: completionPercentage + '%' }"></div>
        </div>
        <p class="text-xs text-white/80 mt-2 text-center">{{ completionPercentage }}% إنجاز</p>
      </div>
    </div>

   
  </aside>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useSidebarStore } from '@/stores/sidebar'
import { useTasksStore } from '@/stores/tasks'

const route = useRoute()
const authStore = useAuthStore()
const sidebarStore = useSidebarStore()
const tasksStore = useTasksStore()

const isMobile = ref(false)

const checkMobile = () => {
  isMobile.value = window.innerWidth < 1024
}

const handleNavigation = () => {
  if (isMobile.value) {
    sidebarStore.closeMobile()
  }
}



const isActive = (path) => {
  return route.path === path
}

const totalTasks = computed(() => tasksStore.tasks?.length || 0)
const completedTasks = computed(() => tasksStore.tasks?.filter(task => task.completed)?.length || 0)
const completionPercentage = computed(() => {
  if (totalTasks.value === 0) return 0
  return Math.round((completedTasks.value / totalTasks.value) * 100)
})

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})
</script>

<style scoped>
/* إزالة الارتفاع المخصص للجوال */
@media (max-width: 768px) {
  aside {
    width: 85vw !important;
    max-width: 320px;
  }
}

/* تحسينات للخط العربي */
nav {
  font-family: 'Tajawal', sans-serif;
}

/* تحسينات للتمرير */
.overflow-y-auto {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 #f1f5f9;
}

.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 10px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* تأكد من أن السيدبار يغطي الارتفاع بالكامل */
aside {
  height: 100vh !important;
  top: 0 !important;
}
</style>