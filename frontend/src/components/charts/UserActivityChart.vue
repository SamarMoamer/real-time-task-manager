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
    type: 'bar',
    data: {
      labels: props.data.map(item => item.user),
      datasets: [
        {
          label: 'عدد المهام',
          data: props.data.map(item => item.tasks),
          backgroundColor: '#3B82F6',
          borderColor: '#3B82F6',
          borderWidth: 1
        },
        {
          label: 'نسبة الإنجاز %',
          data: props.data.map(item => item.completion),
          backgroundColor: '#10B981',
          borderColor: '#10B981',
          borderWidth: 1
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
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
      scales: {
        x: {
          ticks: {
            font: {
              family: 'Tajawal, sans-serif'
            }
          }
        },
        y: {
          beginAtZero: true,
          ticks: {
            font: {
              family: 'Tajawal, sans-serif'
            }
          }
        }
      }
    }
  })
}
</script>