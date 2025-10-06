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
    type: 'line',
    data: {
      labels: props.data.map(item => item.day),
      datasets: [{
        label: 'نسبة الإنجاز %',
        data: props.data.map(item => item.completion),
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderColor: '#3B82F6',
        borderWidth: 3,
        tension: 0.4,
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          rtl: true,
          bodyFont: {
            family: 'Tajawal, sans-serif'
          }
        }
      },
      scales: {
        x: {
          ticks: {
            font: {
              family: 'Tajawal, sans-serif'
            }
          }
        },
        y: {
          min: 0,
          max: 100,
          ticks: {
            font: {
              family: 'Tajawal, sans-serif'
            },
            callback: function(value) {
              return value + '%'
            }
          }
        }
      }
    }
  })
}
</script>