<template>
  <AppLayout>
    <div class="max-w-4xl mx-auto p-6" v-if="!loading">
      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-2xl lg:text-3xl font-bold text-gray-900">تعديل المهمة</h1>
          <p class="text-gray-600 mt-2">قم بتحديث معلومات المهمة</p>
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
          :task="tasksStore.currentTask"
          :loading="tasksStore.isLoading"
          :error="tasksStore.error"
          @submit="handleUpdateTask"
          @cancel="handleCancel"
        />
      </div>
    </div>

    <!-- Loading State -->
    <div v-else class="flex justify-center items-center min-h-96">
      <LoadingSpinner size="large" />
    </div>

    <!-- Error State -->
    <div v-if="error" class="max-w-4xl mx-auto p-6">
      <div class="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
        <svg class="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
        </svg>
        <h3 class="text-lg font-semibold text-red-800 mb-2">خطأ في تحميل المهمة</h3>
        <p class="text-red-600 mb-4">{{ error }}</p>
        <button @click="handleCancel" 
                class="bg-red-600 text-white px-6 py-2 rounded-2xl hover:bg-red-700 transition-colors duration-200">
          العودة إلى القائمة
        </button>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTasksStore } from '@/stores/tasks'
import AppLayout from '@/components/layout/AppLayout.vue'
import TaskForm from '@/components/tasks/TaskForm.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

const route = useRoute()
const router = useRouter()
const tasksStore = useTasksStore()

const loading = ref(true)
const error = ref('')

const handleUpdateTask = async (taskData) => {
  try {
    console.log('📤 Updating task with data:', taskData)
    await tasksStore.updateTask(route.params.id, taskData)
    router.push('/tasks')
  } catch (err) {
    console.error('❌ Error updating task:', err)
    error.value = err.message || 'فشل في تحديث المهمة'
  }
}

const handleCancel = () => {
  router.push('/tasks')
}

onMounted(async () => {
  try {
    console.log('🔄 Fetching task for editing:', route.params.id)
    await tasksStore.fetchTask(route.params.id)
    console.log('✅ Task loaded:', tasksStore.currentTask)
  } catch (err) {
    console.error('❌ Error fetching task:', err)
    error.value = err.message || 'فشل في تحميل المهمة'
  } finally {
    loading.value = false
  }
})

// مراقبة تغييرات الـ route
watch(() => route.params.id, async (newId) => {
  if (newId) {
    loading.value = true
    error.value = ''
    try {
      await tasksStore.fetchTask(newId)
    } catch (err) {
      console.error('❌ Error fetching task:', err)
      error.value = err.message || 'فشل في تحميل المهمة'
    } finally {
      loading.value = false
    }
  }
})
</script>