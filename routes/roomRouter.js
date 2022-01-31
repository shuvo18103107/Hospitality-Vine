const express = require('express');
const Roomcontroller = require('../controllers/RoomController');
const authController = require('../controllers/authController');
const reviewRouter = require('./reviewRouter');
const router = express.Router();
router.use('/:RoomId/reviews', reviewRouter);
router
  .route('/top-5-cheap')
  .get(Roomcontroller.aliasTopRoom, Roomcontroller.getAllRooms);
router.route('/room-stats').get(Roomcontroller.getRoomStates);
router
  .route('/')
  .get(Roomcontroller.getAllRooms)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'manager'),
    Roomcontroller.createRoom
  );

router
  .route('/:id')
  .get(Roomcontroller.getRoom)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'manager'),
    Roomcontroller.uploadRoomImages,
    Roomcontroller.resizeRoomImages,
    Roomcontroller.updateRoom
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'manager'),
    Roomcontroller.deleteRoom
  );

module.exports = router;
