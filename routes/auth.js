const express = require('express');

const authController = require('../controllers/auth');

const router = express.Router();

// get login
router.get('/login', authController.getLogin);

// get signup
router.get('/signup', authController.getSignup);

// get reset
router.get('/reset', authController.getReset);

// post reset
router.post('/reset', authController.postReset);

// get new password
router.get('/reset/:token', authController.getNewPassword);

// post new password
router.post('/new-password', authController.postNewPassword);

// post login
router.post('/login', authController.postLogin);

// post signup
router.post('/signup', authController.postSignup);

// post logout
router.post('/logout', authController.postLogout);


module.exports = router;