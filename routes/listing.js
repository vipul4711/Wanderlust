const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedin , isOwner , validateListing} = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer  = require('multer');
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

router
    .route("/")
    .get(wrapAsync (listingController.index))
    .post(
        isLoggedin, 
        upload.single("listing[image]"),
        validateListing,
        wrapAsync(listingController.createListings)
    );

//New Route
router.get("/new" ,isLoggedin, wrapAsync(listingController.renderNewForm));    

router
    .route("/:id")
    .get(wrapAsync(listingController.showListings))
    .put(isLoggedin,upload.single("listing[image]"), validateListing , wrapAsync(listingController.updateListings))
    .delete(isLoggedin,isOwner, wrapAsync(listingController.destroyListings)
);


//Edit Route
router.get("/:id/edit" ,isLoggedin,isOwner, wrapAsync(listingController.renderEditForm));

module.exports = router;