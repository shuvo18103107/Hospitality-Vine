const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Room = require('./../models/roomModel');
const User = require('./../models/userModel');
const Booking = require('./../models/bookingModel');
const catchAsync = require('./../utilis/catchAsync');
const factory = require('./../controllers/handlerFactory');
exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  const room = await Room.findById(req.params.roomID);
  // 2) Create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `${req.protocol}://${req.get('host')}/my-rooms?alert=booking`,
    cancel_url: `${req.protocol}://${req.get('host')}/room/${room.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.roomID,
    line_items: [
      {
        name: `${room.name}`,
        description: room.summary,
        images: [`${req.protocol}://${req.get('host')}/img/rooms/${room.imageCover}`],
        amount: room.costPerNight * 100,
        currency: 'usd',
        quantity: 1
      }
    ]
  });

  // 3) Create session on response
  res.status(200).json({
    status: 'success',
    session: session
  })
});

const createBookingCheckout = async session => {
  try {
    const room = session.client_reference_id;
    const user = (await User.findOne({ email: session.customer_email }))._id;
    const price = session.amount_total / 100;
    await Booking.create({
      user: user,
      room: room,
      price: price
    });
  } catch (err) {
    console.log(err);
  }
};

exports.webhookCheckout = (req, res, next) => {
  const signature = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Weekhook error: ${err.message}`)
  }

  if (event.type === 'checkout.session.completed') createBookingCheckout(event.data.object);

  res.status(200).json({
    received: true
  });
};

exports.getAllBookings = factory.getAll(Booking);
exports.createBooking = factory.createOne(Booking);
exports.getBooking = factory.getOne(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);
