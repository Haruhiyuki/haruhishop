<template>
  <div class="shop-app">
    <!-- Header: 标准版 (首页/其他) -->
    <header v-if="!isDetailPage" :class="['app-header', 'header-bg', isHomePage ? 'header-expanded' : 'header-collapsed']">
        <!-- Top Toolbar -->
        <div class="top-toolbar">
            <button class="market-btn" @click="$router.push('/')" v-if="!isHomePage">
                <i class="fa fa-home mr-2"></i> 返回首页
            </button>
            <button class="market-btn" @click="$router.push('/contact')" :class="{active: $route.name === 'contact'}">
                <i class="fa fa-phone mr-2"></i> 联系我们
            </button>
            <button class="market-btn" @click="$router.push('/query')" :class="{active: $route.name === 'query'}">
                <i class="fa fa-search mr-2"></i> 订单查询
            </button>
            <button class="market-btn" @click="$router.push('/cart')" :class="{active: $route.name === 'cart'}">
                <i class="fa fa-shopping-cart mr-2"></i> 购物车
                <div v-if="cartCount > 0" class="badge-count">{{ cartCount }}</div>
            </button>
        </div>

        <!-- Title Section -->
        <div>
            <div class="brand-area" @click="$router.push('/')">
                <div class="brand-logo">SOS</div>
                <div class="brand-text">
                    <h1>春 日 商 城</h1>
                    <div v-if="!isHomePage" class="brand-subtitle">{{ pageTitle }}</div>
                </div>
            </div>
            <div v-if="isHomePage" style="width: fit-content;">
                <hr class="custom-hr">
                <span class="slogan">用爱发电的非营利周边商城平台</span>
            </div>
        </div>

        <!-- Filter Section (Only on Home) -->
        <div v-if="isHomePage" class="filter-section">
            <div class="filter-controls">
                <button class="market-btn" disabled style="opacity: 0.8; cursor: default;">
                    周边筛选 <i class="fa fa-chevron-right ml-2"></i>
                </button>
                <div class="custom-btn-group">
                    <button 
                        v-for="type in productTypes" 
                        :key="type.id"
                        class="market-btn" 
                        :class="{ 'active': currentType === type.id }" 
                        @click="setType(type.id)"
                    >
                        <i :class="['fa', currentType === type.id ? 'fa-check-circle-o' : 'fa-circle-o', 'mr-1']"></i>
                        {{ type.name }}
                    </button>
                </div>
            </div>
            <div class="fund-notice">
                本商城全部收入将投入应援团经费<br>用于维持日常开销与活动支出
            </div>
        </div>
    </header>

    <!-- Header: 迷你版 (详情页) -->
    <header v-else class="mini-header-detail">
        <div class="items-center flex-row" style="display:flex; gap: 0.75rem; cursor: pointer;" @click="$router.push('/')">
            <div class="brand-logo" style="width: 2rem; height: 2rem; font-size: 0.75rem;">SOS</div>
            <span style="font-weight: bold; font-size: 1.125rem; color: white; letter-spacing: 0.1em;">春日商城</span>
        </div>
        <div style="display: flex; gap: 1rem; color: white; font-size: 0.875rem;">
            <button style="background:none; border:none; color:white; cursor:pointer;" @click="$router.push('/contact')"><i class="fa fa-user"></i> 个人中心</button>
            <button style="background:none; border:none; color:white; cursor:pointer; position:relative;" @click="$router.push('/cart')">
                <i class="fa fa-shopping-cart"></i> 购物车
                <span v-if="cartCount > 0" class="badge-count" style="top: -5px; right: -10px; width: 16px; height: 16px; font-size: 10px;">{{ cartCount }}</span>
            </button>
        </div>
    </header>

    <!-- Main Content -->
    <main class="main-content">
        <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
                <component :is="Component" />
            </transition>
        </router-view>
    </main>

    <!-- Footer -->
    <footer class="footer">
        <p style="margin: 0;">&copy; 2024 北高文艺部 / SOS团支部. All rights reserved.</p>
        <p style="margin: 0.5rem 0 0 0; font-size: 0.75rem; opacity: 0.6;">此页面为 Vue3 重构版预览</p>
    </footer>

    <!-- Toast -->
    <transition name="fade">
        <div v-if="state.notification" class="toast">
            <i class="fa fa-info-circle" style="color: #60a5fa;"></i>
            {{ state.notification }}
        </div>
    </transition>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useShopStore } from '@/stores/shopStore'
import '@/assets/shop.css'

const route = useRoute()
const store = useShopStore()
const { cartCount, state, setProductType } = store

const isHomePage = computed(() => route.name === 'home')
const isDetailPage = computed(() => route.name === 'product')
const currentType = computed(() => state.currentType)

// 动态生成筛选列表：从商品数据中提取去重分类
const productTypes = computed(() => {
    const categories = [...new Set(state.products.map(p => p.category).filter(Boolean))]
    return [{ id: 'all', name: '全部' }, ...categories.map(c => ({ id: c, name: c }))]
})

const setType = (t) => {
    setProductType(t)
}

const pageTitle = computed(() => {
    const map = {
        'cart': '购物车', 'checkout': '订单结算', 'payment': '收银台',
        'success': '支付审核', 'query': '订单查询', 'contact': '联系我们'
    }
    return map[route.name] || ''
})
</script>