<template>
  <div class="checkout-layout">
    <div>
        <div class="form-card">
            <h3 class="section-title">收货信息</h3>
            <div class="form-grid">
                <div class="col-span-2 input-group">
                    <label>收货人姓名</label>
                    <input v-model="form.name" type="text" class="input-field" placeholder="请填写收货人姓名">
                </div>
                <div class="input-group">
                    <label>手机号码</label>
                    <input v-model="form.phone" type="tel" class="input-field" placeholder="11位手机号">
                </div>
                <div class="input-group">
                    <label>电子邮箱</label>
                    <input v-model="form.email" type="email" class="input-field" placeholder="用于接收订单通知">
                </div>
                <div class="col-span-2 input-group">
                    <label>详细地址</label>
                    <textarea v-model="form.address" class="input-field" placeholder="省/市/区/街道/门牌号"></textarea>
                </div>
            </div>
        </div>
        
        <div class="form-card">
            <h3 class="section-title">支付说明</h3>
            <div style="padding: 1rem; background-color: #fefce8; color: #854d0e; border-radius: var(--radius-md); font-size: 0.875rem;">
                <i class="fa fa-exclamation-triangle mr-1"></i> 
                因社团非营利性质，暂不支持自动回调支付。请下单后扫描二维码手动转账，并备注订单号。
            </div>
        </div>
    </div>
    <div>
        <div class="form-card summary-card">
            <h3 style="font-weight: bold; color: #374151; margin: 0 0 1rem 0;">订单概览</h3>
            <div class="order-item-list custom-scrollbar">
                <div v-for="item in store.state.cart" :key="item.id" class="summary-row">
                    <span style="width: 66%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">{{ item.name }} x{{ item.quantity }}</span>
                    <span style="color: #1f2937;">¥{{ item.price * item.quantity }}</span>
                </div>
            </div>
            <hr style="border: none; border-top: 1px dashed #eee; margin: 1rem 0;">
            <div class="summary-row"><span style="color: #666;">商品总额</span><span>¥{{ store.cartTotal }}</span></div>
            <div class="summary-row"><span style="color: #666;">运费</span><span>¥{{ store.shippingFee }}</span></div>
            <div class="total-row">
                <span style="font-weight: bold; color: #374151;">应付总额</span>
                <span class="total-price">¥{{ store.finalTotal }}</span>
            </div>
            <button @click="submitOrder" class="market-btn primary-action" style="width: 100%; margin-top: 1.5rem; padding: 0.75rem;">
                提交订单
            </button>
        </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useShopStore } from '@/stores/shopStore'

const store = useShopStore()
const router = useRouter()
const form = reactive({ name: '', phone: '', email: '', address: '' })

const submitOrder = () => {
    if (!form.name || !form.phone || !form.address) {
        store.showNotification('请完整填写收货信息')
        return
    }
    const now = new Date()
    const id = `SOS-${now.getFullYear()}${(now.getMonth()+1).toString().padStart(2,'0')}${now.getDate()}-${Math.floor(Math.random()*10000)}`
    
    store.setOrder({ id, total: store.finalTotal.value })
    store.showNotification('正在提交订单...')
    setTimeout(() => router.push('/payment'), 1000)
}
</script>