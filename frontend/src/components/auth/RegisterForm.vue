<template>
  <div class="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
    <!-- Animated Background Elements -->
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute -top-40 -right-32 w-80 h-80 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div class="absolute -bottom-40 -left-32 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      <div class="absolute top-40 left-1/2 w-80 h-80 bg-cyan-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
    </div>

    <div class="relative w-full max-w-md">
      <!-- Card -->
      <div class="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/60 p-8 transform transition-all duration-500 hover:shadow-3xl">
        
        <!-- Header -->
        <div class="text-center mb-8">
          <!-- Logo -->
          <div class="flex justify-center mb-6">
            <div class="relative">
              <div class="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/25">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
                </svg>
              </div>
              <div class="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 border-2 border-white rounded-full animate-pulse"></div>
            </div>
          </div>

          <h1 class="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
            أنشئ حسابك
          </h1>
          <p class="text-gray-600">انضم إلى منصة إدارة المهام</p>
        </div>

        <!-- Register Form -->
        <form @submit.prevent="handleRegister" class="space-y-5">
          <!-- Username Field -->
          <div class="group">
            <label class="block text-sm font-medium text-gray-700 mb-2 group-focus-within:text-green-600 transition-colors duration-200">
              اسم المستخدم
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400 group-focus-within:text-green-500 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
              </div>
              <input
                v-model="form.username"
                type="text"
                required
                class="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 placeholder-gray-400 bg-white/50 backdrop-blur-sm"
                placeholder="اختر اسم مستخدم"
                :class="{ 'border-red-500': errors.username }"
              >
            </div>
            <p v-if="errors.username" class="mt-1 text-sm text-red-500 flex items-center space-x-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span>{{ errors.username }}</span>
            </p>
          </div>

          <!-- Email Field -->
          <div class="group">
            <label class="block text-sm font-medium text-gray-700 mb-2 group-focus-within:text-green-600 transition-colors duration-200">
              البريد الإلكتروني
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400 group-focus-within:text-green-500 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path>
                </svg>
              </div>
              <input
                v-model="form.email"
                type="email"
                required
                class="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 placeholder-gray-400 bg-white/50 backdrop-blur-sm"
                placeholder="ادخل بريدك الإلكتروني"
                :class="{ 'border-red-500': errors.email }"
              >
            </div>
            <p v-if="errors.email" class="mt-1 text-sm text-red-500 flex items-center space-x-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span>{{ errors.email }}</span>
            </p>
          </div>

          <!-- Password Field -->
          <div class="group">
            <label class="block text-sm font-medium text-gray-700 mb-2 group-focus-within:text-green-600 transition-colors duration-200">
              كلمة المرور
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400 group-focus-within:text-green-500 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
              </div>
              <input
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                required
                class="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 placeholder-gray-400 bg-white/50 backdrop-blur-sm"
                placeholder="ادخل كلمة المرور"
                :class="{ 'border-red-500': errors.password }"
              >
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path v-if="showPassword" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path v-if="showPassword" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                  <path v-if="!showPassword" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
                </svg>
              </button>
            </div>
            <p v-if="errors.password" class="mt-1 text-sm text-red-500 flex items-center space-x-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span>{{ errors.password }}</span>
            </p>
          </div>

          <!-- Confirm Password Field -->
          <div class="group">
            <label class="block text-sm font-medium text-gray-700 mb-2 group-focus-within:text-green-600 transition-colors duration-200">
              تأكيد كلمة المرور
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400 group-focus-within:text-green-500 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
              </div>
              <input
                v-model="form.confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                required
                class="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 placeholder-gray-400 bg-white/50 backdrop-blur-sm"
                placeholder="أكد كلمة المرور"
                :class="{ 'border-red-500': errors.confirmPassword }"
              >
              <button
                type="button"
                @click="showConfirmPassword = !showConfirmPassword"
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path v-if="showConfirmPassword" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path v-if="showConfirmPassword" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                  <path v-if="!showConfirmPassword" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
                </svg>
              </button>
            </div>
            <p v-if="errors.confirmPassword" class="mt-1 text-sm text-red-500 flex items-center space-x-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span>{{ errors.confirmPassword }}</span>
            </p>
          </div>

          <!-- Terms Agreement -->
          <label class="flex items-start space-x-3 cursor-pointer">
            <input type="checkbox" v-model="form.agreeTerms" class="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500 mt-1">
            <span class="text-sm text-gray-600">
              أوافق على 
              <a href="#" class="text-green-600 hover:text-green-700 font-medium">الشروط والأحكام</a>
              و
              <a href="#" class="text-green-600 hover:text-green-700 font-medium">سياسة الخصوصية</a>
            </span>
          </label>

          <!-- Error Message -->
          <div v-if="authStore.error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl text-sm flex items-center space-x-2">
            <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>{{ authStore.error }}</span>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="authStore.isLoading || !form.agreeTerms"
            class="w-full bg-gradient-to-r from-green-500 to-blue-600 text-white py-3 px-4 rounded-2xl font-semibold hover:from-green-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
          >
            <span v-if="authStore.isLoading" class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              جاري إنشاء الحساب...
            </span>
            <span v-else class="flex items-center justify-center">
              <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
              </svg>
              إنشاء الحساب
            </span>
          </button>

          <!-- Divider -->
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white/80 text-gray-500">أو</span>
            </div>
          </div>

          <!-- Login Link -->
          <div class="text-center">
            <p class="text-gray-600">
              لديك حساب بالفعل؟
              <router-link to="/login" class="text-green-600 hover:text-green-700 font-semibold transition-colors duration-200">
                سجل الدخول
              </router-link>
            </p>
          </div>
        </form>
      </div>

      <!-- Footer -->
      <div class="text-center mt-6">
        <p class="text-sm text-gray-500">
          © 2024 TaskFlow. جميع الحقوق محفوظة.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const showPassword = ref(false)
