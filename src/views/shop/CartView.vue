<template>
  <div>
    <div v-if="store.state.cart.length === 0" class="cart-empty">
        <i class="fa fa-shopping-basket cart-icon"></i>
        <p style="color: #666; margin-bottom: 1.5rem;">购物车空空如也，快去选购吧！</p>
        <button class="market-btn primary-action" @click="$router.push('/')">去逛逛</button>
    </div>
    <div v-else>
        <div class="cart-table-wrapper">
            <table class="cart-table">
                <thead>
                    <tr><th style="padding-left: 1.5rem;">商品信息</th><th class="text-center">单价</th><th class="text-center">数量</th><th class="text-center">小计</th><th class="text-center">操作</th></tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in store.state.cart" :key="item.id">
                        <td style="padding-left: 1.5rem;">
                            <div class="product-cell">
                                <img :src="item.image" class="thumb-img">
                                <span style="font-weight: bold; color: #374151;">{{ item.name }}</span>
                            </div>
                        </td>
                        <td class="text-center" style="color: #4b5563;">¥{{ item.price }}</td>
                        <td class="text-center">
                            <div class="quantity-control" style="display: inline-flex;">
                                <button @click="updateQuantity(index, -1)" class="qty-btn" style="width: 2rem; height: 2rem;">-</button>
                                <span class="qty-input" style="width: 2.5rem; height: 2rem; line-height: 2rem; padding: 0;">{{ item.quantity }}</span>
                                <button @click="updateQuantity(index, 1)" class="qty-btn" style="width: 2rem; height: 2rem;">+</button>
                            </div>
                        </td>
                        <td class="text-center" style="font-weight: bold; color: var(--primary-color);">¥{{ item.price * item.quantity }}</td>
                        <td class="text-center">
                            <button @click="store.removeFromCart(index)" style="color: #f87171; background: none; border: none; cursor: pointer;"><i class="fa fa-trash"></i></button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="cart-footer">
            <div style="font-size: 0.875rem; color: #666;"><i class="fa fa-info-circle mr-1"></i> 满200元包邮，当前运费: ¥{{ store.shippingFee }}</div>
            <div class="items-center flex-row gap-4">
                <div style="text-align: right;">
                    <span style="color: #666; margin-right: 0.5rem;">合计 (不含运费):</span>
                    <span style="font-size: 1.5rem; font-weight: bold; color: #1f2937;">¥{{ store.cartTotal }}</span>
                </div>
                <button class="market-btn primary-action" style="padding: 0.5rem 2rem; font-size: 1.125rem;" @click="$router.push('/checkout')">
                    去结算 <i class="fa fa-arrow-right ml-2" style="font-size: 0.875rem;"></i>
                </button>
            </div>
        </div>
    </div>
  </div>
</template>

<script setup>
import { useShopStore } from '@/stores/shopStore'
const store = useShopStore()

const updateQuantity = (index, delta) => {
    const item = store.state.cart[index]
    const newQty = item.quantity + delta
    if (newQty > 0) item.quantity = newQty
}
</script>