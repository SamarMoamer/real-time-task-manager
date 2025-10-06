<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 flex flex-col" dir="rtl">
    <!-- Navbar - ثابت في الأعلى -->
    <Navbar />
    
    <div class="flex flex-1 pt-16">
      <!-- Sidebar - ثابت على اليمين في الشاشات الكبيرة، منزلق في الصغيرة -->
      <Sidebar />
      
      <!-- Main Content - يأخذ المساحة المتبقية -->
      <main class="flex-1 transition-all duration-300 overflow-auto" 
            :class="sidebarStore.isCollapsed ? 'lg:mr-20' : 'lg:mr-64'">
        <div class="p-4 md:p-6 w-full">
          <slot />
        </div>
      </main>

      <!-- Mobile Sidebar Overlay -->
      <div v-if="sidebarStore.isMobileOpen && isMobile" 
           class="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
           @click="sidebarStore.closeMobile()">
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import Navbar from './NavbarLayout.vue'
import Sidebar from './SidebarLayout.vue'
import { useSidebarStore } from '@/stores/sidebar'

const sidebarStore = useSidebarStore()
const isMobile = ref(false)

const checkMobile = () => {
  isMobile.value = window.innerWidth < 1024
  if (!isMobile.value && sidebarStore.isMobileOpen) {
    sidebarStore.closeMobile()
  }
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})
</script>