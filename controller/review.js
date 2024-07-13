const Listing = require("../models/listing");
const Review = require("../models/review.js");

// POST CODE
module.exports.addReview = async (req, res) => {
  let listing = await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review);
  newReview.author = req.user._id;
  console.log(req.user._id);
  listing.reviews.push(newReview);
  await listing.save();
  await newReview.save();
  req.flash("success", "New Review Added");
  res.redirect(`/listings/${listing.id}`);
};

// DELETE CODE
module.exports.deleteReview = async (req, res) => {
  let { id, reviewId } = req.params;
  await Review.findByIdAndDelete(reviewId);
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  req.flash("success", "Listing Deleted");
  res.redirect(`/listings/${id}`);
};
