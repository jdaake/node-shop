const express = require('express');

const shopController = require('../controllers/shop');

const isAuth = require('../middleware/is-Auth');

const router = express.Router();

// get product index
router.get('/', shopController.getIndex);

// get all products
router.get('/products', shopController.getProducts);

// get product by id
router.get('/products/:productId', isAuth, shopController.getProduct);

// get cart
router.get('/cart', isAuth, shopController.getCart);

// post cart
router.post('/cart', isAuth, shopController.postCart);

// delete cart item
router.post('/cart-delete-item', isAuth, shopController.postCartDeleteProduct);

// post order
router.post('/create-order', isAuth, shopController.postOrder);

// get orders
router.get('/orders', isAuth, shopController.getOrders);

// get invoices
router.get('/orders/:orderId', isAuth, shopController.getInvoice);

module.exports = router;