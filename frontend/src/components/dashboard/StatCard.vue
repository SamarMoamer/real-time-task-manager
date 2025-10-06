<template>
  <div class="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/60 p-6 hover:shadow-lg transition-all duration-300">
    <div class="flex items-center justify-between">
      <div class="flex-1">
        <p class="text-sm font-medium text-gray-600">{{ title }}</p>
        <div class="flex items-baseline space-x-2 space-x-reverse mt-1">
          <p class="text-2xl font-bold text-gray-900">{{ formattedValue }}</p>
          <div v-if="trend !== undefined" class="flex items-center space-x-1">
            <svg class="w-4 h-4" :class="trend >= 0 ? 'text-green-500' : 'text-red-500'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path v-if="trend >= 0" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
            <span class="text-xs font-medium" :class="trend >= 0 ? 'text-green-600' : 'text-red-600'">
              {{ Math.abs(trend) }}%
            </span>
          </div>
          <div v-if="percentage !== undefined" class="flex items-center space-x-1">
            <span class="text-xs font-medium text-blue-600">
              {{ percentage }}%
            </span>
          </div>
        </div>
        <p v-if="trendLabel" class="text-xs text-gray-500 mt-1">{{ trendLabel }}</p>
        <p v-if="percentageLabel" class="text-xs text-gray-500 mt-1">{{ percentageLabel }}</p>
      </div>
      <div class="w-12 h-12 rounded-2xl flex items-center justify-center" :class="iconBgColor">
        <svg class="w-6 h-6" :class="iconColor" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path v-if="icon === 'users'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
          <path v-if="icon === 'tasks'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
          <path v-if="icon === 'activity'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
          <path v-if="icon === 'health'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
          <path v-if="icon === 'check'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          <path v-if="icon === 'clock'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          <path v-if="icon === 'alert'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  value: {
    type: [Number, String],
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  color: {
    type: String,
    default: 'blue'
  },
  trend: {
    type: Number,
    default: undefined
  },
  trendLabel: {
    type: String,
    default: ''
  },
  percentage: {
    type: Number,
    default: undefined
  },
  percentageLabel: {
    type: String,
    default: ''
  },
  suffix: {
    type: String,
    default: ''
  }
})

const formattedValue = computed(() => {
  return props.value + props.suffix
})

const iconBgColor = computed(() => {
  const colors = {
    blue: 'bg-blue-100',
    emerald: 'bg-emerald-100',
    purple: 'bg-purple-100',
    green: 'bg-green-100',
    yellow: 'bg-yellow-100',
    red: 'bg-red-100'
  }
  return colors[props.color] || 'bg-blue-100'
})

const iconColor = computed(() => {
  const colors = {
    blue: 'text-blue-600',
    emerald: 'text-emerald-600',
    purple: 'text-purple-600',
    green: 'text-green-600',
    yellow: 'text-yellow-600',
    red: 'text-red-600'
  }
  return colors[props.color] || 'text-blue-600'
})
</script>