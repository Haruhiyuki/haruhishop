import { reactive, computed } from 'vue'

// 使用 Vite 代理路径
const API_URL = '/api/products'
const ORDER_URL = '/api/orders'
const UPLOAD_URL = '/api/upload'

const state = reactive({
    cart: [],
    currentType: 'all',
    products: [], 
    currentOrder: null,
    notification: null,
    adminOrders: [] // 确保后台订单列表状态存在
})

export const useShopStore = () => {
    // --- 计算属性 ---
    const cartCount = computed(() => state.cart.reduce((acc, item) => acc + item.quantity, 0))
    const cartTotal = computed(() => state.cart.reduce((acc, item) => acc + item.price * item.quantity, 0))
    
    // 运费计算：按标签分组取最大值后累加
    const shippingFee = computed(() => {
        if (state.cart.length === 0) return 0
        const groups = {}
        state.cart.forEach(item => {
            const tag = item.shippingTag || 'default'
            const cost = item.shippingCost || 0
            if (groups[tag] === undefined) groups[tag] = cost
            else if (cost > groups[tag]) groups[tag] = cost
        })
        return Object.values(groups).reduce((sum, val) => sum + val, 0)
    })

    const finalTotal = computed(() => cartTotal.value + shippingFee.value)

    const setProductType = (type) => { state.currentType = type }

    // --- 通用方法 ---
    const showNotification = (msg) => {
        state.notification = msg
        setTimeout(() => state.notification = null, 3000)
    }

    const setOrder = (order) => state.currentOrder = order

    // --- 商品 API ---
    const fetchProducts = async () => {
        try {
            const res = await fetch(API_URL)
            const data = await res.json()
            state.products = data
        } catch (err) { console.error(err) }
    }

    const uploadImage = async (file) => {
        const formData = new FormData()
        formData.append('file', file)
        try {
            const res = await fetch(UPLOAD_URL, { method: 'POST', body: formData })
            if (res.ok) {
                const data = await res.json()
                return data.url
            }
        } catch (e) { 
            showNotification('图片上传失败')
            return null 
        }
    }

    const addProduct = async (product) => {
        try {
            const res = await fetch(API_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(product) })
            if (res.ok) { await fetchProducts(); showNotification('商品添加成功'); return true }
        } catch(e) { showNotification('添加失败'); }
        return false
    }

    const updateProduct = async (id, product) => {
        try {
            const res = await fetch(`${API_URL}/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(product) })
            if (res.ok) { await fetchProducts(); showNotification('商品更新成功'); return true }
        } catch(e) { showNotification('更新失败'); }
        return false
    }

    const deleteProduct = async (id) => {
        if (!confirm('确定删除?')) return
        try {
            await fetch(`${API_URL}/${id}`, { method: 'DELETE' })
            await fetchProducts()
            showNotification('已删除')
        } catch(e) { showNotification('删除失败'); }
    }

    // --- 购物车逻辑 ---
    const addToCart = (product, qty = 1) => {
        const existingItem = state.cart.find(item => item.id === product.id)
        if (existingItem) { existingItem.quantity += qty } 
        else { state.cart.push({ ...product, quantity: qty, shippingTag: product.shippingTag, shippingCost: product.shippingCost }) }
        showNotification('已加入购物车')
    }

    const removeFromCart = (index) => state.cart.splice(index, 1)
    const clearCart = () => state.cart = []

    // --- 订单 API (前台 & 后台) ---
    
    // 前台：创建订单
    const createOrderBackend = async (orderData) => {
        try {
            const res = await fetch(ORDER_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(orderData) })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error || '创建订单失败')
            return true
        } catch (e) {
            showNotification(e.message)
            return false
        }
    }

    // 后台：获取订单列表
    const fetchAdminOrders = async (status = 'all') => {
        try {
            const res = await fetch(`${ORDER_URL}?status=${status}`)
            if (res.ok) {
                state.adminOrders = await res.json()
            }
        } catch (e) { console.error("Fetch orders failed", e) }
    }

    // 后台：更新订单状态
    const updateOrderStatus = async (id, status, tracking = {}) => {
        try {
            const payload = { status, ...tracking }
            const res = await fetch(`${ORDER_URL}/${id}/status`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
            if (res.ok) {
                await fetchAdminOrders() // 刷新列表
                showNotification('订单状态已更新')
            } else {
                showNotification('状态更新失败')
            }
        } catch (e) { showNotification('网络错误') }
    }

    return {
        state, cartCount, cartTotal, shippingFee, finalTotal,
        setProductType, addToCart, removeFromCart, clearCart, showNotification, setOrder,
        fetchProducts, addProduct, updateProduct, deleteProduct, uploadImage, 
        createOrderBackend, fetchAdminOrders, updateOrderStatus
    }
}