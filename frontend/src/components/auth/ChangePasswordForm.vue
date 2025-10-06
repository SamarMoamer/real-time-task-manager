<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <!-- رسالة الخطأ -->
    <div v-if="errorMessage" 
         class="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 flex items-center space-x-2 space-x-reverse">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
      <span>{{ errorMessage }}</span>
    </div>

    <!-- كلمة المرور الحالية -->
    <div class="group">
      <label for="currentPassword" class="block text-sm font-medium text-gray-700 mb-2">
        كلمة المرور الحالية
      </label>
      <div class="relative">
        <input
          id="currentPassword"
          v-model="form.currentPassword"
          :type="showCurrentPassword ? 'text' : 'password'"
          class="block w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 placeholder-gray-400 bg-white/50 backdrop-blur-sm pr-12"
          placeholder="أدخل كلمة المرور الحالية"
          required
        >
        <button
          type="button"
          @click="showCurrentPassword = !showCurrentPassword"
          class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path v-if="showCurrentPassword" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path v-if="showCurrentPassword" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            <path v-if="!showCurrentPassword" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m9.02 9.02l3.829 3.829" />
          </svg>
        </button>
      </div>
    </div>

    <!-- كلمة المرور الجديدة -->
    <div class="group">
      <label for="newPassword" class="block text-sm font-medium text-gray-700 mb-2">
        كلمة المرور الجديدة
      </label>
      <div class="relative">
        <input
          id="newPassword"
          v-model="form.newPassword"
          :type="showNewPassword ? 'text' : 'password'"
          class="block w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 placeholder-gray-400 bg-white/50 backdrop-blur-sm pr-12"
          placeholder="أدخل كلمة المرور الجديدة"
          required
          @input="validatePassword"
        >
        <button
          type="button"
          @click="showNewPassword = !showNewPassword"
          class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path v-if="showNewPassword" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path v-if="showNewPassword" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            <path v-if="!showNewPassword" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m9.02 9.02l3.829 3.829" />
          </svg>
        </button>
      </div>
      
      <!-- مؤشر قوة كلمة المرور -->
      <div v-if="form.newPassword" class="mt-3">
        <div class="flex items-center space-x-2 space-x-reverse mb-2">
          <div class="flex-1 bg-gray-200 rounded-full h-2">
            <div class="h-2 rounded-full transition-all duration-300" 
                 :class="passwordStrengthClass"></div>
          </div>
          <span class="text-xs font-medium" :class="passwordStrengthTextClass">
            {{ passwordStrengthText }}
          </span>
        </div>
        
        <!-- متطلبات كلمة المرور -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-gray-600">
          <div class="flex items-center space-x-2 space-x-reverse">
            <svg class="w-4 h-4" :class="hasMinLength ? 'text-green-500' : 'text-gray-400'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path v-if="hasMinLength" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
            <span>8 أحرف على الأقل</span>
          </div>
          <div class="flex items-center space-x-2 space-x-reverse">
            <svg class="w-4 h-4" :class="hasUpperCase ? 'text-green-500' : 'text-gray-400'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path v-if="hasUpperCase" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
            <span>حرف كبير واحد على الأقل</span>
          </div>
          <div class="flex items-center space-x-2 space-x-reverse">
            <svg class="w-4 h-4" :class="hasLowerCase ? 'text-green-500' : 'text-gray-400'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path v-if="hasLowerCase" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
            <span>حرف صغير واحد على الأقل</span>
          </div>
          <div class="flex items-center space-x-2 space-x-reverse">
            <svg class="w-4 h-4" :class="hasNumber ? 'text-green-500' : 'text-gray-400'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path v-if="hasNumber" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
            <span>رقم واحد على الأقل</span>
          </div>
        </div>
      </div>
    </div>

    <!-- تأكيد كلمة المرور الجديدة -->
    <div class="group">
      <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-2">
        تأكيد كلمة المرور الجديدة
      </label>
      <div class="relative">
        <input
          id="confirmPassword"
          v-model="form.confirmPassword"
          :type="showConfirmPassword ? 'text' : 'password'"
          class="block w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 placeholder-gray-400 bg-white/50 backdrop-blur-sm pr-12"
          placeholder="أعد إدخال كلمة المرور الجديدة"
          required
          @input="validatePasswordMatch"
        >
        <button
          type="button"
          @click="showConfirmPassword = !showConfirmPassword"
          class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path v-if="showConfirmPassword" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path v-if="showConfirmPassword" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            <path v-if="!showConfirmPassword" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m9.02 9.02l3.829 3.829" />
          </svg>
        </button>
      </div>
      
      <!-- رسالة تطابق كلمة المرور -->
      <div v-if="form.confirmPassword && !passwordsMatch" class="mt-2 flex items-center space-x-2 space-x-reverse text-red-600 text-sm">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <span>كلمات المرور غير متطابقة</span>
      </div>
      
      <div v-if="form.confirmPassword && passwordsMatch" class="mt-2 flex items-center space-x-2 space-x-reverse text-green-600 text-sm">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
        <span>كلمات المرور متطابقة</span>
      </div>
    </div>

    <!-- أزرار الإجراء -->
    <div class="flex items-center justify-end space-x-4 space-x-reverse pt-6 border-t border-gray-200/60">
      <button
        type="button"
        @click="$emit('cancel')"
        class="px-6 py-3 border border-gray-300 text-gray-700 rounded-2xl font-semibold hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-300"
      >
        إلغاء
      </button>
      
      <button
        type="submit"
        :disabled="!isFormValid || isLoading"
        class="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-2xl font-semibold hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
      >
        <span v-if="isLoading" class="flex items-center">
          <LoadingSpinner size="small" />
          <span class="mr-3">جاري التغيير...</span>
        </span>
        <span v-else>تغيير كلمة المرور</span>
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

