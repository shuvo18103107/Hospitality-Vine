const express = require('express');
const router = express.Router();
const viewController = require('../controllers/viewsController')
const authController = require('../controllers/authController')

router.get('/',authController.isLoggedIn, viewController.getOverview)
router.get('/room/:slug',authController.isLoggedIn,viewController.getRoom)
router.get('/signup',authController.isLoggedIn, viewController.getSignupForm)
router.get('/login',authController.isLoggedIn, viewController.getLoginForm)
router.get('/me', authController.protect, viewController.getAccount)
module.exports = router