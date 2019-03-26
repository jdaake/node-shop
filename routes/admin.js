const express = require('express');

const adminController = require('../controllers/admin');

const isAuth = require('../middleware/is-Auth');

const router = express.Router();

// get add product
router.get('/add-product', isAuth, adminController.getAddProduct);

// get products
router.get('/products', isAuth, adminController.getProducts);

// post add product
router.post('/add-product', isAuth, adminController.postAddProduct);

// get edit product
router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);

// post edit product
router.post('/edit-product', isAuth, adminController.postEditProduct);

// delete products
router.post('/delete-product', isAuth, adminController.postDeleteProduct);

module.exports = router;