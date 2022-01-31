const mongoose = require('mongoose');
const slugify = require('slugify');

const roomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A room must have a name'],
      unique: true,
      trim: true,

      maxlength: [40, 'A room name must have less or equal then 40 characters'],
      minlength: [10, 'A room name must have more or equal then 10 characters'],
    },
    slug: String,
    beds: {
      type: Number,
      required: [true, 'A room must have a bed'],
    },
    roomType: {
      type: String,
      required: [true, 'A room must have a type'],
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
      set: (val) => Math.round(val * 10) / 10, 
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    costPerNight: {
      type: Number,
      required: [true, 'A room must have a price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {

          return val < this.costPerNight; 
        },
        message: 'Discount Price ({VALUE}) should be below regular price',
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A room must have a summary'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A room must have a cover image'],
    },
    images: [String],
    amenities: [String],
    childrens: {
      type: Number,
      default: null
    },
    createdAt: {
      type: Date,
      default: Date.now(), //it gives a timestamp but mongoose automatically create a good date formate
      select: false, // we hide this field from the client , client will not get this data on client req but db te insert hobe
    },
    adults : Number,
    roomSize : String,
    checkIn: String,
    checkOut: String
  },
  {

    toJSON: { virtuals: true },

    toObject: { virtuals: true },
  }
);

roomSchema.index({ costPerNight: 1, ratingsAverage: -1 }); 
roomSchema.index({ slug: 1 }); 
roomSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'room',
  localField: '_id', 
});

roomSchema.pre('save', function (next) {
  this.slug = slugify(this.name, {
    lower: true,
  });
  next(); 
});

const Room = mongoose.model('Room', roomSchema); 
module.exports = Room;
