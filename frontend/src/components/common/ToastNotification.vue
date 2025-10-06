<template>
  <Transition name="toast">
    <div v-if="show" class="fixed top-4 right-4 z-50 max-w-sm w-full">
      <div class="bg-white rounded-2xl shadow-lg border border-gray-200/60 p-4 transform transition-all duration-300"
           :class="toastClass">
        <div class="flex items-center space-x-3 space-x-reverse">
          <div class="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
               :class="iconClass">
            <component :is="iconComponent" class="w-4 h-4" />
          </div>
          <div class="flex-1">
            <p class="font-medium text-gray-900">{{ title }}</p>
            <p class="text-sm text-gray-600 mt-1">{{ message }}</p>
          </div>
          <button @click="handleClose" class="text-gray-400 hover:text-gray-600 transition-colors duration-200">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'

const props = defineProps({
  modelValue: Boolean,
  type: {
    type: String,
    default: 'success'
  },
  title: String,
  message: String,
  duration: {
    type: Number,
    default: 4000
  }
})

const emit = defineEmits(['update:modelValue', 'close'])

const show = ref(false)

const toastClass = computed(() => {
  const classes = {
    success: 'border-green-200 bg-green-50',
    error: 'border-red-200 bg-red-50',
    warning: 'border-yellow-200 bg-yellow-50',
    info: 'border-blue-200 bg-blue-50'
  }
  return classes[props.type] || classes.success
})

const iconClass = computed(() => {
  const classes = {
    success: 'bg-green-100 text-green-600',
    error: 'bg-red-100 text-red-600',
    warning: 'bg-yellow-100 text-yellow-600',
    info: 'bg-blue-100 text-blue-600'
  }
  return classes[props.type] || classes.success
})

const iconComponent = computed(() => {
  const icons = {
    success: SuccessIcon,
    error: ErrorIcon,
    warning: WarningIcon,
    info: InfoIcon
  }
  return icons[props.type] || icons.success
})

// Icons
const SuccessIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
    </svg>
  `
}

const ErrorIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
    </svg>
  `
}

const WarningIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
    </svg>
  `
}

const InfoIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
    </svg>
  `
}

let timeoutId

const handleClose = () => {
  show.value = false
  emit('update:modelValue', false)
  emit('close')
}

watch(() => props.modelValue, (newVal) => {
  show.value = newVal
  if (newVal && props.duration > 0) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(handleClose, props.duration)
  }
})

onMounted(() => {
  if (props.modelValue && props.duration > 0) {
    timeoutId = setTimeout(handleClose, props.duration)
  }
})
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>