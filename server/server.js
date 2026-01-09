const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('./db');

const app = express();
const PORT = 4542;

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

app.use(cors());
app.use(bodyParser.json());
app.use('/api/uploads', express.static(uploadDir));

function safeParse(str, fallback) {
    try { return JSON.parse(str); } catch { return fallback; }
}

// --- 商品相关接口 (保持不变) ---
app.get('/api/products', (req, res) => {
    db.all("SELECT * FROM products", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        const products = rows.map(p => ({
            ...p,
            specs: safeParse(p.specs, []),
            detailImages: safeParse(p.detailImages, []),
            shippingTag: p.shippingTag || 'default',
            shippingCost: p.shippingCost || 0
        }));
        res.json(products);
    });
});

app.post('/api/upload', upload.single('file'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    res.json({ url: `/api/uploads/${req.file.filename}` });
});

app.post('/api/products', (req, res) => {
    const { name, price, category, typeId, stock, image, desc, specs, detailText, detailImages, shippingTag, shippingCost } = req.body;
    const sql = `INSERT INTO products (name, price, category, typeId, stock, image, desc, specs, detailText, detailImages, shippingTag, shippingCost) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const params = [name, price, category, typeId, stock, image, desc, JSON.stringify(specs||[]), detailText||'', JSON.stringify(detailImages||[]), shippingTag||'default', shippingCost||0];
    db.run(sql, params, function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID, ...req.body });
    });
});

app.put('/api/products/:id', (req, res) => {
    const { name, price, category, typeId, stock, image, desc, specs, detailText, detailImages, shippingTag, shippingCost } = req.body;
    const sql = `UPDATE products SET name=?, price=?, category=?, typeId=?, stock=?, image=?, desc=?, specs=?, detailText=?, detailImages=?, shippingTag=?, shippingCost=? WHERE id=?`;
    const params = [name, price, category, typeId, stock, image, desc, JSON.stringify(specs||[]), detailText||'', JSON.stringify(detailImages||[]), shippingTag||'default', shippingCost||0, req.params.id];
    db.run(sql, params, function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Updated', changes: this.changes });
    });
});

app.delete('/api/products/:id', (req, res) => {
    db.run("DELETE FROM products WHERE id = ?", req.params.id, function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Deleted', changes: this.changes });
    });
});

// --- 订单管理核心接口 ---

// 1. 获取订单列表 (支持状态过滤)
app.get('/api/orders', (req, res) => {
    const status = req.query.status;
    let sql = "SELECT * FROM orders ORDER BY created_at DESC";
    let params = [];
    
    if (status && status !== 'all') {
        sql = "SELECT * FROM orders WHERE status = ? ORDER BY created_at DESC";
        params = [status];
    }

    db.all(sql, params, (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        const orders = rows.map(o => ({
            ...o,
            items: safeParse(o.items, []),
            contact: { // 组装回前端习惯的结构
                name: o.contactName,
                phone: o.contactPhone,
                email: o.contactEmail,
                province: o.province,
                city: o.city,
                district: o.district,
                addressDetail: o.addressDetail
            }
        }));
        res.json(orders);
    });
});

// 2. 创建订单 (锁库存)
app.post('/api/orders', (req, res) => {
    const { id, items, contact, total } = req.body;
    
    // 检查库存
    const checkStockPromises = items.map(item => {
        return new Promise((resolve, reject) => {
            db.get("SELECT stock FROM products WHERE id = ?", [item.id], (err, row) => {
                if (err) reject(err);
                else if (!row || row.stock < item.quantity) reject(new Error(`商品 ${item.name} 库存不足`));
                else resolve();
            });
        });
    });

    Promise.all(checkStockPromises)
        .then(() => {
            // 扣减库存
            items.forEach(item => {
                db.run("UPDATE products SET stock = stock - ? WHERE id = ?", [item.quantity, item.id]);
            });

            // 插入订单 (展开地址信息)
            const sql = `INSERT INTO orders 
                (id, total, items, contactName, contactPhone, contactEmail, province, city, district, addressDetail, status) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            
            const params = [
                id, total, JSON.stringify(items),
                contact.name, contact.phone, contact.email,
                contact.province, contact.city, contact.district, contact.address, 
                1 // 状态1: 待付款
            ];

            db.run(sql, params, function(err) {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ error: 'Order creation failed' });
                }
                res.json({ success: true, orderId: id });
            });
        })
        .catch(err => {
            res.status(400).json({ error: err.message });
        });
});

// 3. 更新订单状态 (包含库存回滚逻辑)
app.put('/api/orders/:id/status', (req, res) => {
    const { status, trackingCompany, trackingNo } = req.body; // status: 0=取消, 2=已支付, 3=已发货
    const orderId = req.params.id;

    // 获取订单信息用于库存回滚
    db.get("SELECT status, items FROM orders WHERE id = ?", [orderId], (err, order) => {
        if (err || !order) return res.status(404).json({ error: 'Order not found' });

        const oldStatus = order.status;
        const items = safeParse(order.items, []);

        // 如果是取消订单 (status = 0)，且之前不是取消状态，则回滚库存
        if (status == 0 && oldStatus != 0) {
            console.log(`Cancelling order ${orderId}, restoring stock...`);
            items.forEach(item => {
                db.run("UPDATE products SET stock = stock + ? WHERE id = ?", [item.quantity, item.id]);
            });
        }

        // 更新状态和物流信息
        let sql = "UPDATE orders SET status = ?";
        let params = [status];

        if (trackingCompany && trackingNo) {
            sql += ", trackingCompany = ?, trackingNo = ?";
            params.push(trackingCompany, trackingNo);
        }

        sql += " WHERE id = ?";
        params.push(orderId);

        db.run(sql, params, function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ success: true, status: status });
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});