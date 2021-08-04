const Tour = require('./../models/tourModel');
const Booking = require('./../models/bookingModel');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.getOverview = catchAsync(async (req, res, next) => {
  // 1) Get tour data from collection
  const tours = await Tour.find();

  // 2) Build template

  // 3) Render that template using tour data from 1
  res.status(200).render('overview', {
    title: 'All tours',
    tours,
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    select: 'review rating user',
  });

  if (!tour) {
    return next(new AppError('Tour not found!', 404));
  }

  res.status(200).render('tour', {
    title: `${tour.name} Tour`,
    tour,
  });
});

exports.getLoginForm = (req, res, next) => {
  res.status(200).render('login', {
    title: 'Login in into your account.',
  });
};

exports.getAccount = (req, res, next) => {
  res.status(200).render('account', {
    title: req.user.name,
  });
};

exports.getMyTours = catchAsync(async (req, res, next) => {
  // 1) Find All Bookings
  const bookings = await Booking.find({ user: req.user._id });

  // 2) Find Tours With the Returned IDs
  const tourIds = bookings.map((el) => el.tour._id);

  const tourPromises = tourIds.map(async (el) => {
    return await Tour.findById(el);
  });

  // Alternative Find(_id: {$in: arrayOfIds})

  const tours = await Promise.all(tourPromises);

  res.status(200).render('overview', {
    title: 'My Tours',
    tours,
  });
});
