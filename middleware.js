const { listingSchemaJoi, reviewSchemaJoi } = require("./utils/joi.js");
const expressErr = require("./utils/expressErr");
const Listing = require("./models/listing");
const Review = require("./models/review");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must be logged In");
    return res.redirect("/login");
  }
  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.checkOwner = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (listing && !listing.owner._id.equals(res.locals.currUser._id)) {
    req.flash("error", "you are not allowed to change it");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

module.exports.checkAuthor = async (req, res, next) => {
  let { id, reviewId } = req.params;
  let reviews = await Review.findById(reviewId);
  if (!reviews.author._id.equals(res.locals.currUser._id)) {
    req.flash("error", "you are not the author of this review");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

module.exports.validateList = (req, res, next) => {
  let { error } = listingSchemaJoi.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new expressErr(400, errMsg);
  } else {
    next();
  }
};

module.exports.validateReview = (req, res, next) => {
  let { error } = reviewSchemaJoi.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new expressErr(400, errMsg);
  } else {
    next();
  }
};
