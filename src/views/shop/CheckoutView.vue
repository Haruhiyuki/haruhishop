<template>
  <div class="checkout-layout">
    <!-- 左侧表单 -->
    <div>
        <div class="form-card">
            <h3 class="section-title">收货信息</h3>
            <div class="form-grid">
                <div class="col-span-2 input-group">
                    <label>收货人姓名 <span class="required">*</span></label>
                    <input v-model="form.name" type="text" class="input-field" placeholder="请填写收货人姓名">
                </div>
                <div class="input-group">
                    <label>手机号码 <span class="required">*</span></label>
                    <input v-model="form.phone" type="tel" class="input-field" placeholder="11位手机号" maxlength="11">
                </div>
                <div class="input-group">
                    <label>电子邮箱 <span class="required">*</span></label>
                    <input v-model="form.email" type="email" class="input-field" placeholder="用于接收订单通知">
                </div>
                
                <!-- 省市区选择器 (动态加载) -->
                <div class="col-span-2 input-group">
                    <label>所在地区 <span class="required">*</span></label>
                    <div class="flex-row gap-2">
                        <select v-model="form.province" class="select-field" @change="onProvinceChange">
                            <option value="">{{ loadingAddress ? '加载中...' : '选择省' }}</option>
                            <option v-for="p in addressData" :key="p.code" :value="p.name">{{ p.name }}</option>
                        </select>
                        <select v-model="form.city" class="select-field" @change="onCityChange" :disabled="!form.province">
                            <option value="">选择市</option>
                            <option v-for="c in availableCities" :key="c.code" :value="c.name">{{ c.name }}</option>
                        </select>
                        <select v-model="form.district" class="select-field" :disabled="!form.city">
                            <option value="">选择区/县</option>
                            <option v-for="d in availableDistricts" :key="d.code" :value="d.name">{{ d.name }}</option>
                        </select>
                    </div>
                </div>

                <div class="col-span-2 input-group">
                    <label>详细地址 <span class="required">*</span></label>
                    <textarea v-model="form.address" class="input-field" placeholder="街道、门牌号等"></textarea>
                </div>
            </div>
        </div>
        
        <div class="form-card">
            <h3 class="section-title">支付说明</h3>
            <div style="padding: 1rem; background-color: #fefce8; color: #854d0e; border-radius: var(--radius-md); font-size: 0.875rem;">
                <i class="fa fa-exclamation-triangle mr-1"></i> 
                订单提交后系统将为您锁定库存，请在 24 小时内完成支付。
            </div>
        </div>
    </div>

    <!-- 右侧概览 -->
    <div>
        <div class="form-card summary-card">
            <h3 style="font-weight: bold; color: #374151; margin: 0 0 1rem 0;">订单概览</h3>
            <div class="order-item-list custom-scrollbar">
                <div v-for="item in cart" :key="item.id" class="summary-row">
                    <span style="width: 66%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">{{ item.name }} x{{ item.quantity }}</span>
                    <span style="color: #1f2937;">¥{{ item.price * item.quantity }}</span>
                </div>
            </div>
            <hr style="border: none; border-top: 1px dashed #eee; margin: 1rem 0;">
            <div class="summary-row"><span style="color: #666;">商品总额</span><span>¥{{ cartTotal }}</span></div>
            <div class="summary-row">
                <span style="color: #666;">运费 (智能组合)</span>
                <span>¥{{ shippingFee }}</span>
            </div>
            <div class="total-row">
                <span style="font-weight: bold; color: #374151;">应付总额</span>
                <span class="total-price">¥{{ finalTotal }}</span>
            </div>
            <button @click="submitOrder" :disabled="isSubmitting" class="market-btn primary-action" style="width: 100%; margin-top: 1.5rem; padding: 0.75rem;">
                {{ isSubmitting ? '提交中...' : '提交订单' }}
            </button>
        </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useShopStore } from '@/stores/shopStore'
