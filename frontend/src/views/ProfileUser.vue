<template>
  <AppLayout>
    <div class="max-w-4xl mx-auto p-6">
      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-2xl lg:text-3xl font-bold text-gray-900">الملف الشخصي</h1>
          <p class="text-gray-600 mt-2">إدارة معلومات حسابك الشخصية</p>
        </div>
        
        <button @click="$router.back()" 
                class="flex items-center space-x-2 space-x-reverse text-gray-600 hover:text-gray-900 transition-colors duration-200">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
          <span>رجوع</span>
        </button>
      </div>

      <!-- رسالة النجاح -->
      <div v-if="successMessage" 
           class="mb-6 p-4 bg-green-50 border border-green-200 rounded-2xl text-green-700 flex items-center space-x-2 space-x-reverse">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
        <span>{{ successMessage }}</span>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Profile Info -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Personal Information -->
          <div class="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/60 p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-6">المعلومات الشخصية</h2>
            
            <form @submit.prevent="handleUpdateProfile" class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Username -->
                <div class="group">
                  <label class="block text-sm font-medium text-gray-700 mb-2">اسم المستخدم</label>
                  <input
                    v-model="profileForm.username"
                    type="text"
                    class="block w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 placeholder-gray-400 bg-white/50 backdrop-blur-sm"
                    placeholder="اسم المستخدم"
                    :disabled="authStore.isLoading"
                  >
                </div>

                <!-- Email -->
                <div class="group">
                  <label class="block text-sm font-medium text-gray-700 mb-2">البريد الإلكتروني</label>
                  <input
                    v-model="profileForm.email"
                    type="email"
                    class="block w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 placeholder-gray-400 bg-white/50 backdrop-blur-sm"
                    placeholder="البريد الإلكتروني"
                    :disabled="authStore.isLoading"
                  >
                </div>
              </div>

              <!-- Avatar Upload -->
              <div class="group">
                <label class="block text-sm font-medium text-gray-700 mb-2">الصورة الشخصية</label>
                <div class="flex items-center space-x-6 space-x-reverse">
                  <div class="relative">
                    <!-- ✅ عرض الصورة المرفوعة أو الأحرف الأولى -->
                    <div v-if="avatarPreview" 
                         class="w-20 h-20 rounded-2xl bg-cover bg-center shadow-2xl shadow-blue-500/25 border-2 border-white"
                         :style="{ backgroundImage: `url(${avatarPreview})` }">
                    </div>
                    <div v-else-if="authStore.userAvatar"
                         class="w-20 h-20 rounded-2xl bg-cover bg-center shadow-2xl shadow-blue-500/25 border-2 border-white"
                         :style="{ backgroundImage: `url(${authStore.userAvatar})` }">
                    </div>
                    <div v-else
                         class="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-2xl shadow-blue-500/25">
                      {{ authStore.userInitials }}
                    </div>
                    <div class="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-2 border-white rounded-full"></div>
                  </div>
                  <div class="flex-1">
                    <input
                      type="file"
                      @change="handleAvatarUpload"
                      accept="image/*"
                      :disabled="authStore.isLoading"
                      class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-2xl file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all duration-300"
                    >
                    <p class="text-xs text-gray-500 mt-2">PNG, JPG, GIF حتى 5MB</p>
                    <button v-if="avatarPreview || authStore.userAvatar" 
                            type="button"
                            @click="removeAvatar"
                            class="mt-2 text-red-600 hover:text-red-700 text-sm font-medium transition-colors duration-200">
                      إزالة الصورة
                    </button>
                  </div>
                </div>
              </div>

              <!-- Submit Button -->
              <div class="flex items-center justify-end pt-6 border-t border-gray-200/60">
                <button type="submit" :disabled="authStore.isLoading || !isFormChanged"
                        class="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-2xl font-semibold hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                        :class="{ 'opacity-50 cursor-not-allowed': !isFormChanged }">
                  <span v-if="authStore.isLoading" class="flex items-center">
                    <LoadingSpinner size="small" />
                    <span class="mr-3">جاري الحفظ...</span>
                  </span>
                  <span v-else>حفظ التغييرات</span>
                </button>
              </div>
            </form>
          </div>
          <!-- Security Settings -->
          <div class="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/60 p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-6">الأمان</h2>
            
            <div class="space-y-4">
              <button @click="showChangePassword = true"
                      class="w-full flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors duration-200 group">
                <div class="flex items-center space-x-3 space-x-reverse">
                  <div class="w-10 h-10 bg-blue-100 rounded-2xl flex items-center justify-center group-hover:bg-blue-200 transition-colors duration-300">
                    <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                    </svg>
                  </div>
                  <div class="text-right">
                    <h3 class="font-medium text-gray-900">تغيير كلمة المرور</h3>
                    <p class="text-sm text-gray-600">قم بتحديث كلمة المرور الخاصة بك</p>
                  </div>
                </div>
                <svg class="w-5 h-5 text-gray-400 group-hover:text-gray-600 transform group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </button>

              <button @click="handleDeactivateAccount"
                      class="w-full flex items-center justify-between p-4 bg-red-50 rounded-2xl hover:bg-red-100 transition-colors duration-200 group">
                <div class="flex items-center space-x-3 space-x-reverse">
                  <div class="w-10 h-10 bg-red-100 rounded-2xl flex items-center justify-center group-hover:bg-red-200 transition-colors duration-300">
                    <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path>
                    </svg>
                  </div>
                  <div class="text-right">
                    <h3 class="font-medium text-red-900">تعطيل الحساب</h3>
                    <p class="text-sm text-red-600">سيتم إلغاء تنشيط حسابك بشكل دائم</p>
                  </div>
                </div>
                <svg class="w-5 h-5 text-red-400 group-hover:text-red-600 transform group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>

         <div class="space-y-6">
          <!-- Account Summary -->
          <div class="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/60 p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-6">ملخص الحساب</h2>
            
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <span class="text-gray-600">تاريخ الانضمام</span>
                <span class="font-medium text-gray-900">{{ formatJoinDate }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray-600">آخر نشاط</span>
                <span class="font-medium text-gray-900">{{ formatLastActivity }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray-600">الدور</span>
                <span class="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full capitalize">
                  {{ authStore.user?.role === 'admin' ? 'مدير' : 'مستخدم' }}
                </span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray-600">الحالة</span>
                <span class="flex items-center space-x-2 space-x-reverse">
                  <span class="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span class="font-medium text-green-600">نشط</span>
                </span>
              </div>
            </div>
          </div>

          <!-- Quick Stats -->
          <div class="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-6 text-white shadow-2xl shadow-blue-500/25">
            <h2 class="text-xl font-semibold mb-6">إحصائيات سريعة</h2>
            
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <span>المهام الكلية</span>
                <span class="text-2xl font-bold">{{ userStats.totalTasks }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span>مكتملة</span>
                <span class="text-2xl font-bold">{{ userStats.completedTasks }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span>نسبة الإنجاز</span>
                <span class="text-2xl font-bold">{{ userStats.completionRate }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Change Password Modal -->
      <Modal v-model:show="showChangePassword" title="تغيير كلمة المرور" size="medium">
        <ChangePasswordForm
          @submit="handleChangePassword"
          @cancel="showChangePassword = false"
        />
      </Modal>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useTasksStore } from '@/stores/tasks'
import { useUsersStore } from '@/stores/users'
import AppLayout from '@/components/layout/AppLayout.vue'
import Modal from '@/components/common/ModalCommon.vue'
import ChangePasswordForm from '@/components/auth/ChangePasswordForm.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

const router = useRouter()
const authStore = useAuthStore()
const tasksStore = useTasksStore()
const usersStore = useUsersStore()

const showChangePassword = ref(false)
const successMessage = ref('')
const avatarPreview = ref('')

const profileForm = reactive({
  username: '',
  email: '',
  avatar: null
})

// computed properties
const userStats = computed(() => ({
  totalTasks: tasksStore.tasks.length,
  completedTasks: tasksStore.completedTasks.length,
  completionRate: tasksStore.tasks.length > 0 
    ? Math.round((tasksStore.completedTasks.length / tasksStore.tasks.length) * 100)
    : 0
}))

const formatJoinDate = computed(() => {
  if (!authStore.user?.createdAt) return 'غير متوفر'
  return new Date(authStore.user.createdAt).toLocaleDateString('ar-EG')
})

const formatLastActivity = computed(() => {
  if (!authStore.user?.lastLogin) return 'غير متوفر'
  return new Date(authStore.user.lastLogin).toLocaleDateString('ar-EG')
})

// التحقق من تغيير النموذج
const isFormChanged = computed(() => {
  return profileForm.username !== authStore.user?.username || 
         profileForm.email !== authStore.user?.email ||
         profileForm.avatar !== null
})

// تحديث النموذج عند تغيير بيانات المستخدم
watch(() => authStore.user, (newUser) => {
  if (newUser) {
    profileForm.username = newUser.username || ''
    profileForm.email = newUser.email || ''
    profileForm.avatar = null
    avatarPreview.value = newUser.avatar || ''
  }
}, { immediate: true })

const handleUpdateProfile = async () => {
  try {
    const { avatar, ...userData } = profileForm
    
    await authStore.updateProfile(userData)
    
    if (avatar) {
      await authStore.uploadAvatar(avatar)
    }
    
    successMessage.value = 'تم تحديث الملف الشخصي بنجاح'
    
    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
    
  } catch (error) {
    console.error('Error updating profile:', error)
    alert('فشل في تحديث الملف الشخصي: ' + (error.message || 'حدث خطأ غير متوقع'))
  }
}

const handleAvatarUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    // التحقق من حجم الملف (5MB كحد أقصى)
    if (file.size > 5 * 1024 * 1024) {
      alert('حجم الملف كبير جداً. الحد الأقصى هو 5MB')
      return
    }
    
    profileForm.avatar = file
    
    // عرض معاينة الصورة
    const reader = new FileReader()
    reader.onload = (e) => {
      avatarPreview.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const removeAvatar = async () => {
  try {
    await authStore.removeAvatar()
    profileForm.avatar = null
    avatarPreview.value = ''
    successMessage.value = 'تم إزالة الصورة بنجاح'
    
    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
  } catch (error) {
    console.error('Error removing avatar:', error)
    alert('فشل في إزالة الصورة: ' + error.message)
  }
}

const handleChangePassword = async (passwordData) => {
  try {
    // التحقق من صحة البيانات
    if (!passwordData.currentPassword || !passwordData.newPassword) {
      alert('يرجى ملء جميع الحقول المطلوبة')
      return
    }

    // التحقق من تطابق كلمات المرور
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('كلمات المرور الجديدة غير متطابقة')
      return
    }

    // استدعاء خدمة تغيير كلمة المرور
    await authStore.changePassword({
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword
    })

    successMessage.value = 'تم تغيير كلمة المرور بنجاح'
    showChangePassword.value = false

    // إخفاء رسالة النجاح بعد 3 ثواني
    setTimeout(() => {
      successMessage.value = ''
    }, 3000)

  } catch (error) {
    console.error('Error changing password:', error)
    alert('فشل في تغيير كلمة المرور: ' + (error.message || 'حدث خطأ غير متوقع'))
  }
}

const handleDeactivateAccount = async () => {
  if (confirm('هل أنت متأكد من تعطيل حسابك؟ سيتم إلغاء تنشيط حسابك بشكل دائم.')) {
    try {
      await usersStore.deactivateAccount()
      await authStore.logout()
      router.push('/login')
    } catch (error) {
      console.error('Error deactivating account:', error)
      alert('فشل في تعطيل الحساب: ' + (error.message || 'حدث خطأ غير متوقع'))
    }
  }
}

onMounted(async () => {
  await tasksStore.fetchTasks()
})
</script>