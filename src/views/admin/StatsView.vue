<template>
  <div class="panel">
    <div style="padding: 1.5rem;">
        <h3>销售趋势 (Chart.js 示例)</h3>
        <div style="height: 300px; position: relative;">
            <canvas id="trendChart"></canvas>
        </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import Chart from 'chart.js/auto'

onMounted(() => {
    const ctx = document.getElementById('trendChart')
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
            datasets: [{
                label: '销售额',
                data: [120, 190, 30, 50, 20, 300, 450],
                borderColor: '#3498db',
                backgroundColor: 'rgba(52, 152, 219, 0.1)',
                fill: true
            }]
        },
        options: { maintainAspectRatio: false }
    })
})
</script>

<style scoped>
.panel { background: white; border-radius: 8px; padding: 1rem; }
</style>