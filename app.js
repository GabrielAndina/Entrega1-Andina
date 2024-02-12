const express = require('express');
const productsRouter = require('./api/products');
const cartsRouter = require('./api/carts');

const app = express();
const PORT = 8080;

app.use(express.json());

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`);
});
