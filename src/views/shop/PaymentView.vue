<template>
  <div class="payment-container" v-if="order">
    <div class="text-center" style="margin-bottom: 2rem;">
        <h2 style="font-size: 1.5rem; font-weight: bold; color: #1f2937; margin: 0 0 0.5rem 0;">订单已提交</h2>
        <p style="color: #666; margin: 0;">请尽快完成支付，订单将保留 24 小时</p>
    </div>
    <div class="payment-grid">
        <div class="order-info-col">
            <label style="font-size: 0.75rem; color: #666; text-transform: uppercase; margin-bottom: 0.25rem;">订单编号</label>
            <div class="flex-row items-center gap-2" style="margin-bottom: 1.5rem;">
                <span class="order-sn">{{ order.id }}</span>
                <button @click="copy(order.id)" style="font-size: 0.75rem; background: #dbeafe; color: #2563eb; border: none; padding: 2px 6px; border-radius: 4px; cursor: pointer;">复制</button>
            </div>
            <label style="font-size: 0.75rem; color: #666; text-transform: uppercase; margin-bottom: 0.25rem;">应付金额</label>
            <div style="font-size: 1.875rem; font-weight: bold; color: #1f2937; margin-bottom: 0.5rem;">¥{{ order.total }}</div>
            <div v-if="Number(order.discountAmount) > 0" style="font-size: 0.75rem; color: #6b7280; margin-bottom: 0.5rem;">
                原价 ¥{{ order.originalTotal }}，优惠 -¥{{ order.discountAmount }}
            </div>
            <div style="font-size: 0.75rem; color: #9ca3af; margin-top: auto;">* 请务必支付准确金额</div>
        </div>
        <div class="qr-col">
            <!-- 支付方式切换 -->
            <div style="display: flex; gap: 0; margin-bottom: 1rem; border-radius: 8px; overflow: hidden; border: 1px solid #e5e7eb;">
                <button @click="payMethod = 'wechat'"
                    :style="payMethod === 'wechat' ? 'background: #07c160; color: #fff; border: none; padding: 0.5rem 1.25rem; cursor: pointer; flex: 1; font-size: 0.875rem; font-weight: 500;' : 'background: #fff; color: #374151; border: none; padding: 0.5rem 1.25rem; cursor: pointer; flex: 1; font-size: 0.875rem;'">
                    <i class="fab fa-weixin"></i> 微信
                </button>
                <button @click="payMethod = 'alipay'"
                    :style="payMethod === 'alipay' ? 'background: #1677ff; color: #fff; border: none; padding: 0.5rem 1.25rem; cursor: pointer; flex: 1; font-size: 0.875rem; font-weight: 500;' : 'background: #fff; color: #374151; border: none; padding: 0.5rem 1.25rem; cursor: pointer; flex: 1; font-size: 0.875rem;'">
                    <i class="fab fa-alipay"></i> 支付宝
                </button>
            </div>
            <div class="qr-placeholder">
                <img v-if="currentQrUrl" :src="currentQrUrl" :alt="payMethod === 'wechat' ? '微信收款码' : '支付宝收款码'" class="payment-qr-image">
                <div v-else style="position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; flex-direction: column; gap: 0.25rem;">
                    <i class="fa fa-qrcode" style="font-size: 2.5rem; color: #333; opacity: 0.7;"></i>
                    <span style="font-size: 0.75rem; color: #6b7280;">后台未配置二维码</span>
                </div>
            </div>
            <p style="font-size: 0.875rem; font-weight: bold; margin: 0;" :style="payMethod === 'wechat' ? 'color: #07c160;' : 'color: #1677ff;'">
                {{ payMethod === 'wechat' ? '微信扫码支付' : '支付宝扫码支付' }}
            </p>
            <div style="margin-top: 0.75rem; font-size: 0.75rem; color: #4b5563;">
                请备注: <span class="remark-code">{{ order.id.split('-').pop() }}</span>
            </div>
            <div style="margin-top: 0.5rem; font-size: 0.75rem; color: #6b7280;">
                {{ paymentConfig.paymentNote }}
            </div>
        </div>
    </div>

    <p style="font-size: 0.75rem; color: #9ca3af; margin: 0 0 1.5rem 0; text-align: center;">管理员核对账单将有一定延迟，如果订单长期为确认，请联系我们。</p>

    <div class="flex-row gap-4" style="justify-content: center;">
        <button class="market-btn btn-ghost" style="padding: 0.5rem 1.5rem;" @click="helpModal = true">
            <i class="fa fa-question-circle"></i> 无法付款
        </button>
        <button class="market-btn btn-green" style="padding: 0.5rem 2rem;" @click="confirmPay">
            <i class="fa fa-check mr-2"></i> 我已完成支付
        </button>
    </div>

    <!-- 无法付款弹窗 -->
    <div v-if="helpModal" style="position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 100;" @click.self="helpModal = false">
        <div style="background: #fff; border-radius: 12px; padding: 2rem; max-width: 320px; width: 90%; text-align: center;">
            <h3 style="font-size: 1.125rem; font-weight: bold; color: #1f2937; margin: 0 0 0.75rem 0;">添加好友转账</h3>
            <div style="width: 180px; height: 180px; margin: 0 auto 1rem; background: #f3f4f6; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                <img v-if="paymentConfig.friendQr" :src="paymentConfig.friendQr" alt="好友二维码" class="payment-qr-image">
                <i v-else class="fab fa-weixin" style="font-size: 4rem; color: #07c160;"></i>
            </div>
            <p style="font-size: 0.875rem; color: #374151; line-height: 1.6; margin: 0 0 0.5rem 0;">
                {{ paymentConfig.friendHelpText }}
            </p>
            <p style="font-size: 0.875rem; color: #374151; line-height: 1.6; margin: 0 0 1rem 0;">
                转账时请备注订单号:
            </p>
            <div style="display: inline-block; background: #f0fdf4; border: 1px solid #bbf7d0; padding: 0.35rem 0.75rem; border-radius: 6px; margin-bottom: 1.25rem;">
                <span style="font-family: monospace; font-weight: bold; color: #15803d; font-size: 0.9rem;">{{ order.id }}</span>
                <button @click="copy(order.id)" style="font-size: 0.7rem; background: #dcfce7; color: #15803d; border: none; padding: 2px 6px; border-radius: 4px; cursor: pointer; margin-left: 0.5rem;">复制</button>
            </div>
            <div>
                <button @click="helpModal = false" style="background: #f3f4f6; color: #374151; border: none; padding: 0.5rem 2rem; border-radius: 8px; cursor: pointer; font-size: 0.875rem;">我知道了</button>
            </div>
        </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useShopStore } from '@/stores/shopStore'
import { trackEvent } from '@/utils/analytics'

const store = useShopStore()
const router = useRouter()
const order = computed(() => store.state.currentOrder)

const payMethod = ref('wechat')
const helpModal = ref(false)
const paymentConfig = computed(() => store.state.siteConfig?.payment || {})
const currentQrUrl = computed(() => {
    if (payMethod.value === 'wechat') return paymentConfig.value.wechatQr
    return paymentConfig.value.alipayQr
})

onMounted(() => {
    store.fetchSiteConfig(false)
})

const copy = (text) => {
    navigator.clipboard.writeText(text)
    store.showNotification('已复制')
}

const confirmPay = async () => {
    if (!order.value?.id) {
        store.showNotification('订单信息缺失，请重新下单')
        router.push('/')
        return
    }
    const success = await store.submitOrderPayment(order.value.id)
    if (!success) return
    trackEvent('payment_submitted', { orderId: order.value.id, payMethod: payMethod.value })
    store.clearCart()
    router.push('/success')
}
</script>

<style scoped>
.payment-qr-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 6px;
}
</style>
