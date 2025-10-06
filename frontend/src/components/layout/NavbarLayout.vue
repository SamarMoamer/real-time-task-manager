<template>
  <nav class="bg-white/80 backdrop-blur-xl border-b border-gray-200/60 shadow-sm fixed top-0 left-0 right-0 z-50 w-full">
    <div class="px-4 py-3 md:px-6 md:py-4">
      <div class="flex items-center justify-between">
        <!-- Left Section -->
        <div class="flex items-center space-x-2 md:space-x-4">
          <!-- Toggle Sidebar Button -->
          <button 
            @click="sidebarStore.toggle()"
            class="p-2 rounded-xl text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-all duration-300 group"
          >
            <svg class="w-5 h-5 md:w-6 md:h-6 transform transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>

          <!-- Logo -->
          <div class="flex items-center space-x-2 md:space-x-3">
            <div class="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25 p-3">
              <svg class="w-4 h-4 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
            </div>
            <div class="hidden sm:block">
              <h1 class="text-lg md:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent p-3">
               مهامي
              </h1>
            </div>
          </div>
        </div>

        <!-- Right Section -->
        <div class="flex items-center space-x-2 md:space-x-4">
          <!-- User Menu -->
          <div class="relative group">
            <button class="flex items-center space-x-2 md:space-x-3 p-1 md:p-2 rounded-2xl hover:bg-gray-50 transition-all duration-300">
              <div class="relative">
                <!-- ✅ استخدام authStore.getUserAvatar مباشرة -->
                <div v-if="authStore.getUserAvatar" 
                     class="w-8 h-8 md:w-10 md:h-10 rounded-2xl flex items-center justify-center overflow-hidden shadow-lg border-2 border-white">
                  <img :src="authStore.getUserAvatar" 
                       :alt="authStore.user?.username"
                       class="w-full h-full object-cover">
                </div>
                <div v-else
                     class="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-semibold shadow-lg text-sm md:text-base">
                  {{ authStore.userInitials }}
                </div>
                <div class="absolute -bottom-1 -right-1 w-3 h-3 md:w-4 md:h-4 bg-green-400 border-2 border-white rounded-full"></div>
              </div>
              <div class="text-left hidden lg:block">
                <p class="font-semibold text-gray-900 text-sm md:text-base">{{ authStore.user?.username }}</p>
                <p class="text-xs text-gray-500 capitalize">{{ authStore.user?.role === 'admin' ? 'مدير' : 'مستخدم' }}</p>
              </div>
              <svg class="w-4 h-4 text-gray-400 transform transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>

            <!-- Dropdown Menu -->
            <div class="absolute right-0 top-full mt-2 w-56 md:w-64 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/60 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50">
              <div class="px-3 md:px-4 py-2 md:py-3 border-b border-gray-200/60">
                <p class="font-semibold text-gray-900 text-sm md:text-base">{{ authStore.user?.username }}</p>
                <p class="text-xs text-gray-500 truncate">{{ authStore.user?.email }}</p>
              </div>
              
              <div class="py-1 md:py-2">
                <router-link to="/profile" class="flex items-center space-x-2 md:space-x-3 px-3 md:px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 text-sm md:text-base">
                  <svg class="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                  <span>الملف الشخصي</span>
                </router-link>
              </div>
              
              <div class="border-t border-gray-200/60 pt-1 md:pt-2">
                <button @click="handleLogout" class="flex items-center space-x-2 md:space-x-3 px-3 md:px-4 py-2 text-red-600 hover:bg-red-50 w-full text-left transition-colors duration-200 text-sm md:text-base">
                  <svg class="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                  </svg>
                  <span>تسجيل الخروج</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
import { useSidebarStore } from '@/stores/sidebar'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const sidebarStore = useSidebarStore()
const router = useRouter()

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}
</script>