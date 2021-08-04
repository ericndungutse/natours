const express = require('express');
const viewsController = require('./../controllers/viewsController');
const { isLoggedIn, protect } = require('./../controllers/authController');

const bookingController = require('../controllers/bookingController');

const router = express.Router();

router.get(
  '/',
  bookingController.createBookingChekout,
  isLoggedIn,
  viewsController.getOverview
);

router.get('/tour/:slug', isLoggedIn, viewsController.getTour);

router.get('/login', isLoggedIn, viewsController.getLoginForm);

router.get('/me', protect, viewsController.getAccount);

router.get('/my-tours', protect, viewsController.getMyTours);

module.exports = router;
