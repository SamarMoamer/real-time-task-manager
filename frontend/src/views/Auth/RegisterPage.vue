<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
    <!-- Animated Background -->
    <div class="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-600/10 animate-pulse"></div>
    
    <!-- Floating Elements -->
    <div class="absolute top-1/3 left-1/3 w-28 h-28 bg-purple-500/20 rounded-full blur-xl animate-float-slow"></div>
    <div class="absolute bottom-1/4 right-1/3 w-20 h-20 bg-pink-500/20 rounded-full blur-xl animate-float-slow" style="animation-delay: 3s;"></div>

    <div class="relative w-full max-w-md">
      <!-- Glass Card -->
      <div class="bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl p-8 transform transition-all duration-700 hover:shadow-3xl">
        
        <!-- Header -->
        <div class="text-center mb-8">
          <div class="flex justify-center mb-6">
            <div class="relative">
              <div class="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-purple-500/25 transform -rotate-12 transition-transform duration-500 hover:rotate-0">
                <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
                </svg>
              </div>
              <div class="absolute -top-2 -right-2 w-6 h-6 bg-yellow-500 border-4 border-gray-900 rounded-full animate-pulse"></div>
            </div>
          </div>

          <h1 class="text-3xl font-bold text-white mb-3">أنشئ حسابك</h1>
          <p class="text-gray-300">انضم إلى منصة إدارة المهام</p>
        </div>

        <!-- Register Form -->
        <RegisterForm />
      </div>
    </div>
  </div>
</template>

<script setup>
import RegisterForm from '@/components/auth/RegisterForm.vue'
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

onMounted(() => {
  if (authStore.isAuthenticated) {
    router.push('/')
  }
})
</script>