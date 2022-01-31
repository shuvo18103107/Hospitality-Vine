const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Sync error handling
process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down.....');
  console.log(err.name, err.message, err);
  process.exit(1);
});
dotenv.config({
  path: './config.env',
});

const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    autoIndex: true,
    useFindAndModify: false,
  })
  .then((con) => {
    console.log('DB Connection Successful');
  });

// Server Start
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION! 💥 Shutting down.....');

  server.close(() => {
    process.exit(1);
  });
});

// process.on('SIGTERM', () => {
//   console.log('🔥 SIGTERM RECIEVED> Shutting down gracefully.');
//   server.close(() => {
//     console, log('🔥 process terminated !');
//   });
// });
