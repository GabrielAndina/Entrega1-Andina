const express = require('express');
const fs = require('fs');

const router = express.Router();

// Ruta POST /api/carts/
router.post('/', async (req, res) => {
    try {
        const newCart = { id: generateId(), products: [] };
        const carts = await getCarts();
        carts.push(newCart);
        await fs.promises.writeFile('carts.json', JSON.stringify(carts, null, 2));
        res.status(201).json(newCart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Ruta GET /api/carts/:cid
router.get('/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const carts = await getCarts();
        const cart = carts.find(cart => cart.id == cartId);
        if (!cart) {
            res.status(404).json({ error: 'Cart not found' });
        } else {
            res.json(cart);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Ruta POST /api/carts/:cid/product/:pid
router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const quantity = parseInt(req.body.quantity) || 1;
        const carts = await getCarts();
        const cartIndex = carts.findIndex(cart => cart.id == cartId);
        if (cartIndex === -1) {
            res.status(404).json({ error: 'Cart not found' });
            return;
        }
        const productIndex = carts[cartIndex].products.findIndex(item => item.product == productId);
        if (productIndex === -1) {
            carts[cartIndex].products.push({ product: productId, quantity });
        } else {
            carts[cartIndex].products[productIndex].quantity += quantity;
        }
        await fs.promises.writeFile('carts.json', JSON.stringify(carts, null, 2));
        res.status(201).end();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

async function getCarts() {
    const data = await fs.promises.readFile('carts.json', 'utf-8');
    return JSON.parse(data);
}

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

module.exports = router;