const showConfirmPassword = ref(false)
const errors = ref({})

const form = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  agreeTerms: false
})

onMounted(() => {
  if (authStore.isAuthenticated) {
    router.push('/')
  }
})

const validateForm = () => {
  errors.value = {}

  if (!form.username) {
    errors.value.username = 'اسم المستخدم مطلوب'
  } else if (form.username.length < 3) {
    errors.value.username = 'اسم المستخدم يجب أن يكون 3 أحرف على الأقل'
  }

  if (!form.email) {
    errors.value.email = 'البريد الإلكتروني مطلوب'
  } else if (!/\S+@\S+\.\S+/.test(form.email)) {
    errors.value.email = 'البريد الإلكتروني غير صحيح'
  }

  if (!form.password) {
    errors.value.password = 'كلمة المرور مطلوبة'
  } else if (form.password.length < 6) {
    errors.value.password = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'
  }

  if (!form.confirmPassword) {
    errors.value.confirmPassword = 'تأكيد كلمة المرور مطلوب'
  } else if (form.password !== form.confirmPassword) {
    errors.value.confirmPassword = 'كلمات المرور غير متطابقة'
  }

  if (!form.agreeTerms) {
    errors.value.agreeTerms = 'يجب الموافقة على الشروط والأحكام'
  }

  return Object.keys(errors.value).length === 0
}

const handleRegister = async () => {
  if (!validateForm()) return

  try {
    // إرسال البيانات المطلوبة فقط بدون confirmPassword
    const registerData = {
      username: form.username,
      email: form.email,
      password: form.password,
      confirmPassword: form.confirmPassword // إزالته إذا كان يسبب مشكلة
    }
    
    await authStore.register(registerData)
    router.push('/')
  } catch (error) {
    console.error('Registration error:', error)
    
    // عرض رسالة الخطأ بشكل أفضل
    if (error.response?.data?.message) {
      errors.value.submit = error.response.data.message
    } else {
      errors.value.submit = 'حدث خطأ أثناء التسجيل'
    }
  }
}
</script>

<style scoped>
.animate-blob {
  animation: blob 7s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}

@keyframes blob {
  0% {
    transform: translate(0px, 0px) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
  100% {
    transform: translate(0px, 0px) scale(1);
  }
}
</style>