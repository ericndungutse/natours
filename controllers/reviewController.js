const Review = require('./../models/reviewModel');
const factory = require('./handlerFactory');
const AppError = require('./../utils/appError');

exports.setTourUserIds = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user._id;

  next();
};

exports.checkUser = async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(
      new AppError('Review you are trying to delete does not exist.', 404)
    );
  }

  if (
    JSON.stringify(req.user._id) !== JSON.stringify(review.user._id) &&
    req.user.role !== 'admin'
  ) {
    return next(
      new AppError(
        'Access denied! You cannot update or delete a review you did not make',
        403
      )
    );
  }

  next();
};

exports.getAllReviews = factory.getAll(Review);
exports.getReview = factory.getOne(Review);
exports.createReview = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);
