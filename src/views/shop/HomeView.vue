<template>
  <div class="home-view">
    <!-- 本地筛选栏已移除，功能已移至 Layout 的 Header 中 -->

    <div class="page-header">
        <h2 class="page-title">{{ currentTypeName }}列表</h2>
        <span style="font-size: 0.875rem; color: #666;">共找到 {{ filteredProducts.length }} 件宝物</span>
    </div>

    <div class="product-grid">
        <div v-for="item in filteredProducts" :key="item.id" class="product-card group" @click="$router.push(`/product/${item.id}`)">
            <div class="card-image-wrapper">
                <img :src="item.image" :alt="item.name" class="card-image">
                <div class="card-overlay">
                    <button class="market-btn" @click.stop="store.addToCart(item)">加入购物车</button>
                </div>
            </div>
            <div class="card-body">
                <div class="card-title-row">
                    <h3 class="card-title">{{ item.name }}</h3>
                    <span class="card-price">¥{{ item.price }}</span>
                </div>
                <p class="card-desc">{{ item.desc }}</p>
                <div class="card-footer">
                    <span class="badge-tag">{{ item.category }}</span>
                    <small class="stock-label">库存: {{ item.stock }}</small>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useShopStore } from '@/stores/shopStore'

const store = useShopStore()

// 这里仍然需要定义类型列表以计算标题名称，或者也可以放入 store 中
const productTypes = [
    { id: 'all', name: '全部' }, { id: 'stand', name: '立牌' },
    { id: 'card', name: '卡贴' }, { id: 'fan', name: '折扇/团扇' },
    { id: 'paper', name: '色纸' }
]

// 使用 store 中的全局状态进行筛选
const filteredProducts = computed(() => {
    const currentType = store.state.currentType
    if (currentType === 'all') return store.state.products
    return store.state.products.filter(p => p.typeId === currentType || (currentType === 'fan' && (p.typeId === 'fan' || p.category.includes('扇'))))
})

const currentTypeName = computed(() => productTypes.find(t => t.id === store.state.currentType)?.name || '全部')
</script>