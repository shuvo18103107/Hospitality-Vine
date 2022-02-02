const mongoose = require('mongoose');
const Room = require('./roomModel');
const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review can not be empty!'],
    },
    rating: {
      type: Number,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    //parent referencing
    room: {
      type: mongoose.Schema.ObjectId,
      ref: 'Room',
      requied: [true, 'Review must belong to a Room'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      requied: [true, 'Review must belong to a user'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
reviewSchema.index({ room: 1, user: 1 }, { unique: true });
reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name photo',
  });
  next();
});
reviewSchema.statics.calcAverageRatings = async function (roomId) {
  const stats = await this.aggregate([
    {
      $match: { room: roomId },
    },
    {
      $group: {
        _id: '$room',
        numRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);
  // console.log(stats);
  if (stats.length > 0) {
    await Room.findByIdAndUpdate(roomId, {
      ratingsQuantity: stats[0].numRating,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    await Room.findByIdAndUpdate(roomId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
};

reviewSchema.post('save', function () {
  this.constructor.calcAverageRatings(this.room);
});
reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.reviewDoc = await this.findOne();
  next();
});

reviewSchema.post(/^findOneAnd/, async function () {
  await this.reviewDoc.constructor.calcAverageRatings(this.reviewDoc.room);
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
