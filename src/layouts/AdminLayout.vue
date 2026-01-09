<template>
  <div class="app-container">
    <aside class="sidebar">
        <div class="sidebar-header">
            <h1 class="sidebar-title"><i class="fa fa-star" style="margin-right: 0.5rem;"></i>SOS团支部</h1>
        </div>
        <nav class="nav-menu">
            <div class="nav-label">控制台</div>
            <router-link to="/admin/dashboard" class="nav-item" active-class="active">
                <i class="fa fa-tachometer-alt" style="width: 1.5rem;"></i> 总览看板
            </router-link>
            <router-link to="/admin/orders" class="nav-item" active-class="active">
                <i class="fa fa-list-alt" style="width: 1.5rem;"></i> 订单管理
            </router-link>
            <!-- [新增] 商品库入口 -->
            <router-link to="/admin/products" class="nav-item" active-class="active">
                <i class="fa fa-box" style="width: 1.5rem;"></i> 商品库
            </router-link>
            <router-link to="/admin/stats" class="nav-item" active-class="active">
                <i class="fa fa-chart-bar" style="width: 1.5rem;"></i> 数据统计
            </router-link>
            
            <div class="nav-label">系统</div>
            <a class="nav-item">
                <i class="fa fa-cog" style="width: 1.5rem;"></i> 设置
            </a>
        </nav>
        <div class="sidebar-footer">北高文艺部内部系统 v1.1</div>
    </aside>

    <main class="main-wrapper">
        <header class="top-header">
            <h2 class="page-heading">{{ route.name === 'admin-dashboard' ? '总览看板' : (route.name === 'admin-products' ? '商品库' : '管理后台') }}</h2>
            <div class="user-profile">
                <span class="user-info">管理员: <strong>长门有希</strong></span>
                <button class="logout-btn" @click="$router.push('/')"><i class="fa fa-sign-out-alt"></i></button>
            </div>
        </header>
        <div class="content-scroll">
            <router-view></router-view>
        </div>
    </main>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import '@/assets/admin.css'

const route = useRoute()
</script>