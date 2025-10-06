<template>
  <transition name="modal-fade">
    <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto">
      <!-- Backdrop -->
      <div class="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" 
           @click="closeOnBackdrop && close()"></div>
      
      <!-- Modal Container -->
      <div class="flex min-h-full items-center justify-center p-4">
        <!-- Modal Panel -->
        <div class="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl transform transition-all duration-300"
             :class="modalSizeClass">
          
          <!-- Header -->
          <div class="flex items-center justify-between p-6 border-b border-gray-200/60">
            <div class="flex items-center space-x-3">
              <!-- Icon -->
              <div v-if="icon" class="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
                   :class="iconBgClass">
                <component :is="icon" class="w-5 h-5" :class="iconColorClass" />
              </div>
              
              <!-- Title -->
              <div>
                <h2 class="text-xl font-bold text-gray-900">{{ title }}</h2>
                <p v-if="subtitle" class="text-sm text-gray-600 mt-1">{{ subtitle }}</p>
              </div>
            </div>
            
            <!-- Close Button -->
            <button @click="close" 
                    class="flex-shrink-0 p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all duration-200 group">
              <svg class="w-5 h-5 transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          
          <!-- Content -->
          <div class="p-6" :class="contentPaddingClass">
            <slot></slot>
          </div>
          
          <!-- Footer -->
          <div v-if="$slots.footer" class="flex items-center justify-end space-x-3 space-x-reverse p-6 border-t border-gray-200/60 bg-gray-50/50 rounded-b-3xl">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    default: ''
  },
  size: {
    type: String,
    default: 'medium', // 'small', 'medium', 'large', 'xl'
    validator: (value) => ['small', 'medium', 'large', 'xl'].includes(value)
  },
  icon: {
    type: [String, Object],
    default: null
  },
  iconBg: {
    type: String,
    default: 'blue' // 'blue', 'green', 'red', 'yellow', 'purple'
  },
  closeOnBackdrop: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['update:show', 'close'])

const modalSizeClass = computed(() => {
  const classes = {
    small: 'w-full max-w-md',
    medium: 'w-full max-w-lg',
    large: 'w-full max-w-2xl',
    xl: 'w-full max-w-4xl'
  }
  return classes[props.size]
})

const contentPaddingClass = computed(() => {
  const classes = {
    small: 'py-4',
    medium: 'py-6',
    large: 'py-8',
    xl: 'py-8'
  }
  return classes[props.size]
})

const iconBgClass = computed(() => {
  const classes = {
    blue: 'bg-blue-100',
    green: 'bg-green-100',
    red: 'bg-red-100',
    yellow: 'bg-yellow-100',
    purple: 'bg-purple-100'
  }
  return classes[props.iconBg]
})

const iconColorClass = computed(() => {
  const classes = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    red: 'text-red-600',
    yellow: 'text-yellow-600',
    purple: 'text-purple-600'
  }
  return classes[props.iconBg]
})

const close = () => {
  emit('update:show', false)
  emit('close')
}
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: all 0.3s ease;
}

.modal-fade-enter-from {
  opacity: 0;
}

.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-from .modal-panel,
.modal-fade-leave-to .modal-panel {
  transform: scale(0.95) translateY(-10px);
}
</style>