const User = require('./../models/userModel');
const APIFeatures = require('./../utils/apiFeatures');
const CatchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.getAllUsers = CatchAsync(async (req, res, next) => {
  // Execute Query
  const features = new APIFeatures(User.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .pages();
  const users = await features.query;

  // Send Response
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users
    }
  });
});

exports.getSingleUser = CatchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(
      new AppError(`No User found with the ID: ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  });
});

exports.addNewUser = CatchAsync(async (req, res, next) => {
  // const newUsers = new User({})
  // newUsers.save()

  const newUser = await User.create(req.body);

  res.status(201).json({
    status: 'sucess',
    data: {
      user: newUser
    }
  });
});

exports.updateUser = CatchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidator: true
  });

  if (!user) {
    return next(
      new AppError(`No User found with the ID: ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  });
});

exports.deleteUser = CatchAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) {
    return next(
      new AppError(`No User found with the ID: ${req.params.id}`, 404)
    );
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});
