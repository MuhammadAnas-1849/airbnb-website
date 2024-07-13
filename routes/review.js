const express = require("express");
const asyncWrap = require("../utils/wrapAsync");
const route = express.Router({ mergeParams: true });
const { validateReview, isLoggedIn, checkAuthor,saveRedirectUrl } = require("../middleware.js");
const reviewController = require("../controller/review.js");

// POST ROUTE
route.post(
  "",
  validateReview,
  isLoggedIn,
  asyncWrap(reviewController.addReview)
);

// DELETE ROUTE
route.delete(
  "/:reviewId",
  isLoggedIn,
  checkAuthor,
  asyncWrap(reviewController.deleteReview)
);

module.exports = route;
