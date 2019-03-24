const express = require('express');

const authController = require('../controllers/auth');

const router = express.Router();

// get login
router.get('/login', authController.getLogin);

// get signup
router.get('/signup', authController.getSignup);

// post login
router.post('/login', authController.postLogin);

// post signup
router.post('/signup', authController.postSignup);

// post logout
router.post('/logout', authController.postLogout);

module.exports = router;