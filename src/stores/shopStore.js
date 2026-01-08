import { reactive, computed } from 'vue'

// 简单的全局状态管理
const state = reactive({
    cart: [],
    // 添加全局筛选状态
    currentType: 'all', 
    products: [
        { id: 1, name: '团长大人挥斥方遒立牌', price: 45, category: '立牌', typeId: 'stand', stock: 120, image: 'https://placehold.co/400x500/2c3e50/white?text=Haruhi+Stand', desc: '经典校服造型，亚克力双面高清印刷。' },
        { id: 2, name: '长门有希读书中·色纸', price: 25, category: '色纸', typeId: 'paper', stock: 50, image: 'https://placehold.co/400x500/5e3c58/white?text=Yuki+Paper', desc: '金边签名版，精选特种纸。' },
        { id: 3, name: '朝比奈学姐女仆装卡贴', price: 5, category: '卡贴', typeId: 'card', stock: 300, image: 'https://placehold.co/400x500/e74c3c/white?text=Mikuru+Card', desc: 'PET磨砂材质，防水防刮。' },
        { id: 4, name: 'SOS团专属折扇', price: 35, category: '折扇', typeId: 'fan', stock: 20, image: 'https://placehold.co/400x500/3498db/white?text=SOS+Fan', desc: '10寸绢布扇面，竹制扇骨。' },
        { id: 5, name: '阿虚吐槽专用立牌', price: 40, category: '立牌', typeId: 'stand', stock: 99, image: 'https://placehold.co/400x500/95a5a6/white?text=Kyon+Stand', desc: '放在桌面上仿佛能听到他的叹气声。' },
        { id: 6, name: '古泉一树超能力特效立牌', price: 48, category: '立牌', typeId: 'stand', stock: 45, image: 'https://placehold.co/400x500/e67e22/white?text=Koizumi+Stand', desc: '背景带有闭锁空间特效件。' },
    ],
    currentOrder: null,
    notification: null
})

export const useShopStore = () => {
    const cartCount = computed(() => state.cart.reduce((acc, item) => acc + item.quantity, 0))
    const cartTotal = computed(() => state.cart.reduce((acc, item) => acc + item.price * item.quantity, 0))
    const shippingFee = computed(() => cartTotal.value >= 200 ? 0 : 10)
    const finalTotal = computed(() => cartTotal.value + shippingFee.value)

    // 设置商品类型动作
    const setProductType = (type) => {
        state.currentType = type
    }

    const addToCart = (product, qty = 1) => {
        const existingItem = state.cart.find(item => item.id === product.id)
        if (existingItem) {
            existingItem.quantity += qty
        } else {
            state.cart.push({ ...product, quantity: qty })
        }
        showNotification(`已将 ${product.name} 加入购物车`)
    }

    const removeFromCart = (index) => state.cart.splice(index, 1)
    
    const clearCart = () => state.cart = []

    const showNotification = (msg) => {
        state.notification = msg
        setTimeout(() => state.notification = null, 3000)
    }

    const setOrder = (order) => state.currentOrder = order

    return {
        state,
        cartCount,
        cartTotal,
        shippingFee,
        finalTotal,
        setProductType, // 导出新方法
        addToCart,
        removeFromCart,
        clearCart,
        showNotification,
        setOrder
    }
}