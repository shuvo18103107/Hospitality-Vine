const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Room = require('./../../models/roomModel'); 
const User = require('./../../models/userModel');
const Review = require('./../../models/reviewModel');
dotenv.config({
    path: './config.env',
});
const DB = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
);

mongoose
    .connect(DB, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    })
    .then((con) => {
        console.log('DB Connection Successful');
    });
const rooms = JSON.parse(fs.readFileSync(`${__dirname}/rooms.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const reviews = JSON.parse(
    fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8')
);
//import data into database
const importData = async () => {
    try {
        await Room.create(rooms); 
        await User.create(users); 
        await Review.create(reviews); 
        console.log('Data SuccessFully Loaded');
    } catch (err) {
        console.log(err)
     }
    process.exit();
};

//Delete older data from collection in DB

const deleteData = async () => {
    try {
        await Room.deleteMany();
        await User.deleteMany();
        await Review.deleteMany();
        console.log('Data SuccessFully deleted');
    } catch (err) { }
    process.exit();
};
// node D:\Natours\dev-data\data\import-dev-data.js -- delte or --import evabe data command basis e  insert and delete korbo
if (process.argv[2] === '--import') {
    importData();
} else if (process.argv[2] === '--delete') {
    deleteData();
}
console.log(process.argv);