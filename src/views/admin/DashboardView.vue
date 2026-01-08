<template>
  <div>
    <div class="stats-grid">
        <div class="stat-card yellow"><div class="stat-label">待人工核销</div><div class="stat-value">5 <span class="stat-unit">单</span></div></div>
        <div class="stat-card blue"><div class="stat-label">待发货</div><div class="stat-value">12 <span class="stat-unit">单</span></div></div>
        <div class="stat-card green"><div class="stat-label">总销售额</div><div class="stat-value">¥8,848</div></div>
        <div class="stat-card purple"><div class="stat-label">总订单数</div><div class="stat-value">128</div></div>
    </div>
    <div class="panel">
        <div class="panel-body">
            <h3 style="font-weight: bold; color: #374151; margin: 0 0 1rem 0;">快捷操作</h3>
            <div style="display: flex; gap: 1rem;">
                <button class="admin-btn btn-blue" style="padding: 0.75rem 1.5rem;" @click="$router.push('/admin/orders')">
                    <i class="fa fa-check-double"></i> 去审核收款
                </button>
                <button class="admin-btn btn-green" style="padding: 0.75rem 1.5rem;">
                    <i class="fa fa-file-excel"></i> 导出今日发货单
                </button>
            </div>
        </div>
    </div>
  </div>
</template>