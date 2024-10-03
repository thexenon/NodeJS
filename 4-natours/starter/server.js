const dotenv = require('dotenv');
const mongoose = require('mongoose');
const app = require('./app');
// const TourModel = require('./models/tourModel');

process.on('uncaughtException', err => {
  console.log('Uncaught Exception Error');
  console.log(err.name);
  console.log(err.message);
});

dotenv.config({ path: './config.env' });

const port = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGODB_LOCALDB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('Database Connected');
  });

// const testTour = new TourModel({
//   name: 'Gregory',
//   rating: 4.99,
//   price: 497
// });

// testTour.save().then(doc => {
//     console.log(doc);
//   }).catch(err => {
//     console.log(err.message);
//   });

const server = app.listen(port, () => {
  console.log(`App running on Port: ${port}...`);
  // console.log(`${process.env.MONGODB_LOCALDB}`);
});

process.on('unhandledRejection', err => {
  console.log('Unhandled Rejection Error');
  console.log(err.name);
  console.log(err.message);
  server.close(() => {
    process.exit(1);
  });
});