import { getAddressData } from '@/utils/chinaDivision'

const store = useShopStore()
const router = useRouter()
const form = reactive({ name: '', phone: '', email: '', province: '', city: '', district: '', address: '' })
const isSubmitting = ref(false)
const addressData = ref([])
const loadingAddress = ref(false)

const cart = computed(() => store.state.cart)
const cartTotal = store.cartTotal
const shippingFee = store.shippingFee
const finalTotal = store.finalTotal

// 加载地址数据
onMounted(async () => {
    loadingAddress.value = true
    addressData.value = await getAddressData()
    loadingAddress.value = false
})

// 级联选择逻辑
const availableCities = computed(() => {
    const p = addressData.value.find(item => item.name === form.province)
    return p ? p.children : []
})
const availableDistricts = computed(() => {
    const c = availableCities.value.find(item => item.name === form.city)
    return c ? c.children : []
})
const onProvinceChange = () => { form.city = ''; form.district = '' }
const onCityChange = () => { form.district = '' }

// 校验逻辑
const validateForm = () => {
    if (!form.name.trim()) return '请填写收货人姓名'
    if (!/^1[3-9]\d{9}$/.test(form.phone)) return '请输入正确的11位手机号码'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return '请输入正确的邮箱格式'
    if (!form.province || !form.city || !form.district) return '请选择完整的省市区'
    if (!form.address.trim()) return '请填写详细地址'
    return null
}

const submitOrder = async () => {
    const error = validateForm()
    if (error) {
        store.showNotification(error)
        return
    }
    if (cart.value.length === 0) return

    isSubmitting.value = true
    
    const now = new Date()
    const id = `SOS-${now.getFullYear()}${(now.getMonth()+1).toString().padStart(2,'0')}${now.getDate()}-${Math.floor(Math.random()*10000)}`
    
    const orderData = {
        id,
        items: cart.value,
        contact: form,
        total: finalTotal.value
    }

    const success = await store.createOrderBackend(orderData)
    
    isSubmitting.value = false
    
    if (success) {
        store.setOrder(orderData)
        store.clearCart()
        router.push('/payment')
    }
}
</script>

<style scoped>
.required { color: #ef4444; margin-left: 2px; }
.select-field { flex: 1; padding: 0.625rem; border: 1px solid #ddd; border-radius: var(--radius-md); outline: none; background: white; max-width: 32%; }
.checkout-layout { display: grid; grid-template-columns: 1fr; gap: 1.5rem; }
@media (min-width: 768px) { .checkout-layout { grid-template-columns: 2fr 1fr; } }
.form-card { background: white; padding: 1.5rem; border-radius: var(--radius-md); box-shadow: var(--shadow-sm); margin-bottom: 1.5rem; }
.section-title { font-size: 1.125rem; font-weight: bold; margin-bottom: 1rem; border-left: 4px solid var(--primary-color); padding-left: 0.75rem; }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
.col-span-2 { grid-column: span 2; }
.input-group label { display: block; font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 0.25rem; }
.input-field { width: 100%; padding: 0.625rem 1rem; border: 1px solid #ddd; border-radius: var(--radius-md); outline: none; transition: border-color 0.3s; }
.input-field:focus { border-color: var(--primary-color); }
textarea.input-field { resize: none; height: 6rem; }
.summary-card { position: sticky; top: 1.5rem; }
.order-item-list { max-height: 15rem; overflow-y: auto; margin-bottom: 1rem; padding-right: 0.5rem; }
.summary-row { display: flex; justify-content: space-between; font-size: 0.875rem; margin-bottom: 0.5rem; }
.total-row { display: flex; justify-content: space-between; align-items: flex-end; border-top: 1px solid #eee; padding-top: 1rem; margin-top: 1rem; }
.total-price { font-size: 1.5rem; font-weight: bold; color: var(--primary-color); }
</style>