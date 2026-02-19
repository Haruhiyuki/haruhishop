<template>
  <div class="shop-app">
    <!-- Header: 标准版 (首页/其他) -->
    <header v-if="!isDetailPage" :class="['app-header', 'header-bg', isHomePage ? 'header-expanded' : 'header-collapsed']">
        <div ref="mobileMenuWrapRef" class="mobile-menu-wrap standard-menu-wrap">
            <button
                class="mobile-menu-toggle"
                type="button"
                :aria-expanded="mobileMenuOpen ? 'true' : 'false'"
                aria-label="切换菜单"
                @click="toggleMobileMenu"
            >
                <i :class="['fa', mobileMenuOpen ? 'fa-times' : 'fa-bars']"></i>
                菜单
            </button>
            <transition name="menu-pop">
                <div v-if="mobileMenuOpen" class="mobile-header-menu">
                    <button
                        v-for="item in mobileHeaderActions"
                        :key="`std-${item.id}`"
                        class="mobile-header-menu-btn"
                        :class="{ active: route.name === item.routeName }"
                        type="button"
                        @click="goTo(item.path)"
                    >
                        <i :class="item.icon"></i>
                        <span>{{ item.label }}</span>
                        <span v-if="item.id === 'cart' && cartCount > 0" class="badge-count mobile-menu-badge">{{ cartCount }}</span>
                    </button>
                </div>
            </transition>
        </div>

        <!-- Top Toolbar -->
        <div class="top-toolbar desktop-header-actions">
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
                <div class="brand-logo">
                    <img :src="mainLogoUrl" alt="春日商城 Logo" class="brand-logo-img">
                </div>
                <div class="brand-text">
                    <h1>春 日 商 城</h1>
                    <div v-if="!isHomePage" class="brand-subtitle">{{ pageTitle }}</div>
                </div>
            </div>
            <div v-if="isHomePage" style="width: fit-content;">
                <hr class="custom-hr">
                <span class="slogan">
                    用爱发电的
                    <span class="nonprofit-term" tabindex="0" aria-label="非营利说明">
                        非营利
                        <span class="nonprofit-tooltip" role="tooltip">
                            “非营利”不等于“非盈利”，是不以利润分配为目的，所获利润用于团内。
                        </span>
                    </span>
                    周边商城平台
                </span>
            </div>
        </div>

        <!-- Filter Section (Only on Home) -->
        <div v-if="isHomePage" class="filter-section">
            <div class="filter-controls">
                <button
                    class="market-btn filter-toggle-btn"
                    type="button"
                    :aria-expanded="isFilterExpanded ? 'true' : 'false'"
                    aria-controls="product-filter-options"
                    @click="toggleFilterExpand"
                >
                    周边筛选
                    <i :class="['fa', isFilterExpanded ? 'fa-chevron-up' : 'fa-chevron-down', 'ml-2']"></i>
                </button>
                <transition name="fade">
                    <div
                        v-show="isFilterExpanded"
                        id="product-filter-options"
                        class="custom-btn-group"
                        role="group"
                        aria-label="周边筛选选项"
                    >
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
                </transition>
            </div>
            <div class="fund-notice">
                本商城全部利润将投入应援团经费<br>用于维持日常开销与活动支出
            </div>
        </div>

    </header>

    <!-- Header: 迷你版 (详情页) -->
    <header v-else class="mini-header-detail">
        <div class="mini-header-brand" @click="$router.push('/')">
            <div class="brand-logo mini-brand-logo">
                <img :src="miniLogoUrl" alt="春日商城 Mini Logo" class="brand-logo-img">
            </div>
            <span class="mini-header-title">春日商城</span>
        </div>
        <div class="mini-header-actions desktop-mini-actions">
            <button class="mini-header-action-btn" @click="$router.push('/contact')"><i class="fa fa-user"></i> 联系我们</button>
            <button class="mini-header-action-btn mini-header-cart-btn" @click="$router.push('/cart')">
                <i class="fa fa-shopping-cart"></i> 购物车
                <span v-if="cartCount > 0" class="badge-count mini-header-cart-badge">{{ cartCount }}</span>
            </button>
        </div>
        <div ref="mobileMenuWrapRef" class="mobile-menu-wrap mini-header-menu-wrap">
            <button
                class="mobile-menu-toggle mini-header-menu-toggle"
                type="button"
                :aria-expanded="mobileMenuOpen ? 'true' : 'false'"
                aria-label="切换菜单"
                @click="toggleMobileMenu"
            >
                <i :class="['fa', mobileMenuOpen ? 'fa-times' : 'fa-bars']"></i>
                菜单
            </button>

            <transition name="menu-pop">
                <div v-if="mobileMenuOpen" class="mobile-header-menu">
                    <button
                        v-for="item in mobileHeaderActions"
                        :key="`detail-${item.id}`"
                        class="mobile-header-menu-btn"
                        :class="{ active: route.name === item.routeName }"
                        type="button"
                        @click="goTo(item.path)"
                    >
                        <i :class="item.icon"></i>
                        <span>{{ item.label }}</span>
                        <span v-if="item.id === 'cart' && cartCount > 0" class="badge-count mobile-menu-badge">{{ cartCount }}</span>
                    </button>
                </div>
            </transition>
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

    <TheFooter />

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
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useShopStore } from '@/stores/shopStore'
import TheFooter from '@/components/TheFooter.vue'
import { appBaseUrl } from '@/utils/runtimePaths'
import '@/assets/shop.css'

