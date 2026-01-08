<template>
  <div v-if="product">
    <div class="breadcrumb">
        <span @click="$router.push('/')">首页</span> &gt; 
        <span>{{ product.category }}</span> &gt; 
        <span style="color: var(--text-main); font-weight: bold;">详情</span>
    </div>

    <div class="detail-card">
        <div class="detail-layout">
            <div class="detail-image-box">
                <img :src="product.image" alt="商品主图">
            </div>
            <div class="detail-info">
                <div>
                    <h1 class="detail-title">{{ product.name }}</h1>
                    <p class="detail-desc">{{ product.desc }}</p>
                    <div class="price-box">
                        <span style="font-size: 0.875rem; color: var(--primary-color);">应援价</span>
                        <span class="price-current">¥{{ product.price }}</span>
                        <span class="price-original">¥{{ (product.price * 1.3).toFixed(0) }}</span>
                        <span class="tag-stock">现货发售</span>
                    </div>
                    <div style="margin-bottom: 2rem;">
                        <h3 style="font-size: 0.875rem; color: #999; margin-bottom: 0.75rem; text-transform: uppercase;">规格参数</h3>
                        <table class="specs-table">
                            <tr><td>材质</td><td>进口高透亚克力 (PMMA)</td></tr>
                            <tr><td>高度</td><td>约 15.5 cm</td></tr>
                            <tr><td>工艺</td><td>柯式印刷 + 局部烫金</td></tr>
                            <tr><td>出品</td><td>北高文艺部 / SOS团</td></tr>
                        </table>
                    </div>
                </div>
                <div>
                    <div class="flex-row items-center gap-4" style="margin-bottom: 1.5rem;">
                        <span style="font-size: 0.875rem; color: #666;">数量</span>
                        <div class="quantity-control">
                            <button @click="quantity > 1 ? quantity-- : null" class="qty-btn">-</button>
                            <input type="number" v-model="quantity" class="qty-input" readonly>
                            <button @click="quantity++" class="qty-btn">+</button>
                        </div>
                        <span style="font-size: 0.75rem; color: #999;">库存紧张 ({{ product.stock }}件)</span>
                    </div>
                    <div class="action-row">
                        <button class="market-btn primary action-btn-group" style="padding: 0.75rem;" @click="buyNow">
                            <i class="fa fa-shopping-bag mr-2"></i> 立即购买
                        </button>
                        <button class="market-btn outline-blue action-btn-group" style="padding: 0.75rem;" @click="addToCart">
                            <i class="fa fa-cart-plus mr-2"></i> 加入购物车
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="content-card">
        <div class="tabs-header">
            <div class="tab-item active">商品详情</div>
            <div class="tab-item">评价 (99+)</div>
            <div class="tab-item">售后说明</div>
        </div>
        <div class="tab-content">
            <div class="detail-text">
                <p style="margin-bottom: 1rem;">“我对普通的人类没有兴趣。你们之中要是有外星人、未来人、异世界人或者超能力者的话，就尽管来找我吧！以上。”</p>
                <p>还原动画经典名场面，SOS团团长凉宫春日霸气登场。<br>无论是摆在办公桌还是书架，都能感受到满满的元气与不可思议的力量。</p>
            </div>
            <div class="detail-images">
                    <img src="https://placehold.co/800x400/3498db/white?text=Detail+Banner+1" alt="详情">
                    <img src="https://placehold.co/800x1000/ecf0f1/333?text=Close+Up+Face+Detail" alt="详情">
                    <img src="https://placehold.co/800x600/2c3e50/white?text=Packaging+Display" alt="详情">
            </div>
        </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useShopStore } from '@/stores/shopStore'

const route = useRoute()
const router = useRouter()
const store = useShopStore()
const quantity = ref(1)

const product = computed(() => store.state.products.find(p => p.id == route.params.id))

const addToCart = () => {
    store.addToCart(product.value, quantity.value)
}

const buyNow = () => {
    addToCart()
    router.push('/cart')
}
</script>