<template>
  <div id="app" dir="rtl" class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
    <router-view />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

onMounted(() => {
  // تهيئة المصادقة عند تحميل التطبيق
  authStore.initializeAuth()
})
</script>

<style>
/* تأكد من أن التمرير سلس */
html {
  scroll-behavior: smooth;
}

/* تحسينات للخط العربي */
body {
  font-family: 'Tajawal', sans-serif;
  line-height: 1.6;
}

/* تحسينات للعناصر النصية */
h1, h2, h3, h4, h5, h6 {
  font-weight: 700;
  line-height: 1.3;
}

/* تحسينات للأزرار والعناصر التفاعلية */
button, input, select, textarea {
  font-family: 'Tajawal', sans-serif;
}
</style>