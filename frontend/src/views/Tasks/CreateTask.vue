<template>
  <AppLayout>
    <div class="max-w-4xl mx-auto p-6">
      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-2xl lg:text-3xl font-bold text-gray-900">إنشاء مهمة جديدة</h1>
          <p class="text-gray-600 mt-2">أضف مهمة جديدة إلى قائمة مهامك</p>
        </div>
        
        <router-link to="/tasks"
                    class="flex items-center space-x-2 space-x-reverse text-gray-600 hover:text-gray-800 transition-colors duration-200">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
          <span>إلغاء</span>
        </router-link>
      </div>

      <!-- Task Form -->
      <div class="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/60 p-8">
        <TaskForm
          :loading="tasksStore.isLoading"
          :error="tasksStore.error"
          @submit="handleCreateTask"
          @cancel="handleCancel"
        />
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useTasksStore } from '@/stores/tasks'
import AppLayout from '@/components/layout/AppLayout.vue'
import TaskForm from '@/components/tasks/TaskForm.vue'

const router = useRouter()
const tasksStore = useTasksStore()

const handleCreateTask = async (taskData) => {
  try {
    await tasksStore.createTask(taskData)
    router.push('/tasks')
  } catch (error) {
    console.error('Error creating task:', error)
  }
}

const handleCancel = () => {
  router.push('/tasks')
}
</script>