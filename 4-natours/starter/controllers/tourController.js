const Tour = require('./../models/tourModel');
const APIFeatures = require('./../utils/apiFeatures');
const CatchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.aliasTopTours = CatchAsync(async (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAgverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
});

exports.getAllTours = CatchAsync(async (req, res, next) => {
  // Execute Query
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .pages();
  const tours = await features.query;

  // Send Response
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours
    }
  });
});

exports.getSingleTour = CatchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);
  if (!tour) {
    return next(
      new AppError(`No Tour found with the ID: ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour
    }
  });
});

exports.addNewTour = CatchAsync(async (req, res, next) => {
  // const newTours = new Tour({})
  // newTours.save()

  const newTour = await Tour.create(req.body);

  res.status(201).json({
    status: 'sucess',
    data: {
      tour: newTour
    }
  });
});

exports.updateTour = CatchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidator: true
  });

  if (!tour) {
    return next(
      new AppError(`No Tour found with the ID: ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour
    }
  });
});

exports.deleteTour = CatchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndDelete(req.params.id);

  if (!tour) {
    return next(
      new AppError(`No Tour found with the ID: ${req.params.id}`, 404)
    );
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.getTourStats = CatchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 1.0 } }
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' }
      }
    },
    {
      $sort: { avgPrice: 1 }
    }
  ]);

  res.status(200).json({
    status: 'success',
    data: stats
  });
});

exports.getMonthlyPlan = CatchAsync(async (req, res, next) => {
  const year = req.params.year * 1;
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates'
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`)
        }
      }
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStats: { $sum: 1 },
        tours: { $push: '$name' }
      }
    },
    {
      $addFields: { month: '$_id' }
    },
    {
      $project: {
        _id: 0
      }
    },
    {
      $sort: {
        numTourStats: -1,
        month: -1
      }
    },
    {
      $limit: 12
    }
  ]);

  res.status(200).json({
    status: 'success',
    data: plan
  });
});
