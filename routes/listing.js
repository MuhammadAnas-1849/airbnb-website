const express = require("express");
const Listing = require("../models/listing.js");
const asyncWrap = require("../utils/wrapAsync");
const expressErr = require("../utils/expressErr");
const { listingSchemaJoi } = require("../utils/joi.js");
const route= express.Router();
const {isLoggedIn} = require("../middleware");

const validateList = (req, res, next) => {
  let { error } = listingSchemaJoi.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new expressErr(400, errMsg);
  } else {
    next();
  }
};


route.get("", asyncWrap(async (req, res) => {
  let allListings = await Listing.find({});
  res.render("listings/showAll.ejs", {  allListings });
}));


route.get("/new",isLoggedIn, (req, res) => {
  res.render("listings/new.ejs");
});

route.get(
  "/:id",
  asyncWrap(async (req, res) => {
    let { id } = req.params;
    let List = await Listing.findById(id).populate("reviews");
    if(!List){
          req.flash("error", "Listing Does Not Exist");
          res.redirect("/listings");
    }

    res.render("listings/showOne.ejs", { List });
  })
);

route.post(
  "",
  validateList,isLoggedIn,
  asyncWrap(async (req, res) => {
    let newList = new Listing(req.body.Listing);
    await newList.save();
    req.flash("success", "New Listing Added");
    res.redirect("/listings");
  })
);

route.get(
  "/:id/edit",isLoggedIn,
  asyncWrap(async (req, res) => {
    let { id } = req.params;
    let List = await Listing.findById(id);
    if(!List){
      req.flash("error", "Listing Does Not Exist");
      res.redirect("/listings");
}
    res.render("listings/editOne.ejs", { List });
  })
);

route.put(
  "/:id",isLoggedIn,
  asyncWrap(async (req, res) => {
    let { id } = req.params;
    let content = req.body.Listing;
    await Listing.findByIdAndUpdate(id, content);
    req.flash("success", " Listing Updated");
    res.redirect(`/listings/${id}`);
  })
);

route.delete(
  "/:id",isLoggedIn,
  asyncWrap(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", " Listing Deleted");
    res.redirect(`/listings`);
  })
);

module.exports = route;
