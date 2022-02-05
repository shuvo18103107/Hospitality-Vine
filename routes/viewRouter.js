const express = require('express');
const router = express.Router();
const viewController = require('../controllers/viewsController')
const authController = require('../controllers/authController')
const bookingController = require('../controllers/bookingController')

router.use(viewController.alerts) 

router.get('/',authController.isLoggedIn, viewController.getOverview)
router.get('/room/:slug',authController.isLoggedIn, viewController.getRoom)
router.get('/signup',authController.isLoggedIn,viewController.signup)
router.get('/login', authController.isLoggedIn,viewController.login)
router.get('/me', authController.protect, viewController.getAccount)
router.get('/my-rooms', authController.protect, viewController.getMyRooms)
router.get('/forgotPass', viewController.forgotPassword)
router.get('/resetPassword/:token', viewController.resetPassword)
router.get('/my-reviews', authController.protect, viewController.getMyReviews);
module.exports = router

//user loggedin kina check korbo isloggedin e , jodi na thake error dekhabo na next middelware e jabe