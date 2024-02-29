const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const ExpressError = require("./utils/expressError.js");
const {listingSchema , reviewSchema} = require("./schema.js");

module.exports.isLoggedin = (req, res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error" , "You must login 1st !");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req, res ,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl ;
    }
    next();
}

module.exports.isOwner = async(req , res , next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error" , "You are not owner of  this listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validateListing= (req, res ,next)=>{
    
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400 , errMsg);
    }
    else{
        next();
    }
};

module.exports.validateReview = (req, res ,next) =>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMesg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400 , errMesg);
    }
    else{
        next();
    }
};

module.exports.isReviewAuthor = async(req , res , next)=>{
    let { id ,reviewId} = req.params;
    let review = await Review.findById(reviewId);
    console.log(review);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error" , "You are not auhor of  this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
}