// Emits
const emit = defineEmits(['submit', 'cancel'])

// State
const isLoading = ref(false)
const errorMessage = ref('')
const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

// Form data
const form = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// Computed properties
const hasMinLength = computed(() => form.newPassword.length >= 8)
const hasUpperCase = computed(() => /[A-Z]/.test(form.newPassword))
const hasLowerCase = computed(() => /[a-z]/.test(form.newPassword))
const hasNumber = computed(() => /[0-9]/.test(form.newPassword))
const hasSpecialChar = computed(() => /[!@#$%^&*(),.?":{}|<>]/.test(form.newPassword))

const passwordsMatch = computed(() => form.newPassword === form.confirmPassword)

const passwordStrength = computed(() => {
  let strength = 0
  if (hasMinLength.value) strength++
  if (hasUpperCase.value) strength++
  if (hasLowerCase.value) strength++
  if (hasNumber.value) strength++
  if (hasSpecialChar.value) strength++
  return strength
})

const passwordStrengthClass = computed(() => {
  const width = (passwordStrength.value / 5) * 100
  const colors = {
    0: 'bg-red-500',
    1: 'bg-red-500',
    2: 'bg-orange-500',
    3: 'bg-yellow-500',
    4: 'bg-blue-500',
    5: 'bg-green-500'
  }
  return `${colors[passwordStrength.value]} w-${Math.round(width / 20) * 20}`
})

const passwordStrengthText = computed(() => {
  const texts = {
    0: 'ضعيفة جداً',
    1: 'ضعيفة',
    2: 'متوسطة',
    3: 'جيدة',
    4: 'قوية',
    5: 'قوية جداً'
  }
  return texts[passwordStrength.value]
})

const passwordStrengthTextClass = computed(() => {
  const colors = {
    0: 'text-red-600',
    1: 'text-red-600',
    2: 'text-orange-600',
    3: 'text-yellow-600',
    4: 'text-blue-600',
    5: 'text-green-600'
  }
  return colors[passwordStrength.value]
})

const isFormValid = computed(() => {
  return form.currentPassword && 
         form.newPassword && 
         form.confirmPassword && 
         passwordsMatch.value &&
         passwordStrength.value >= 3
})

// Methods
const validatePassword = () => {
  // يمكن إضافة المزيد من التحقق هنا
}

const validatePasswordMatch = () => {
  // يمكن إضافة المزيد من التحقق هنا
}

const handleSubmit = async () => {
  if (!isFormValid.value) {
    errorMessage.value = 'يرجى ملء جميع الحقول بشكل صحيح'
    return
  }

  try {
    isLoading.value = true
    errorMessage.value = ''

    // إرسال البيانات إلى المكون الأب
    emit('submit', {
      currentPassword: form.currentPassword,
      newPassword: form.newPassword,
      confirmPassword: form.confirmPassword
    })

    // إعادة تعيين النموذج
    form.currentPassword = ''
    form.newPassword = ''
    form.confirmPassword = ''

  } catch (error) {
    errorMessage.value = error.message || 'حدث خطأ أثناء تغيير كلمة المرور'
  } finally {
    isLoading.value = false
  }
}

// Watchers
watch([() => form.currentPassword, () => form.newPassword, () => form.confirmPassword], () => {
  errorMessage.value = ''
})
</script>