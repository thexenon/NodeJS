const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const AppError = require('./utils/appError');
const myErrorHandler = require('./controllers/errorController');

const app = express();

// Middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.headers);
  next();
});

// Routes
// app.get('/api/v1/tours', getAllTours);
// app.get('/api/v1/tours/:id', getSingleTour);
// app.post('/api/v1/tours', addNewTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'Fail',
  //   message: `Error: ${req.originalUrl} is not on this server`
  // });
  // next();
  // const err = new Error(`Error: ${req.originalUrl} is not on this server`);
  // err.status = 'fail';
  // err.statusCode = 404;
  next(new AppError(`Error: ${req.originalUrl} is not on this server`, 404));
});

app.use(myErrorHandler);
module.exports = app;
