<template>
  <div class="contact-card">
    <div class="contact-info">
        <div>
            <h3 style="font-size: 1.25rem; font-weight: bold; margin-bottom: 1rem;">联系方式</h3>
            <p style="margin-bottom: 1.5rem; opacity: 0.8; font-size: 0.9rem;">如果您对周边或订单有任何疑问，请留言。</p>
            <ul style="list-style: none; padding: 0; font-size: 0.875rem; line-height: 2;">
                <li><i class="fa fa-envelope mr-2"></i> sos_brigade@example.com</li>
                <li><i class="fa fa-phone mr-2"></i> 021-12345678</li>
                <li><i class="fa fa-map-marker-alt mr-2"></i> 北高文艺部活动室</li>
            </ul>
        </div>
        <div style="margin-top: 2rem; padding-top: 2rem; border-top: 1px solid rgba(255,255,255,0.2); opacity: 0.6; font-size: 0.75rem;">
            &copy; SOS团支部
        </div>
    </div>
    <div class="contact-form">
        <h3 style="font-size: 1.25rem; font-weight: bold; color: #1f2937; margin-bottom: 1.5rem;">发送留言</h3>
        <div style="display: flex; flex-direction: column; gap: 1rem;">
            <div class="form-grid">
                <input type="text" placeholder="您的称呼" class="input-field">
                <input type="text" placeholder="联系方式" class="input-field">
            </div>
            <input type="text" placeholder="订单号 (选填)" class="input-field">
            <textarea placeholder="请描述您的问题..." class="input-field" style="height: 8rem;"></textarea>
            <div style="text-align: right;">
                <button class="market-btn primary-action" style="padding: 0.5rem 2rem;">发送</button>
            </div>
        </div>
    </div>
  </div>
</template>