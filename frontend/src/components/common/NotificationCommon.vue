<template>
  <transition name="notification-slide">
    <div v-if="visible" 
         class="fixed top-4 right-4 z-50 max-w-sm w-full transform transition-all duration-500 ease-in-out">
      <div class="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/60 p-4"
           :class="notificationTypeClass">
        
        <!-- Header -->
        <div class="flex items-start justify-between mb-2">
          <div class="flex items-center space-x-3">
            <!-- Icon -->
            <div class="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
                 :class="iconBgClass">
              <component :is="notificationIcon" class="w-5 h-5" :class="iconColorClass" />
            </div>
            
            <!-- Title -->
            <div>
              <h3 class="font-semibold text-gray-900" :class="titleSizeClass">
                {{ title }}
              </h3>
              <p class="text-sm text-gray-600 mt-1">
                {{ message }}
              </p>
            </div>
          </div>
          
          <!-- Close Button -->
          <button @click="close" 
                  class="flex-shrink-0 p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors duration-200">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <!-- Progress Bar -->
        <div v-if="autoClose" class="w-full bg-gray-200 rounded-full h-1">
          <div class="h-1 rounded-full transition-all duration-100 ease-linear"
               :class="progressBarClass"
               :style="{ width: `${progress}%` }"></div>
        </div>
        
        <!-- Actions -->
        <div v-if="$slots.actions" class="flex space-x-2 space-x-reverse mt-3">
          <slot name="actions"></slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  type: {
    type: String,
    default: 'info', // 'success', 'error', 'warning', 'info'
    validator: (value) => ['success', 'error', 'warning', 'info'].includes(value)
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    default: 5000
  },
  autoClose: {
    type: Boolean,
    default: true
  },
  size: {
    type: String,
    default: 'medium' // 'small', 'medium', 'large'
  }
})

const emit = defineEmits(['close'])

const visible = ref(true)
const progress = ref(100)
let progressInterval
let timeout

const notificationTypeClass = computed(() => {
  const classes = {
    success: 'border-l-4 border-l-green-500',
    error: 'border-l-4 border-l-red-500',
    warning: 'border-l-4 border-l-yellow-500',
    info: 'border-l-4 border-l-blue-500'
  }
  return classes[props.type]
})

const iconBgClass = computed(() => {
  const classes = {
    success: 'bg-green-100',
    error: 'bg-red-100',
    warning: 'bg-yellow-100',
    info: 'bg-blue-100'
  }
  return classes[props.type]
})

const iconColorClass = computed(() => {
  const classes = {
    success: 'text-green-600',
    error: 'text-red-600',
    warning: 'text-yellow-600',
    info: 'text-blue-600'
  }
  return classes[props.type]
})

const progressBarClass = computed(() => {
  const classes = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500',
    info: 'bg-blue-500'
  }
  return classes[props.type]
})

const titleSizeClass = computed(() => {
  const classes = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg'
  }
  return classes[props.size]
})

const notificationIcon = computed(() => {
  const icons = {
    success: 'CheckCircleIcon',
    error: 'ExclamationCircleIcon',
    warning: 'ExclamationTriangleIcon',
    info: 'InformationCircleIcon'
  }
  return icons[props.type]
})

const close = () => {
  visible.value = false
  emit('close')
  clearInterval(progressInterval)
  clearTimeout(timeout)
}

onMounted(() => {
  if (props.autoClose && props.duration > 0) {
    const step = 100 / (props.duration / 50)
    
    progressInterval = setInterval(() => {
      progress.value = Math.max(0, progress.value - step)
    }, 50)

    timeout = setTimeout(() => {
      close()
    }, props.duration)
  }
})

onUnmounted(() => {
  clearInterval(progressInterval)
  clearTimeout(timeout)
})
</script>

<style scoped>
.notification-slide-enter-active,
.notification-slide-leave-active {
  transition: all 0.5s ease;
}

.notification-slide-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.notification-slide-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>