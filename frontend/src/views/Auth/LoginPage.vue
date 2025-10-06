<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
    <!-- Animated Background -->
    <div class="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-600/10 animate-pulse"></div>
    
    <!-- Floating Elements -->
    <div class="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-500/20 rounded-full blur-xl animate-float-slow"></div>
    <div class="absolute bottom-1/3 right-1/4 w-24 h-24 bg-purple-500/20 rounded-full blur-xl animate-float-slow" style="animation-delay: 2s;"></div>

    <div class="relative w-full max-w-md">
      <!-- Glass Card -->
      <div class="bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl p-8 transform transition-all duration-700 hover:shadow-3xl">
        
        <!-- Header -->
        <div class="text-center mb-8">
          <div class="flex justify-center mb-6">
            <div class="relative">
              <div class="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/25 transform rotate-12 transition-transform duration-500 hover:rotate-0">
                <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
              </div>
              <div class="absolute -top-2 -right-2 w-6 h-6 bg-green-500 border-4 border-gray-900 rounded-full animate-pulse"></div>
            </div>
          </div>

          <h1 class="text-3xl font-bold text-white mb-3">مرحباً بعودتك</h1>
          <p class="text-gray-300">سجل الدخول إلى حسابك للمتابعة</p>
        </div>

        <LoginForm />     
      </div>
    </div>
  </div>
</template>

<script setup>
import LoginForm from '@/components/auth/LoginForm.vue'
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

<style scoped>
.animate-float-slow {
  animation: float 8s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px) translateX(0px); }
  50% { transform: translateY(-20px) translateX(10px); }
}
</style>