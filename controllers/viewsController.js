const Room = require('../models/roomModel');
// const Booking = require('../models/bookingModel');
const Review = require('../models/reviewModel');
const catchAsync = require('../utilis/catchAsync');
const AppError = require('../utilis/appError');

exports.alerts = (req,res,next)=>{
  const {alert} = req.query;
  if(alert=== 'booking')
  {
    res.locals.alert ="Your booking was successful! Please check your email for a confirmation. If your booking doesn't show up here immediatly, please come back later."
  }
  next();
}

exports.getOverview = catchAsync(async (req, res, next) => {

  const rooms = await Room.find();
  res.status(200).render('overview', {
    title: 'This is the overview page',
    rooms,
  });
});
exports.getRoom = catchAsync(async (req, res, next) => {
  const room = await Room.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    select: 'review rating user',
  });
  if (!room) {
    return next(new AppError('There is no room with that name', 404));
  }
  res.status(200).render('room', {

    title: `${room.name}`,
    room,
  });
});

exports.login =(req, res) => {
  res.status(200).render('login', {
    title: 'Login',
  });
};
exports.forgotPassword = catchAsync(async (req, res, next) => {
  res.status(200).render('forgotPass', {
    title: 'Forgot Your Password',
  });
});
exports.resetPassword = catchAsync(async (req, res, next) => {
  //url e click e token ta evabe set korci jate param diye dore pai
  const token = req.params.token;
  // console.log(`Token in resetPasswordController : ${token}`);

  res.status(200).render('resetPassword', {
    title: 'Reset Your Password',
    token,
  });
});
exports.signup = (req, res) => {
  res.status(200).render('signup', {
    title: 'Signup',
  });
};
exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Profile Settings',
  });
};

exports.getMyRooms = catchAsync(async(req,res,next)=>{
  const bookings =await Booking.find({user: req.user.id})


const roomIds = bookings.map(book => book.room)
const rooms = await Room.find({_id: {$in: roomIds}})

  res.status(200).render('overview', {

    title: 'My Booked Rooms',
    rooms
  });

})

exports.getMyReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.find({ user: req.user._id }).populate({
    path: 'room',
    select: 'imageCover name'
  });

  res.status(200).render('reviews', {
    title: 'My Reviews',
    reviews: reviews,
  });
});