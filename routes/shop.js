const express = require('express');

const shopController = require('../controllers/shop');

const router = express.Router();

// get product index
router.get('/', shopController.getIndex);

// get all products
router.get('/products', shopController.getProducts);

// get product by id
router.get('/products/:productId', shopController.getProduct);

// get cart
router.get('/cart', shopController.getCart);

// post cart
router.post('/cart', shopController.postCart);

// delete cart item
router.post('/cart-delete-item', shopController.postCartDeleteProduct);

// post order
router.post('/create-order', shopController.postOrder);

// get orders
router.get('/orders', shopController.getOrders);

module.exports = router;