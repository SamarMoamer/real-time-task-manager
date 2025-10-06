import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSidebarStore = defineStore('sidebar', () => {
  const isCollapsed = ref(false)
  const isMobileOpen = ref(false)

  const toggle = () => {
    if (window.innerWidth < 1024) {
      // في الجوال، نتحكم في فتح/إغلاق القائمة
      isMobileOpen.value = !isMobileOpen.value
    } else {
      // في الشاشات الكبيرة، نتحكم في طي/فرد القائمة
      isCollapsed.value = !isCollapsed.value
    }
  }

  const closeMobile = () => {
    isMobileOpen.value = false
  }

  const openMobile = () => {
    isMobileOpen.value = true
  }

  return {
    isCollapsed,
    isMobileOpen,
    toggle,
    closeMobile,
    openMobile
  }
})