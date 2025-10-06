<template>
  <div class="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/60 p-4 hover:shadow-lg transition-all duration-300 group"
       :class="{
         'border-l-4 border-l-green-500': task.completed,
         'border-l-4 border-l-red-500': isOverdue && !task.completed,
         'border-l-4 border-l-blue-500': !task.completed && !isOverdue
       }">
    <div class="flex items-center justify-between">
      <!-- Task Info -->
      <div class="flex items-center space-x-4 space-x-reverse flex-1">
        <!-- Completion Checkbox -->
        <button @click="toggleCompletion" 
                class="flex-shrink-0 w-5 h-5 rounded border border-gray-300 flex items-center justify-center transition-all duration-200"
                :class="task.completed ? 'bg-green-500 border-green-500' : 'hover:border-green-500'">
          <svg v-if="task.completed" class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </button>

        <!-- Task Details -->
        <div class="flex-1 min-w-0">
          <div class="flex items-center space-x-3 mb-1">
            <h3 class="text-lg font-semibold text-gray-900 truncate"
                :class="{ 'line-through text-gray-400': task.completed }">
              {{ task.title }}
            </h3>
            
            <!-- Priority Badge -->
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium flex-shrink-0"
                  :class="priorityClasses">
              <span class="w-1.5 h-1.5 rounded-full mr-1" :class="priorityDotClasses"></span>
              {{ priorityText }}
            </span>
          </div>

          <!-- Description -->
          <p v-if="task.description" class="text-sm text-gray-600 truncate">
            {{ task.description }}
          </p>

          <!-- Meta Info -->
          <div class="flex items-center space-x-4 space-x-reverse mt-2">
            <!-- Due Date -->
            <div class="flex items-center space-x-1 text-sm text-gray-500">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              <span :class="dueDateClasses">{{ formattedDueDate }}</span>
            </div>

            <!-- Tags -->
            <div v-if="task.tags && task.tags.length > 0" class="flex items-center space-x-1">
              <span v-for="tag in task.tags.slice(0, 2)" :key="tag"
                    class="inline-flex items-center px-2 py-1 rounded-lg text-xs bg-blue-100 text-blue-700 font-medium">
                #{{ tag }}
              </span>
              <span v-if="task.tags.length > 2" class="text-xs text-gray-500">
                +{{ task.tags.length - 2 }}
              </span>
            </div>

            <!-- Assigned User -->
            <div v-if="task.assignedTo" class="flex items-center space-x-1 text-sm text-gray-500">
              <div class="w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-xs text-white font-medium">
                {{ task.assignedTo.username?.charAt(0)?.toUpperCase() || 'U' }}
              </div>
              <span>{{ task.assignedTo.username || 'مستخدم' }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <!-- Edit Button -->
        <button @click="handleEdit"
                class="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200"
                title="تعديل">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
          </svg>
        </button>

        <!-- Delete Button -->
        <button @click="handleDelete"
                class="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors duration-200"
                title="حذف">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
          </svg>
        </button>

        <!-- More Actions -->
        <div class="relative">
          <button @click="showActions = !showActions"
                  class="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors duration-200">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h.01M12 12h.01M19 12h.01"></path>
            </svg>
          </button>

          <!-- Dropdown Menu -->
          <div v-if="showActions" class="absolute left-0 top-full mt-1 w-48 bg-white/95 backdrop-blur-xl rounded-xl shadow-lg border border-gray-200/60 py-1 z-10">
            <button @click="toggleCompletion" class="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors duration-200">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>{{ task.completed ? 'إلغاء الإكمال' : 'تعيين كمكتملة' }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { format, isBefore } from 'date-fns'

const props = defineProps({
  task: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['edit', 'delete', 'toggle-completion'])

const showActions = ref(false)

// Computed properties
const isOverdue = computed(() => {
  if (!props.task.dueDate || props.task.completed) return false
  return isBefore(new Date(props.task.dueDate), new Date())
})

const priorityClasses = computed(() => {
  const classes = {
    high: 'bg-red-100 text-red-800',
    medium: 'bg-yellow-100 text-yellow-800',
    low: 'bg-green-100 text-green-800'
  }
  return classes[props.task.priority] || 'bg-gray-100 text-gray-800'
})

const priorityDotClasses = computed(() => {
  const classes = {
    high: 'bg-red-500',
    medium: 'bg-yellow-500',
    low: 'bg-green-500'
  }
  return classes[props.task.priority] || 'bg-gray-500'
})

const priorityText = computed(() => {
  const texts = {
    high: 'عالي',
    medium: 'متوسط',
    low: 'منخفض'
  }
  return texts[props.task.priority] || 'غير محدد'
})

const formattedDueDate = computed(() => {
  if (!props.task.dueDate) return 'لا يوجد تاريخ'
  return format(new Date(props.task.dueDate), 'dd/MM/yyyy')
})

const dueDateClasses = computed(() => {
  if (props.task.completed) return 'text-green-600'
  if (isOverdue.value) return 'text-red-600 font-semibold'
  return 'text-gray-600'
})

// Methods
const handleEdit = () => {
  emit('edit', props.task)
  showActions.value = false
}

const handleDelete = () => {
  if (confirm('هل أنت متأكد من حذف هذه المهمة؟')) {
    emit('delete', props.task._id)
  }
  showActions.value = false
}

const toggleCompletion = () => {
  emit('toggle-completion', props.task._id)
  showActions.value = false
}

// Close dropdown when clicking outside
const handleClickOutside = (event) => {
  if (!event.target.closest('.relative')) {
    showActions.value = false
  }
}

// Add event listener for outside clicks
import { onMounted, onUnmounted } from 'vue'

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>