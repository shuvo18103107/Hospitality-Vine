const express = require('express');
const roomcontroller = require('../controllers/roomController');
const authController = require('../controllers/authController');
const reviewRouter = require('./reviewRouter');
const router = express.Router();
router.use('/:roomId/reviews', reviewRouter);
router
  .route('/top-5-cheap')
  .get(roomcontroller.aliasToproom, roomcontroller.getAllrooms);
router.route('/room-stats').get(roomcontroller.getroomStates);
router
  .route('/')
  .get(roomcontroller.getAllrooms)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'manager'),
    roomcontroller.createroom
  );

router
  .route('/:id')
  .get(roomcontroller.getroom)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'manager'),
    roomcontroller.uploadroomImages,
    roomcontroller.resizeroomImages,
    roomcontroller.updateroom
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'manager'),
    roomcontroller.deleteroom
  );

module.exports = router;
