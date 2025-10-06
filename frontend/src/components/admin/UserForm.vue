<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <!-- Username -->
    <div class="group">
      <label class="block text-sm font-medium text-gray-700 mb-2">اسم المستخدم *</label>
      <input
        v-model="form.username"
        type="text"
        required
        class="block w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm"
        placeholder="أدخل اسم المستخدم"
        :class="{ 'border-red-500': errors.username }"
      >
      <p v-if="errors.username" class="text-sm text-red-500 mt-1">{{ errors.username }}</p>
    </div>

    <!-- Email -->
    <div class="group">
      <label class="block text-sm font-medium text-gray-700 mb-2">البريد الإلكتروني *</label>
      <input
        v-model="form.email"
        type="email"
        required
        class="block w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm"
        placeholder="أدخل البريد الإلكتروني"
        :class="{ 'border-red-500': errors.email }"
      >
      <p v-if="errors.email" class="text-sm text-red-500 mt-1">{{ errors.email }}</p>
    </div>

    <!-- Role -->
    <div class="group">
      <label class="block text-sm font-medium text-gray-700 mb-2">الدور *</label>
      <select
        v-model="form.role"
        class="block w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm"
        :class="{ 'border-red-500': errors.role }"
      >
        <option value="user">مستخدم</option>
        <option value="admin">مسؤول</option>
      </select>
      <p v-if="errors.role" class="text-sm text-red-500 mt-1">{{ errors.role }}</p>
    </div>

    <!-- Password (only for new users) -->
    <div class="group" v-if="!isEdit">
      <label class="block text-sm font-medium text-gray-700 mb-2">كلمة المرور *</label>
      <input
        v-model="form.password"
        type="password"
        required
        class="block w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm"
        placeholder="أدخل كلمة المرور"
        :class="{ 'border-red-500': errors.password }"
      >
      <p v-if="errors.password" class="text-sm text-red-500 mt-1">{{ errors.password }}</p>
    </div>

    <!-- Confirm Password (only for new users) -->
    <div class="group" v-if="!isEdit">
      <label class="block text-sm font-medium text-gray-700 mb-2">تأكيد كلمة المرور *</label>
      <input
        v-model="form.confirmPassword"
        type="password"
        required
        class="block w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm"
        placeholder="أعد إدخال كلمة المرور"
        :class="{ 'border-red-500': errors.confirmPassword }"
      >
      <p v-if="errors.confirmPassword" class="text-sm text-red-500 mt-1">{{ errors.confirmPassword }}</p>
    </div>

    <!-- Status (only for edit) -->
    <div class="group" v-if="isEdit">
      <label class="block text-sm font-medium text-gray-700 mb-2">حالة الحساب</label>
      <div class="flex items-center space-x-4 space-x-reverse">
        <label class="flex items-center">
          <input
            v-model="form.isActive"
            type="radio"
            :value="true"
            class="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
          >
          <span class="mr-2 text-sm text-gray-700">نشط</span>
        </label>
        <label class="flex items-center">
          <input
            v-model="form.isActive"
            type="radio"
            :value="false"
            class="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
          >
          <span class="mr-2 text-sm text-gray-700">غير نشط</span>
        </label>
      </div>
    </div>

    <!-- Error Message -->
    <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl text-sm flex items-center space-x-2">
      <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
      <span>{{ error }}</span>
    </div>

    <!-- Form Actions -->
    <div class="flex items-center justify-end space-x-3 space-x-reverse pt-6 border-t border-gray-200/60">
      <button type="button" @click="$emit('cancel')"
              class="px-6 py-3 border border-gray-300 text-gray-700 rounded-2xl font-semibold hover:bg-gray-50 transition-all duration-300">
        إلغاء
      </button>
      <button type="submit" :disabled="loading"
              class="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl font-semibold hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105">
        <span v-if="loading" class="flex items-center">
          <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ isEdit ? 'جاري التحديث...' : 'جاري الإنشاء...' }}
        </span>
        <span v-else>{{ isEdit ? 'تحديث المستخدم' : 'إنشاء المستخدم' }}</span>
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'

const props = defineProps({
  user: {
    type: Object,
    default: null
  },
  loading: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['submit', 'cancel'])

const isEdit = computed(() => !!props.user)

const errors = ref({})

const form = reactive({
  username: '',
  email: '',
  role: 'user',
  password: '',
  confirmPassword: '',
  isActive: true
})

// Initialize form when user prop changes
watch(() => props.user, (newUser) => {
  if (newUser) {
    form.username = newUser.username || ''
    form.email = newUser.email || ''
    form.role = newUser.role || 'user'
    form.isActive = newUser.isActive !== undefined ? newUser.isActive : true
    form.password = '' // لا نعرض كلمة المرور الحالية
    form.confirmPassword = ''
  } else {
    // Reset form for new user
    form.username = ''
    form.email = ''
    form.role = 'user'
    form.password = ''
    form.confirmPassword = ''
    form.isActive = true
  }
}, { immediate: true })

const validateForm = () => {
  errors.value = {}

  if (!form.username.trim()) {
    errors.value.username = 'اسم المستخدم مطلوب'
  } else if (form.username.length < 3) {
    errors.value.username = 'اسم المستخدم يجب أن يكون 3 أحرف على الأقل'
  }

  if (!form.email.trim()) {
    errors.value.email = 'البريد الإلكتروني مطلوب'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.value.email = 'البريد الإلكتروني غير صالح'
  }

  if (!form.role) {
    errors.value.role = 'الدور مطلوب'
  }

  if (!isEdit.value) {
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
  }

  return Object.keys(errors.value).length === 0
}

const handleSubmit = () => {
  if (!validateForm()) return

  const submitData = { 
    username: form.username.trim(),
    email: form.email.trim(),
    role: form.role,
    isActive: form.isActive
  }
  
  // إذا كان تعديلاً، لا نرسل كلمة المرور إذا كانت فارغة
  if (!isEdit.value || form.password) {
    submitData.password = form.password
  }
  
  console.log('Submitting user data:', submitData)
  emit('submit', submitData)
}
</script>