const route = useRoute()
const router = useRouter()
const store = useShopStore()
const { cartCount, state, setProductType } = store
const mainLogoUrl = `${appBaseUrl}haruhi-logo-192.png`
const miniLogoUrl = `${appBaseUrl}favicon.ico`
const mobileMenuOpen = ref(false)
const isFilterExpanded = ref(true)
const mobileMenuWrapRef = ref(null)

const isHomePage = computed(() => route.name === 'home')
const isDetailPage = computed(() => route.name === 'product')
const currentType = computed(() => state.currentType)

const mobileHeaderActions = computed(() => {
    if (isDetailPage.value) {
        return [
            { id: 'contact', label: '联系我们', path: '/contact', routeName: 'contact', icon: 'fa fa-user' },
            { id: 'cart', label: '购物车', path: '/cart', routeName: 'cart', icon: 'fa fa-shopping-cart' }
        ]
    }

    const actions = [
        { id: 'contact', label: '联系我们', path: '/contact', routeName: 'contact', icon: 'fa fa-phone' },
        { id: 'query', label: '订单查询', path: '/query', routeName: 'query', icon: 'fa fa-search' },
        { id: 'cart', label: '购物车', path: '/cart', routeName: 'cart', icon: 'fa fa-shopping-cart' }
    ]

    if (!isHomePage.value) {
        actions.unshift({ id: 'home', label: '返回首页', path: '/', routeName: 'home', icon: 'fa fa-home' })
    }
    return actions
})

// 动态生成筛选列表：从商品数据中提取去重分类
const productTypes = computed(() => {
    const categories = [...new Set(state.products.map(p => p.category).filter(Boolean))]
    return [{ id: 'all', name: '全部' }, ...categories.map(c => ({ id: c, name: c }))]
})

const setType = (t) => {
    setProductType(t)
}

const toggleFilterExpand = () => {
    isFilterExpanded.value = !isFilterExpanded.value
}

const toggleMobileMenu = () => {
    mobileMenuOpen.value = !mobileMenuOpen.value
}

const goTo = (path) => {
    mobileMenuOpen.value = false
    if (route.path !== path) router.push(path)
}

const pageTitle = computed(() => {
    const map = {
        'cart': '购物车', 'checkout': '订单结算', 'payment': '收银台',
        'success': '支付审核', 'query': '订单查询', 'contact': '联系我们'
    }
    return map[route.name] || ''
})

watch(
    () => route.fullPath,
    () => {
        mobileMenuOpen.value = false
    }
)

const handleDocumentPointerDown = (event) => {
    if (!mobileMenuOpen.value) return
    const target = event.target
    if (!(target instanceof Node)) return
    const menuWrap = mobileMenuWrapRef.value
    if (menuWrap && !menuWrap.contains(target)) {
        mobileMenuOpen.value = false
    }
}

onMounted(() => {
    document.addEventListener('pointerdown', handleDocumentPointerDown)
})

onBeforeUnmount(() => {
    document.removeEventListener('pointerdown', handleDocumentPointerDown)
})
</script>

<style scoped>
@media (max-width: 639px) {
    .filter-controls { flex-wrap: nowrap; overflow-x: auto; -webkit-overflow-scrolling: touch; }
}
</style>
