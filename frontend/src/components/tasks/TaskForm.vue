<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <!-- Title -->
    <div class="group">
      <label class="block text-sm font-medium text-gray-700 mb-2 group-focus-within:text-blue-600 transition-colors duration-200">
        عنوان المهمة *
      </label>
      <input
        v-model="form.title"
        type="text"
        required
        maxlength="100"
        class="block w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 placeholder-gray-400 bg-white/50 backdrop-blur-sm"
        placeholder="أدخل عنوان المهمة"
        :class="{ 'border-red-500': errors.title }"
      >
      <div class="flex justify-between mt-1">
        <p v-if="errors.title" class="text-sm text-red-500 flex items-center space-x-1">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span>{{ errors.title }}</span>
        </p>
        <span class="text-xs text-gray-500">{{ form.title.length }}/100</span>
      </div>
    </div>

    <!-- Description -->
    <div class="group">
      <label class="block text-sm font-medium text-gray-700 mb-2 group-focus-within:text-blue-600 transition-colors duration-200">
        الوصف
      </label>
      <textarea
        v-model="form.description"
        rows="4"
        maxlength="1000"
        class="block w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 placeholder-gray-400 bg-white/50 backdrop-blur-sm resize-none"
        placeholder="أدخل وصف المهمة (اختياري)"
      ></textarea>
      <div class="flex justify-between mt-1">
        <span class="text-xs text-gray-500">{{ form.description.length }}/1000</span>
      </div>
    </div>

    <!-- Priority and Due Date -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Priority -->
      <div class="group">
        <label class="block text-sm font-medium text-gray-700 mb-2 group-focus-within:text-blue-600 transition-colors duration-200">
          الأولوية *
        </label>
        <div class="relative">
          <select
            v-model="form.priority"
            class="block w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm appearance-none"
          >
            <option value="low">منخفض</option>
            <option value="medium">متوسط</option>
            <option value="high">عالي</option>
          </select>
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <div class="w-2 h-2 rounded-full" :class="priorityDotColor"></div>
          </div>
        </div>
      </div>

      <!-- Due Date -->
      <div class="group">
        <label class="block text-sm font-medium text-gray-700 mb-2 group-focus-within:text-blue-600 transition-colors duration-200">
          تاريخ الاستحقاق
        </label>
        <div class="relative">
          <input
            v-model="form.dueDate"
            type="date"
            :min="minDate"
            class="block w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm"
          >
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Tags -->
    <div class="group">
      <label class="block text-sm font-medium text-gray-700 mb-2 group-focus-within:text-blue-600 transition-colors duration-200">
        الوسوم
      </label>
      <div class="flex flex-wrap gap-2 mb-2">
        <span v-for="(tag, index) in form.tags" :key="index"
              class="inline-flex items-center px-3 py-1 rounded-xl text-sm bg-blue-100 text-blue-700 font-medium">
          {{ tag }}
          <button @click="removeTag(index)" type="button" class="ml-2 text-blue-500 hover:text-blue-700">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </span>
      </div>
      <div class="flex space-x-2">
        <input
          v-model="newTag"
          type="text"
          maxlength="30"
          @keydown.enter.prevent="addTag"
          class="flex-1 px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 placeholder-gray-400 bg-white/50 backdrop-blur-sm"
          placeholder="أضف وسماً جديداً"
        >
        <button @click="addTag" type="button"
                class="px-4 py-3 bg-gray-100 text-gray-700 rounded-2xl hover:bg-gray-200 transition-colors duration-200 font-medium">
          إضافة
        </button>
      </div>
    </div>

    <!-- Assigned To -->
    <div class="group" v-if="users && users.length > 0">
      <label class="block text-sm font-medium text-gray-700 mb-2 group-focus-within:text-blue-600 transition-colors duration-200">
        تعيين إلى
      </label>
      <select
        v-model="form.assignedTo"
        class="block w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm"
      >
        <option :value="null">غير معين</option>
        <option v-for="user in users" :key="user._id" :value="user._id">
          {{ user.username }} ({{ user.email }})
        </option>
      </select>
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
        <span v-else>{{ isEdit ? 'تحديث المهمة' : 'إنشاء المهمة' }}</span>
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted, nextTick } from 'vue'

