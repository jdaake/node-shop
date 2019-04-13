const express = require('express');

const {
    check,
    body
} = require('express-validator/check');

const User = require('../models/user');

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
router.post('/login',
    [
        check('email')
        .isEmail()
        .withMessage('Please enter a valid email address')
        .normalizeEmail(),
        body('password', 'Password needs to be valid')
        .isLength({
            min: 8
        })
        .isAlphanumeric()
        .trim()
    ],
    authController.postLogin);

// post signup
router.post('/signup',
    [
        check('email')
        .isEmail()
        .withMessage('Please enter a valid email address.')
        .custom((value, {
            req
        }) => {
            return User.findOne({
                    email: value
                })
                .then(userDoc => {
                    if (userDoc) {
                        return Promise.reject('Email address already in use.');
                    }
                });
        })
        .normalizeEmail(),
        check('password', 'Password must be at least 8 characters and can only contain letters and numbers.')
        .isLength({
            min: 8
        })
        .trim()
        .isAlphanumeric(),
        body('confirmPassword')
        .trim()
        .custom((value, {
            req
        }) => {
            if (value !== req.body.password) {
                throw new Error('Passwords do not match. Please try again.');
            }
            return true;
        })
    ],
    authController.postSignup);

// post logout
router.post('/logout', authController.postLogout);


module.exports = router;