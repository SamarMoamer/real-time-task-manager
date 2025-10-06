/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Tajawal', 'system-ui', 'sans-serif'],
      },
      textAlign: {
        'right': 'right',
      },
      direction: {
        'rtl': 'rtl',
      }
    },
  },
  plugins: [],
  // إضافة دعم RTL
  important: true,
}