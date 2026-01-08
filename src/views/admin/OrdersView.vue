<template>
  <div class="panel">
    <div class="toolbar">
        <div class="filter-group">
            <button v-for="status in statusOptions" :key="status.value" 
                class="filter-btn" :class="{ 'active': filterStatus === status.value }"
                @click="filterStatus = status.value">
                {{ status.label }}
            </button>
        </div>
        <div style="display: flex; gap: 0.5rem;">
            <div class="search-box">
                <i class="fa fa-search search-icon"></i>
                <input type="text" placeholder="搜索订单号/姓名/手机" class="search-input">
            </div>
            <button class="admin-btn btn-outline"><i class="fa fa-download"></i> 导出</button>
        </div>
    </div>
    <div class="table-container">
        <table class="data-table">
            <thead>
                <tr><th>订单号 / 时间</th><th>商品概览</th><th>买家信息</th><th>金额</th><th style="text-align: center;">状态</th><th style="text-align: center;">操作</th></tr>
            </thead>
            <tbody>
                <tr v-for="order in filteredOrders" :key="order.id">
                    <td>
                        <div class="order-id">{{ order.id }}</div>
                        <div class="text-sub">{{ order.date }}</div>
                    </td>
                    <td><div class="item-row">{{ order.items[0].name }} x{{ order.items[0].qty }}</div><div v-if="order.items.length > 1" class="text-sub">...共 {{ order.items.length }} 件</div></td>
                    <td><div style="font-weight: bold; color: #374151; font-size: 0.875rem;">{{ order.contact.name }}</div><div class="text-sub">{{ order.contact.phone }}</div></td>
                    <td style="font-weight: bold; color: #374151;">¥{{ order.total }}</td>
                    <td style="text-align: center;"><span :class="['status-badge', 'status-' + order.status]">{{ getStatusLabel(order.status) }}</span></td>
                    <td style="text-align: center;">
                        <button class="admin-btn btn-blue" v-if="order.status === 1" @click="order.status = 2" style="font-size: 0.75rem;">确认收款</button>
                        <button class="admin-btn btn-green" v-if="order.status === 2" style="font-size: 0.75rem;">发货录入</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const filterStatus = ref('all')
const statusOptions = [{ value: 'all', label: '全部' }, { value: 1, label: '待审核' }, { value: 2, label: '待发货' }]

const orders = ref(Array.from({ length: 10 }).map((_, i) => ({
    id: `SOS-20240101-${1000+i}`,
    date: '2024-01-01 12:00',
    status: i % 3 + 1,
    total: 100 + i * 10,
    contact: { name: `User${i}`, phone: '13800138000' },
    items: [{ name: '团长立牌', qty: 1 }, { name: '卡贴', qty: 2 }]
})))

const filteredOrders = computed(() => {
    return filterStatus.value === 'all' ? orders.value : orders.value.filter(o => o.status === filterStatus.value)
})

const getStatusLabel = (s) => (['待付款','待审核','待发货','已发货'][s] || '未知')
</script>