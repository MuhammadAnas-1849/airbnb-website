const Listing = require("../models/listing.js");

// INDEX CODE
module.exports.index = async (req, res) => {
  let allListings = await Listing.find({});
  res.render("listings/showAll.ejs", { allListings });
};

// NEW CODE
module.exports.newRoute = (req, res) => {
  res.render("listings/new.ejs");
};

// SHOW CODE
module.exports.showOneListing = async (req, res) => {
  let { id } = req.params;
  let List = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!List) {
    req.flash("error", "Listing Does Not Exist");
    res.redirect("/listings");
  }
  res.render("listings/showOne.ejs", { List });
};

// CREATE CODE
module.exports.addNewListing = async (req, res) => {
  let newList = new Listing(req.body.Listing);
  newList.owner = req.user._id;
  await newList.save();
  req.flash("success", "New Listing Added");
  res.redirect("/listings");
};

// EDIT CODE
module.exports.editListing = async (req, res) => {
  let { id } = req.params;
  let List = await Listing.findById(id);
  if (!List) {
    req.flash("error", "Listing Does Not Exist");
    res.redirect("/listings");
  }
  res.render("listings/editOne.ejs", { List });
};

// UPDATE CODE
module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let content = req.body.Listing;
  await Listing.findByIdAndUpdate(id, content);
  req.flash("success", " Listing Updated");
  res.redirect(`/listings/${id}`);
};

// DELETE CODE
module.exports.deleteListing = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", " Listing Deleted");
  res.redirect(`/listings`);
};

