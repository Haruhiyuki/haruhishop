<template>
    <div class="query-box">
        <h2 style="font-size: 1.5rem; font-weight: bold; text-align: center; color: #1f2937; margin-bottom: 2rem;">订单查询</h2>
        <div class="flex-row gap-4" style="margin-bottom: 2rem;">
            <input v-model="queryId" type="text" placeholder="请输入订单号 (如: SOS...)" class="input-field" style="flex-grow: 1;">
            <button @click="query" class="market-btn primary-action" style="padding: 0 1.5rem;">查询</button>
        </div>
        <div v-if="result" class="query-result">
            <div class="result-header">
                <span style="font-weight: bold; color: #374151;">订单: {{ queryId }}</span>
                <span style="font-size: 0.75rem; background: #d1fae5; color: #047857; padding: 2px 8px; border-radius: 4px;">已付款/待发货</span>
            </div>
            <div class="result-body">
                <i class="fa fa-box-open" style="font-size: 1.875rem; color: #60a5fa; margin-bottom: 0.5rem;"></i>
                <p style="color: #4b5563;">核销成功！仓库正在打包中。</p>
            </div>
        </div>
        <div v-else style="background: #f9fafb; padding: 1.5rem; border-radius: var(--radius-md); text-align: center; color: #9ca3af;">
            <i class="fa fa-search" style="font-size: 1.5rem; margin-bottom: 0.5rem;"></i>
            <p>请输入订单号查询发货状态</p>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
const queryId = ref('')
const result = ref(null)
const query = () => { if(queryId.value) result.value = true }
</script>