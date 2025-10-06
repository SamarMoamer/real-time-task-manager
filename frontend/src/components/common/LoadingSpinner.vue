<template>
  <div class="flex items-center justify-center p-8" :class="sizeClass">
    <!-- Spinner with gradient -->
    <div class="relative">
      <!-- Outer ring -->
      <div class="animate-spin rounded-full border-4 border-gray-200" 
           :class="spinnerSizeClass"></div>
      
      <!-- Gradient ring -->
      <div class="absolute top-0 left-0 animate-spin rounded-full border-4 border-transparent border-t-blue-500 border-r-purple-600" 
           :class="spinnerSizeClass"></div>
      
      <!-- Inner dot -->
      <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div class="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse"></div>
      </div>
    </div>
    
    <!-- Loading text -->
    <span v-if="showText" class="ml-3 text-gray-600 font-medium" :class="textSizeClass">
      {{ text }}
    </span>
  </div>
</template>

<script setup>
import { computed } from 'vue' 

const props = defineProps({
  size: {
    type: String,
    default: 'medium', // 'small', 'medium', 'large'
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  },
  showText: {
    type: Boolean,
    default: true
  },
  text: {
    type: String,
    default: 'جاري التحميل...'
  }
})

const sizeClass = computed(() => {
  const classes = {
    small: 'p-4',
    medium: 'p-8',
    large: 'p-12'
  }
  return classes[props.size]
})

const spinnerSizeClass = computed(() => {
  const classes = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-16 h-16'
  }
  return classes[props.size]
})

const textSizeClass = computed(() => {
  const classes = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg'
  }
  return classes[props.size]
})
</script>

<style scoped>
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>