const multer = require('multer');
const sharp = require('sharp');
const Room = require('../models/roomModel');
const catchAsync = require('../utilis/catchAsync');
const factory = require('./handlerFactory');
const AppError = require('../utilis/appError');

const multerStorage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
  
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadRoomImages = upload.fields([
    {
        name: 'imageCover',
        maxCount: 1
    },
    {
        name : 'images', 
        maxCount: 3

    }
])


exports.resizeRoomImages = catchAsync(async(req, res, next) => {
    // console.log(req.files);
    if (!req.files.imageCover || !req.files.images) return next();
    req.body.imageCover= `room-${req.params.id?req.params.id:'image'}-${Date.now()}-cover.jpeg`
   await sharp( req.files.imageCover[0].buffer) 
      .resize(2000, 1333) 
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`public/img/rooms/${req.body.imageCover}`);
    req.body.images = [];
  
   await Promise.all(req.files.images.map(async(file,index)=>{
        const filename = `room-${req.params.id?req.params.id:'image'}-${Date.now()}-${index+1}.jpeg`;
        await sharp(file.buffer) 
        .resize(2000, 1333) 
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/rooms/${filename}`);
 
        req.body.images.push(filename);

        
    }))
    next();
  });

exports.aliasTopRoom = (req, res, next) => {

    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,costPerNight';
    req.query.fields = 'name,costPerNight,ratingsAverage,summary';
    next();
};

exports.getAllRooms = factory.getAll(Room);
exports.getRoom = factory.getOne(Room, { path: 'reviews' });
exports.createRoom = factory.createOne(Room);
exports.updateRoom = factory.updateOne(Room);
exports.deleteRoom = factory.deleteOne(Room);
exports.getRoomStates = catchAsync(async (req, res, next) => {
    const stats = await Room.aggregate([

        {
           
            $match: { ratingsAverage: { $gte: 4.5 } },
        },
        {
           
            $group: {
               
                _id: '$roomType',
                numRooms: { $sum: 1 },
                numRatings: { $sum: '$ratingsQuantity' },
                avgRating: { $avg: '$ratingsAverage' },
                avgPrice: { $avg: '$costPerNight' },
                minPrice: { $min: '$costPerNight' },
                maxPrice: { $max: '$costPerNight' },
            },
        },
    ]);
    res.status(200).json({
        status: 'success',
        data: {
            stats,
        },
    });
});

