import { createRouter, createWebHistory } from 'vue-router'
import ShopLayout from '../layouts/ShopLayout.vue'
import AdminLayout from '../layouts/AdminLayout.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    // 前台商城路由
    {
      path: '/',
      component: ShopLayout,
      children: [
        { path: '', name: 'home', component: () => import('../views/shop/HomeView.vue') },
        { path: 'product/:id', name: 'product', component: () => import('../views/shop/ProductDetailView.vue') },
        { path: 'cart', name: 'cart', component: () => import('../views/shop/CartView.vue') },
        { path: 'checkout', name: 'checkout', component: () => import('../views/shop/CheckoutView.vue') },
        { path: 'payment', name: 'payment', component: () => import('../views/shop/PaymentView.vue') },
        { path: 'success', name: 'success', component: () => import('../views/shop/SuccessView.vue') },
        { path: 'query', name: 'query', component: () => import('../views/shop/OrderQueryView.vue') },
        { path: 'contact', name: 'contact', component: () => import('../views/shop/ContactView.vue') }
      ]
    },
    // 后台管理路由
    {
      path: '/admin',
      component: AdminLayout,
      children: [
        { path: '', redirect: '/admin/dashboard' },
        { path: 'dashboard', name: 'admin-dashboard', component: () => import('../views/admin/DashboardView.vue') },
        { path: 'orders', name: 'admin-orders', component: () => import('../views/admin/OrdersView.vue') },
        { path: 'products', name: 'admin-products', component: () => import('../views/admin/ProductsView.vue') }, // 新增路由
        { path: 'stats', name: 'admin-stats', component: () => import('../views/admin/StatsView.vue') }
      ]
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    return { top: 0 }
  }
})

export default router