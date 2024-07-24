const express = require("express");
const asyncWrap = require("../utils/wrapAsync");
const router = express.Router();
const { isLoggedIn, validateList, checkOwner } = require("../middleware.js");
const listingController = require("../controller/listing.js");
const { storage } = require("../cloudConfig.js");
const multer = require("multer");
const upload = multer({ storage });

// INDEX ROUTE AND CREATE ROUTE
router
  .route("")
  .get(asyncWrap(listingController.index))
  .post(
    isLoggedIn,
    upload.single("Listing[image]"),
    validateList,
    checkOwner,
    asyncWrap(listingController.addNewListing)
  );

//  NEW ROUTE
router.get("/new", isLoggedIn, listingController.newRoute);

// SHOW, UPDATE & DELETE ROUTE
router
  .route("/:id")
  .get(asyncWrap(listingController.showOneListing))
  .put(
    isLoggedIn,
    checkOwner,
    upload.single("Listing[image]"),
    asyncWrap(listingController.updateListing)
  )
  .delete(isLoggedIn, checkOwner, asyncWrap(listingController.deleteListing));

// EDIT ROUTE
router.get(
  "/:id/edit",
  isLoggedIn,
  checkOwner,
  asyncWrap(listingController.editListing)
);



module.exports = router;
