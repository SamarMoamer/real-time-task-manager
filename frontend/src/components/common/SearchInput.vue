<template>
  <div class="relative group">
    <!-- Search Input -->
    <div class="relative">
      <input
        :value="modelValue"
        @input="onInput"
        @focus="onFocus"
        @blur="onBlur"
        :placeholder="placeholder"
        :disabled="disabled"
        class="w-full pl-12 pr-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed group-hover:border-gray-400"
        :class="{
          'border-blue-500 ring-2 ring-blue-500/20': isFocused,
          'border-red-500': error
        }"
      />
      
      <!-- Search Icon -->
      <div class="absolute left-4 top-1/2 transform -translate-y-1/2">
        <svg class="w-5 h-5 text-gray-400 transition-colors duration-300 group-hover:text-gray-600" 
             :class="{ 'text-blue-500': isFocused }" 
             fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
      </div>

      <!-- Clear Button -->
      <button
        v-if="modelValue && !disabled"
        @click="clearSearch"
        class="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all duration-200"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    </div>

    <!-- Loading Indicator -->
    <div v-if="loading" class="absolute right-12 top-1/2 transform -translate-y-1/2">
      <div class="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
    </div>

    <!-- Error Message -->
    <div v-if="error" class="absolute -bottom-6 left-0 text-xs text-red-500 flex items-center space-x-1">
      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
      <span>{{ error }}</span>
    </div>

    <!-- Search Suggestions -->
    <div v-if="showSuggestions && suggestions.length > 0 && isFocused" 
         class="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/60 py-2 z-40 max-h-60 overflow-y-auto">
      <div v-for="suggestion in suggestions" 
           :key="suggestion.id || suggestion"
           @click="selectSuggestion(suggestion)"
           class="px-4 py-3 hover:bg-blue-50 hover:text-blue-600 cursor-pointer transition-colors duration-200 flex items-center space-x-3">
        
        <!-- Suggestion Icon -->
        <svg class="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
        
        <!-- Suggestion Content -->
        <span class="text-sm">{{ suggestion.text || suggestion }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'ابحث...'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ''
  },
  showSuggestions: {
    type: Boolean,
    default: false
  },
  suggestions: {
    type: Array,
    default: () => []
  },
  debounce: {
    type: Number,
    default: 300
  }
})

const emit = defineEmits(['update:modelValue', 'search', 'suggestion-select'])

const isFocused = ref(false)
let debounceTimer

const onInput = (event) => {
  const value = event.target.value
  emit('update:modelValue', value)

  // Debounce search
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    emit('search', value)
  }, props.debounce)
}

const onFocus = () => {
  isFocused.value = true
}

const onBlur = () => {
  setTimeout(() => {
    isFocused.value = false
  }, 200)
}

const clearSearch = () => {
  emit('update:modelValue', '')
  emit('search', '')
}

const selectSuggestion = (suggestion) => {
  emit('suggestion-select', suggestion)
  emit('update:modelValue', suggestion.text || suggestion)
  isFocused.value = false
}
</script>

<style scoped>
/* Custom scrollbar for suggestions */
.suggestions-container::-webkit-scrollbar {
  width: 6px;
}

.suggestions-container::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.suggestions-container::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.suggestions-container::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>