const express = require('express');
const fs = require('fs');

const router = express.Router();

// Ruta raíz GET /api/products/
router.get('/', async (req, res) => {
    try {
        const limit = req.query.limit || null;
        const products = await getProducts(limit);
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Ruta GET /api/products/:pid
router.get('/:pid', async (req, res) => {
    try {
        const productId = req.params.pid;
        const product = await getProductById(productId);
        if (!product) {
            res.status(404).json({ error: 'Product not found' });
        } else {
            res.json(product);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Ruta POST /api/products/
router.post('/', async (req, res) => {
    try {
        const newProduct = req.body;
        const product = await addProduct(newProduct);
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Ruta PUT /api/products/:pid
router.put('/:pid', async (req, res) => {
    try {
        const productId = req.params.pid;
        const updatedFields = req.body;
        const product = await updateProduct(productId, updatedFields);
        if (!product) {
            res.status(404).json({ error: 'Product not found' });
        } else {
            res.json(product);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Ruta DELETE /api/products/:pid
router.delete('/:pid', async (req, res) => {
    try {
        const productId = req.params.pid;
        await deleteProduct(productId);
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

async function getProducts(limit) {
    const data = await fs.promises.readFile('productos.json', 'utf-8');
    const products = JSON.parse(data);
    if (limit) {
        return products.slice(0, limit);
    }
    return products;
}

async function getProductById(id) {
    const data = await fs.promises.readFile('productos.json', 'utf-8');
    const products = JSON.parse(data);
    return products.find(product => product.id == id);
}

async function addProduct(product) {
    const data = await fs.promises.readFile('productos.json', 'utf-8');
    const products = JSON.parse(data);
    const newProduct = { id: generateId(products), ...product };
    products.push(newProduct);
    await fs.promises.writeFile('productos.json', JSON.stringify(products, null, 2));
    return newProduct;
}

async function updateProduct(id, updatedFields) {
    const data = await fs.promises.readFile('productos.json', 'utf-8');
    let products = JSON.parse(data);
    const index = products.findIndex(product => product.id == id);
    if (index !== -1) {
        products[index] = { ...products[index], ...updatedFields };
        await fs.promises.writeFile('productos.json', JSON.stringify(products, null, 2));
        return products[index];
    }
    return null;
}

async function deleteProduct(id) {
    const data = await fs.promises.readFile('productos.json', 'utf-8');
    let products = JSON.parse(data);
    products = products.filter(product => product.id != id);
    await fs.promises.writeFile('productos.json', JSON.stringify(products, null, 2));
}

function generateId(products) {
    let id = 1;
    while (products.some(product => product.id == id)) {
        id++;
    }
    return id;
}

module.exports = router;
