<template>
  <div class="flex items-center justify-between px-4 py-3 bg-white/80 backdrop-blur-sm border-t border-gray-200/60">
    <!-- Info -->
    <div class="flex items-center space-x-4">
      <p class="text-sm text-gray-700">
        عرض
        <span class="font-semibold">{{ startItem }}</span>
        -
        <span class="font-semibold">{{ endItem }}</span>
        من
        <span class="font-semibold">{{ totalItems }}</span>
        نتيجة
      </p>
    </div>

    <!-- Pages -->
    <div class="flex items-center space-x-1">
      <!-- Previous Button -->
      <button 
        @click="goToPage(currentPage - 1)"
        :disabled="currentPage === 1"
        class="p-2 rounded-xl text-gray-500 hover:bg-blue-50 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 group"
        :class="{ 'bg-blue-50 text-blue-600': currentPage === 1 }"
      >
        <svg class="w-5 h-5 transform group-hover:-translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
        </svg>
      </button>

      <!-- Page Numbers -->
      <template v-for="page in visiblePages" :key="page">
        <button 
          v-if="page === '...'"
          class="px-3 py-2 text-gray-400 cursor-default"
        >
          ...
        </button>
        <button 
          v-else
          @click="goToPage(page)"
          class="px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 min-w-[40px]"
          :class="page === currentPage 
            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25' 
            : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'"
        >
          {{ page }}
        </button>
      </template>

      <!-- Next Button -->
      <button 
        @click="goToPage(currentPage + 1)"
        :disabled="currentPage === totalPages"
        class="p-2 rounded-xl text-gray-500 hover:bg-blue-50 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 group"
        :class="{ 'bg-blue-50 text-blue-600': currentPage === totalPages }"
      >
        <svg class="w-5 h-5 transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
        </svg>
      </button>
    </div>

    <!-- Page Size Selector -->
    <div class="flex items-center space-x-2">
      <span class="text-sm text-gray-700">العرض:</span>
      <select 
        v-model="localPageSize"
        @change="onPageSizeChange"
        class="text-sm border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
      >
        <option value="10">10</option>
        <option value="25">25</option>
        <option value="50">50</option>
        <option value="100">100</option>
      </select>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  currentPage: {
    type: Number,
    required: true
  },
  totalItems: {
    type: Number,
    required: true
  },
  pageSize: {
    type: Number,
    default: 10
  },
  totalPages: {
    type: Number,
    required: true
  },
  maxVisiblePages: {
    type: Number,
    default: 5
  }
})

const emit = defineEmits(['page-change', 'page-size-change'])

const localPageSize = ref(props.pageSize)

const startItem = computed(() => {
  return (props.currentPage - 1) * props.pageSize + 1
})

const endItem = computed(() => {
  return Math.min(props.currentPage * props.pageSize, props.totalItems)
})

const visiblePages = computed(() => {
  const pages = []
  const half = Math.floor(props.maxVisiblePages / 2)
  let start = Math.max(1, props.currentPage - half)
  let end = Math.min(props.totalPages, start + props.maxVisiblePages - 1)

  if (end - start + 1 < props.maxVisiblePages) {
    start = Math.max(1, end - props.maxVisiblePages + 1)
  }

  // Add first page and ellipsis if needed
  if (start > 1) {
    pages.push(1)
    if (start > 2) {
      pages.push('...')
    }
  }

  // Add page numbers
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  // Add last page and ellipsis if needed
  if (end < props.totalPages) {
    if (end < props.totalPages - 1) {
      pages.push('...')
    }
    pages.push(props.totalPages)
  }

  return pages
})

const goToPage = (page) => {
  if (page >= 1 && page <= props.totalPages && page !== props.currentPage) {
    emit('page-change', page)
  }
}

const onPageSizeChange = () => {
  emit('page-size-change', parseInt(localPageSize.value))
}
</script>