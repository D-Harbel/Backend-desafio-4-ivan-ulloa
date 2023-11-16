const express = require('express');
const router = express.Router();
const CartManager = require('../classes/CartManager');
const ProductManager = require('../classes/ProductManager');

module.exports = function (io) {
    const cm = new CartManager("./JSON/carrito.json");
    const pm = new ProductManager("./JSON/productos.json");

    router.post('/', (req, res) => {
        let cart = cm.createCart()
        res.status(201).json({ cart })
    })

    router.get('/:cid', (req, res) => {
        let cid = req.params.cid

        let cart = cm.getCartById(cid);
        if (cart) {
            res.status(200).json({ cart })
        } else {
            res.status(404).json({ error: 'Carrito no encontrado' })
        }
    })

    router.post('/:cid/product/:pid', (req, res) => {
        let cid = req.params.cid
        let pid = req.params.pid
        let quantity = parseInt(req.body.quantity)

        if (isNaN(quantity)) {
            return res.status(400).json({ error: 'La cantidad debe ser un número entero' })
        }

        cm.addProductCart(cid, pid, quantity)

        const products = pm.getProducts();
        io.emit('updateProducts', products);

        res.status(201).json({ message: 'Producto agregado al carrito' })
    })

    return router;
}
