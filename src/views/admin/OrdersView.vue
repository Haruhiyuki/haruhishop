<template>
  <div class="panel">
    <div class="toolbar">
        <div class="filter-group">
            <button v-for="status in statusOptions" :key="status.value" 
                class="filter-btn" :class="{ 'active': filterStatus === status.value }"
                @click="changeFilter(status.value)">
                {{ status.label }}
            </button>
        </div>
    </div>
    <div class="table-container">
        <table class="data-table">
            <thead>
                <tr>
                    <th>订单号 / 时间</th>
                    <th>商品概览</th>
                    <th>收货信息</th>
                    <th>金额</th>
                    <th style="text-align: center;">状态</th>
                    <th style="text-align: center;">操作</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="order in orders" :key="order.id">
                    <td>
                        <div class="order-id">{{ order.id }}</div>
                        <div class="text-sub">{{ new Date(order.created_at).toLocaleString() }}</div>
                    </td>
                    <td>
                        <div v-for="(item, idx) in order.items" :key="idx" class="item-row">
                            {{ item.name }} <span style="color: #9ca3af;">x{{ item.quantity }}</span>
                        </div>
                    </td>
                    <td style="font-size: 0.85rem;">
                        <div><strong>{{ order.contact.name }}</strong> {{ order.contact.phone }}</div>
                        <div class="text-sub">{{ order.contact.province }}{{ order.contact.city }}{{ order.contact.district }}</div>
                        <div class="text-sub" style="max-width: 200px;">{{ order.contact.addressDetail }}</div>
                    </td>
                    <td style="font-weight: bold;">¥{{ order.total }}</td>
                    <td style="text-align: center;"><span :class="['status-badge', 'status-' + order.status]">{{ getStatusLabel(order.status) }}</span></td>
                    <td style="text-align: center;">
                        <div style="display: flex; gap: 0.5rem; justify-content: center;">
                            <!-- 待付款(1) -> 确认收款(2) 或 取消(0) -->
                            <template v-if="order.status === 1">
                                <button class="admin-btn btn-blue" style="font-size: 0.75rem;" @click="updateStatus(order.id, 2)">收款</button>
                                <button class="admin-btn btn-outline" style="font-size: 0.75rem; color: #ef4444;" @click="updateStatus(order.id, 0)">取消</button>
                            </template>

                            <!-- 待确认(5) -> 确认收款(2) (Transitions to Pending Shipment) -->
                            <template v-if="order.status === 5">
                                <button class="admin-btn btn-blue" style="font-size: 0.75rem;" @click="updateStatus(order.id, 2)">确认收款</button>
                            </template>
                            
                            <!-- 待发货(2) -> 发货(3) -->
                            <template v-if="order.status === 2">
                                <button class="admin-btn btn-green" style="font-size: 0.75rem;" @click="openShip(order)">发货</button>
                            </template>

                            <span v-if="order.status === 0" style="color: #999; font-size: 0.75rem;">已取消 (库存已回滚)</span>
                            <span v-if="order.status === 3" style="color: #10b981; font-size: 0.75rem;">已发货</span>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>

    <!-- 发货弹窗 -->
    <div v-if="shipModal.show" class="modal-overlay">
        <div class="modal-card">
            <h3 class="modal-title">订单发货</h3>
            <label class="form-label">快递单号 (选填，可自动识别快递公司)</label>
            <input v-model="shipModal.no" type="text" class="form-input" placeholder="留空则不回填运单号">
            <div v-if="detectedCompany" style="margin-top: 0.5rem; font-size: 0.85rem; color: #047857;">
                <i class="fa fa-check-circle"></i> 识别为: {{ detectedCompany }}
            </div>
            <div class="modal-actions">
                <button @click="shipModal.show = false" class="admin-btn btn-outline">取消</button>
                <button @click="confirmShip" class="admin-btn btn-blue">确认发货</button>
            </div>
        </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from 'vue'
import { useShopStore } from '@/stores/shopStore'

const store = useShopStore()
const filterStatus = ref('all')
const orders = computed(() => store.state.adminOrders)

const statusOptions = [{ value: 'all', label: '全部' }, { value: 1, label: '待付款' }, { value: 5, label: '待确认' }, { value: 2, label: '待发货' }, { value: 0, label: '已取消' }]

const changeFilter = (status) => {
    filterStatus.value = status
    store.fetchAdminOrders(status)
}

onMounted(() => {
    store.fetchAdminOrders('all')
})

const getStatusLabel = (s) => (['已取消', '待付款', '待发货', '已发货', '已完成', '待确认'][s] || '未知')

const updateStatus = async (id, status) => {
    if (status === 0 && !confirm('取消订单将自动回滚库存，确定吗？')) return
    await store.updateOrderStatus(id, status)
}

const shipModal = reactive({ show: false, id: null, no: '' })
const openShip = (order) => {
    shipModal.no = ''
    shipModal.id = order.id
    shipModal.show = true
}

const detectCompany = (no) => {
    if (!no) return ''
    const n = no.trim().toUpperCase()
    if (n.startsWith('SF')) return '顺丰速运'
    if (n.startsWith('YT')) return '圆通速递'
    if (n.startsWith('JT')) return '极兔速递'
    if (n.startsWith('JD')) return '京东快递'
    if (/^E[A-Z]\d/.test(n)) return 'EMS'
    if (/^46\d/.test(n)) return '韵达快递'
    if (/^77\d/.test(n)) return '申通快递'
    if (/^7[56]\d/.test(n)) return '中通快递'
    if (/^(268|368|468|568)\d/.test(n)) return '申通快递'
    if (/^(31|32|33|34)\d/.test(n)) return '韵达快递'
    if (/^(70|56)\d/.test(n)) return '百世快递'
    return '未知快递'
}

const detectedCompany = computed(() => detectCompany(shipModal.no))

const confirmShip = async () => {
    const no = shipModal.no.trim()
    const tracking = no ? { trackingCompany: detectCompany(no), trackingNo: no } : {}
    await store.updateOrderStatus(shipModal.id, 3, tracking)
    shipModal.show = false
}
</script>