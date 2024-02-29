const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

module.exports.createReview =  async(req , res)=>{
    console.log(req.params.id);
    let listing = await Listing.findById(req.params.id);
    console.log(listing);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    console.log(newReview);
    await newReview.save();
    await listing.save();

    req.flash("success" , "New review created successfully");

    
    res.redirect(`/listings/${listing._id}`);
};

module.exports.destroyReview = async(req, res)=>{
    let {id , reviewId} = req.params;

    console.log(id , reviewId);
    await Listing.findByIdAndUpdate(id , {$pull : {reviews : reviewId}});
    await Review.findByIdAndDelete(reviewId);

    req.flash("success" , "Review deleted successfully");

    res.redirect(`/listings/${id}`);
};