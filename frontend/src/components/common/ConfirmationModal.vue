<template>
  <Modal v-model:show="internalShow" :title="title" size="sm">
    <div class="text-center py-4">
      <!-- Icon -->
      <div class="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
           :class="iconClass">
        <component :is="iconComponent" class="w-8 h-8" />
      </div>
      
      <!-- Message -->
      <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ message }}</h3>
      <p class="text-gray-600 mb-6">{{ description }}</p>
      
      <!-- Actions -->
      <div class="flex items-center justify-center space-x-3 space-x-reverse">
        <button @click="handleCancel"
                class="px-6 py-3 border border-gray-300 text-gray-700 rounded-2xl font-semibold hover:bg-gray-50 transition-all duration-300">
          إلغاء
        </button>
        <button @click="handleConfirm"
                class="px-6 py-3 rounded-2xl font-semibold transition-all duration-300 flex items-center space-x-2"
                :class="confirmButtonClass">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <span>تأكيد</span>
        </button>
      </div>
    </div>
  </Modal>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import Modal from './ModalCommon.vue'

const props = defineProps({
  modelValue: Boolean,
  title: String,
  message: String,
  description: String,
  type: {
    type: String,
    default: 'warning'
  }
})

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel'])

const internalShow = ref(false)

const iconClass = computed(() => {
  const classes = {
    warning: 'bg-yellow-100 text-yellow-600',
    danger: 'bg-red-100 text-red-600',
    success: 'bg-green-100 text-green-600'
  }
  return classes[props.type] || classes.warning
})

const confirmButtonClass = computed(() => {
  const classes = {
    warning: 'bg-yellow-600 text-white hover:bg-yellow-700',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    success: 'bg-green-600 text-white hover:bg-green-700'
  }
  return classes[props.type] || classes.warning
})

const iconComponent = computed(() => {
  const icons = {
    warning: ExclamationIcon,
    danger: TrashIcon,
    success: CheckCircleIcon
  }
  return icons[props.type] || icons.warning
})

// Icons
const ExclamationIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
    </svg>
  `
}

const TrashIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
    </svg>
  `
}

const CheckCircleIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
    </svg>
  `
}

const handleConfirm = () => {
  emit('confirm')
  internalShow.value = false
  emit('update:modelValue', false)
}

const handleCancel = () => {
  emit('cancel')
  internalShow.value = false
  emit('update:modelValue', false)
}

watch(() => props.modelValue, (newVal) => {
  internalShow.value = newVal
})
</script>