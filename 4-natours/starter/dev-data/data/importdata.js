const fs = require('fs');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Tour = require('./../../models/tourModel');
const User = require('./../../models/userModel');
const Review = require('./../../models/reviewModel');

dotenv.config({ path: './config.env' });

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

// Reading Tour file
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));
// Reading User file
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
// Reading Review file
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8')
);

// Import All Data
const importAllData = async () => {
  try {
    await Tour.create(tours);
    await User.create(users, { validateBeforeSave: false });
    await Review.create(reviews);
    console.log('Data Loaded');
  } catch (err) {
    console.log(err.message);
  }
  process.exit();
};

// Import Tour Data
const importTourData = async () => {
  try {
    await Tour.create(tours);
    console.log('Data Loaded');
  } catch (err) {
    console.log(err.message);
  }
  process.exit();
};

// Import User Data
const importUserData = async () => {
  try {
    await User.create(users);
    console.log('Data Loaded');
  } catch (err) {
    console.log(err.message);
  }
  process.exit();
};

// Delete All Data
const deleteAllData = async () => {
  try {
    await Tour.deleteMany({});
    await User.deleteMany({});
    await Review.deleteMany({});
    console.log('Data Deleted');
  } catch (err) {
    console.log(err.message);
  }
  process.exit();
};

// Delete Tour Data
const deleteTourData = async () => {
  try {
    await Tour.deleteMany({});
    console.log('Data Deleted');
  } catch (err) {
    console.log(err.message);
  }
  process.exit();
};

// Delete User Data
const deleteUserData = async () => {
  try {
    await User.deleteMany({});
    console.log('Data Deleted');
  } catch (err) {
    console.log(err.message);
  }
  process.exit();
};

if (process.argv[2] === '--importA') {
  importAllData();
} else if (process.argv[2] === '--deleteA') {
  deleteAllData();
} else if (process.argv[2] === '--importT') {
  importTourData();
} else if (process.argv[2] === '--deleteT') {
  deleteTourData();
} else if (process.argv[2] === '--importU') {
  importUserData();
} else if (process.argv[2] === '--deleteU') {
  deleteUserData();
}

console.log(process.argv);
