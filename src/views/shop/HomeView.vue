<template>
  <div class="home-view">
    <div class="page-header">
        <h2 class="page-title">{{ currentTypeName }}列表</h2>
        <span style="font-size: 0.875rem; color: #666;">共找到 {{ filteredProducts.length }} 件宝物</span>
    </div>

    <div v-if="filteredProducts.length > 0" class="product-grid">
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
    <div v-else style="padding: 4rem; text-align: center; color: #666;">
        <i class="fa fa-spinner fa-spin" style="font-size: 2rem; margin-bottom: 1rem;"></i>
        <p>正在读取商品数据...</p>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useShopStore } from '@/stores/shopStore'

const store = useShopStore()

// [新增] 页面加载时获取数据
onMounted(() => {
    store.fetchProducts()
})

const filteredProducts = computed(() => {
    const currentType = store.state.currentType
    if (currentType === 'all') return store.state.products
    return store.state.products.filter(p => p.category === currentType)
})

const currentTypeName = computed(() => store.state.currentType === 'all' ? '全部' : store.state.currentType)
</script>