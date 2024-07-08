
const express = require("express");
const Listing = require("../models/listing");
const asyncWrap = require("../utils/wrapAsync");
const expressErr = require("../utils/expressErr");
const Review = require("../models/review.js");
const { reviewSchemaJoi } = require("../utils/joi.js");
const route= express.Router({mergeParams:true});

const validateReview = (req, res, next) => {
    let { error } = reviewSchemaJoi.validate(req.body);
    if (error) {
      let errMsg = error.details.map((el) => el.message).join(",");
      throw new expressErr(400, errMsg);
    } else {
      next();
    }
  };

  
  route.post(
    "",
    validateReview,
    asyncWrap(async (req, res) => {
      let listing = await Listing.findById(req.params.id);
      let newReview = new Review(req.body.review);
      listing.reviews.push(newReview);
      await listing.save();
      await newReview.save();
      req.flash("success", "New Review Added");
      res.redirect(`/listings/${listing.id}`);
    })
  );
  
  route.delete(
    "/:reviewId",
    asyncWrap(async (req, res) => {
      let { id, reviewId } = req.params;
      await Review.findByIdAndDelete(reviewId);
      await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
      req.flash("success", "Listing Deleted");
      res.redirect(`/listings/${id}`);
    })
  );
  
  module.exports = route;
