const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');
// const APIFeatures = require('./../utils/apiFeatures');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

// Protected User Controls
exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword.',
        400
      )
    );
  }

  // 2) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(req.body, 'name', 'email');

  // 3) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null
  });
});

// Global User Controls
exports.getAllUsers = factory.getAll(User);
exports.getSingleUser = factory.getOne(User);
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);

exports.addNewUser = catchAsync(async (req, res, next) => {
  res.status(201).json({
    status: 'error',
    message: 'This route is not defined. Use /signup instead'
  });
});

// exports.getAllUsers = catchAsync(async (req, res, next) => {
//   // Execute Query
//   const features = new APIFeatures(User.find(), req.query)
//     .filter()
//     .sort()
//     .limitFields()
//     .pages();
//   const users = await features.query;

//   // Send Response
//   res.status(200).json({
//     status: 'success',
//     results: users.length,
//     data: {
//       users
//     }
//   });
// });

// exports.getSingleUser = catchAsync(async (req, res, next) => {
//   const user = await User.findById(req.params.id);
//   if (!user) {
//     return next(
//       new AppError(`No User found with the ID: ${req.params.id}`, 404)
//     );
//   }

//   res.status(200).json({
//     status: 'success',
//     data: {
//       user
//     }
//   });
// });
// exports.updateUser = catchAsync(async (req, res, next) => {
//   const user = await User.findByIdAndUpdate(req.params.id, req.body, {
//     new: true,
//     runValidator: true
//   });

//   if (!user) {
//     return next(
//       new AppError(`No User found with the ID: ${req.params.id}`, 404)
//     );
//   }

//   res.status(200).json({
//     status: 'success',
//     data: {
//       user
//     }
//   });
// });

// exports.deleteUser = catchAsync(async (req, res, next) => {
//   const user = await User.findByIdAndDelete(req.params.id);

//   if (!user) {
//     return next(
//       new AppError(`No User found with the ID: ${req.params.id}`, 404)
//     );
//   }

//   res.status(204).json({
//     status: 'success',
//     data: null
//   });
// });