const props = defineProps({
  task: {
    type: Object,
    default: null
  },
  users: {
    type: Array,
    default: () => []
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

const isEdit = computed(() => !!props.task)

const newTag = ref('')
const errors = ref({})
const isInitialized = ref(false)

const form = reactive({
  title: '',
  description: '',
  priority: 'medium',
  dueDate: '',
  tags: [],
  assignedTo: null
})

const minDate = computed(() => {
  return new Date().toISOString().split('T')[0]
})

const priorityDotColor = computed(() => {
  const colors = {
    low: 'bg-green-500',
    medium: 'bg-yellow-500',
    high: 'bg-red-500'
  }
  return colors[form.priority]
})

// دالة لتهيئة النموذج
const initializeForm = () => {
  if (props.task && !isInitialized.value) {
    console.log('🔄 Initializing form with task data:', props.task)
    
    form.title = props.task.title || ''
    form.description = props.task.description || ''
    form.priority = props.task.priority || 'medium'
    
    // معالجة تاريخ الاستحقاق
    if (props.task.dueDate) {
      const dueDate = new Date(props.task.dueDate)
      form.dueDate = dueDate.toISOString().split('T')[0]
    } else {
      form.dueDate = ''
    }
    
    form.tags = props.task.tags ? [...props.task.tags] : []
    form.assignedTo = props.task.assignedTo?._id || null
    
    isInitialized.value = true
    console.log('✅ Form initialized:', form)
  } else if (!props.task) {
    // إعادة تعيين النموذج لوضع الإنشاء
    form.title = ''
    form.description = ''
    form.priority = 'medium'
    form.dueDate = ''
    form.tags = []
    form.assignedTo = null
    isInitialized.value = false
  }
}

// مراقبة تغييرات الـ task
watch(() => props.task, (newTask, oldTask) => {
  console.log('🔄 Task prop changed:', { newTask, oldTask })
  
  if (newTask && newTask._id !== oldTask?._id) {
    isInitialized.value = false
    initializeForm()
  }
}, { immediate: true, deep: true })

// أيضًا مراقبة التغييرات في الـ route إذا كان هناك تغيير في الـ ID
watch(() => props.task?._id, (newId, oldId) => {
  if (newId && newId !== oldId) {
    console.log('🔄 Task ID changed:', { newId, oldId })
    isInitialized.value = false
    // إعطاء وقت لـ currentTask ليتم تحديثه في الـ store
    nextTick(() => {
      initializeForm()
    })
  }
})

// Methods
const validateForm = () => {
  errors.value = {}

  if (!form.title.trim()) {
    errors.value.title = 'عنوان المهمة مطلوب'
  } else if (form.title.length > 100) {
    errors.value.title = 'العنوان يجب أن لا يتجاوز 100 حرف'
  }

  if (form.description.length > 1000) {
    errors.value.description = 'الوصف يجب أن لا يتجاوز 1000 حرف'
  }

  return Object.keys(errors.value).length === 0
}

const handleSubmit = () => {
  if (!validateForm()) return

  const submitData = {
    ...form,
    // Ensure assignedTo is null if not set
    assignedTo: form.assignedTo || null
  }

  console.log('📤 Submitting form data:', submitData)
  emit('submit', submitData)
}

const addTag = () => {
  const tag = newTag.value.trim()
  if (tag && !form.tags.includes(tag) && form.tags.length < 10) {
    form.tags.push(tag)
    newTag.value = ''
  }
}

const removeTag = (index) => {
  form.tags.splice(index, 1)
}

onMounted(() => {
  console.log('🚀 TaskForm mounted, isEdit:', isEdit.value, 'task:', props.task)
  
  // إعطاء وقت إضافي للتأكد من تحميل البيانات
  setTimeout(() => {
    if (props.task && !isInitialized.value) {
      initializeForm()
    }
    
    // Focus on title input when component mounts
    const titleInput = document.querySelector('input[type="text"]')
    if (titleInput) {
      titleInput.focus()
    }
  }, 100)
})
</script>