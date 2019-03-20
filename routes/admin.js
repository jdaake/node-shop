const express = require('express');

const adminController = require('../controllers/admin');

const router = express.Router();

// get add product
router.get('/add-product', adminController.getAddProduct);

// get products
router.get('/products', adminController.getProducts);

// post add product
router.post('/add-product', adminController.postAddProduct);

// get edit product
router.get('/edit-product/:productId', adminController.getEditProduct);

// post edit product
router.post('/edit-product', adminController.postEditProduct);

// delete products
router.post('/delete-product', adminController.postDeleteProduct);

module.exports = router;