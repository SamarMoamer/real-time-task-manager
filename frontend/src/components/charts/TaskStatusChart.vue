<template>
  <div class="w-full h-full">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

const props = defineProps({
  data: {
    type: Array,
    required: true
  }
})

const chartCanvas = ref(null)
let chartInstance = null

onMounted(() => {
  renderChart()
})

watch(() => props.data, () => {
  if (chartInstance) {
    chartInstance.destroy()
  }
  renderChart()
})

const renderChart = () => {
  if (!chartCanvas.value || !props.data.length) return

  const ctx = chartCanvas.value.getContext('2d')
  
  chartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: props.data.map(item => item.status),
      datasets: [{
        data: props.data.map(item => item.count),
        backgroundColor: props.data.map(item => item.color),
        borderWidth: 2,
        borderColor: '#fff'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          rtl: true,
          labels: {
            usePointStyle: true,
            padding: 20,
            font: {
              family: 'Tajawal, sans-serif'
            }
          }
        },
        tooltip: {
          rtl: true,
          bodyFont: {
            family: 'Tajawal, sans-serif'
          }
        }
      },
      cutout: '60%'
    }
  })
}
</script>