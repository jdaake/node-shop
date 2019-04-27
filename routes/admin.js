const express = require('express');

const adminController = require('../controllers/admin');

const isAuth = require('../middleware/is-Auth');
const {
    check,
    body
} = require('express-validator/check');

const router = express.Router();

// get add product
router.get('/add-product', isAuth, adminController.getAddProduct);

// get products
router.get('/products', isAuth, adminController.getProducts);

// post add product
router.post('/add-product', [
    body('title', 'Invalid Title. Please choose another title.')
    // .isString()
    .isLength({
        min: 3,
        max: 140
    })
    .trim(),
    body('price', 'Invalid Price.').isFloat(),
    body('description', 'Invalid Description. Please choose another description.')
    .isLength({
        min: 5,
        max: 400
    })
    .trim()
], isAuth, adminController.postAddProduct);

// get edit product
router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);

// post edit product
router.post('/edit-product', [
        body('title', 'Invalid Title. Please choose another title.')
        // .isString()
        .isLength({
            min: 3,
            max: 140
        })
        .trim(),
        body('price', 'Invalid Price.').isFloat(),
        body('description', 'Invalid Description. Please choose another description.')
        .isLength({
            min: 5,
            max: 400
        })
        .trim()
    ],
    isAuth, adminController.postEditProduct);

// delete products
router.delete('/product/:productId', isAuth, adminController.deleteProduct);

module.exports = router;