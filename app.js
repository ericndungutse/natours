const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errController');

// ROUTERS
const tourRouter = require('./routes/tour.Routes');
const userRouter = require('./routes/user.Routes');
const reviewRouter = require('./routes/review.Routes');
const viewRouter = require('./routes/view.routes');
const bookingRouter = require('./routes/booking.Routes');

// Start Express Application
const app = express();

// Template engine set up
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Serve Static Files
app.use(express.static(path.join(__dirname, 'public')));

// 1) GLOBAL MIDDLEWARE

// Setting up Security HTTP Headers
app.use(helmet());

// Dev Logging
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// Rate Limiter
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many request from this IP, Please try again in an hour!',
});
app.use('/api', limiter);

// Add data to the req body property
app.use(
  express.json({
    limit: '10kb',
  })
);
app.use(cookieParser());

// DATA SANITIZATION
// Data sanitzation against NoSQL query injection
// This Looks at body, query String and req.params and filter out dollar signs
app.use(mongoSanitize());

// Data sanitization against XSS
// Clean user input from malcious html code by converting HTML symbals
app.use(xss());

// Prevent Parameter Pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'price',
      'maxGroupSize',
      'ratingsQuantity',
      'ratingsAverage',
      'difficulty',
    ],
  })
);

// ROUTES
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
