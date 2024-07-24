const Listing = require("../models/listing.js");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

// INDEX CODE
module.exports.index = async (req, res) => {
  let allListings = await Listing.find({});
  let searchResults = [];

  res.render("listings/showAll.ejs", { allListings, searchResults });
};

// CREATE CODE
module.exports.addNewListing = async (req, res) => {
  let response = await geocodingClient
    .forwardGeocode({
      query: req.body.Listing.location,
      limit: 1,
    })
    .send();
  console.log(response.body.features[0].geometry);

  let url = req.file.path;
  let filename = req.file.filename;
  let newList = new Listing(req.body.Listing);
  newList.owner = req.user._id;
  newList.image = { url, filename };
  newList.geometry = response.body.features[0].geometry;
  let savedListing = await newList.save();
  console.log(savedListing);
  req.flash("success", "New Listing Added");
  res.redirect("/listings");
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
  let newList = await Listing.findByIdAndUpdate(id, content);
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    newList.image = { url, filename };
    await newList.save();
  }
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
