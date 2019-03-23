const express = require('express');

const authController = require('../controllers/auth');

const router = express.Router();

// get login
router.get('/login', authController.getLogin);

// post login
router.post('/login', authController.postLogin);

router.post('/logout', authController.postLogout);


module.exports = router;