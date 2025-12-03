let {Review} = require('../models/reviews')
let {Listing} = require('../models/listing')
const { customExpressError } = require('../utils/customExpressError');

module.exports.createReview = async (req,res)=>{
    let {id} = req.params;
    let {review} = req.body;
    
    if(!req.user){
        req.flash('error', 'cannot create comment')
        return res.redirect(`/listings/${id}`)
    }


    let thisReview = await Review.create(review);

    let thisListing = await Listing.findByIdAndUpdate(id, {$push:{reviews: thisReview._id}});

    //adding this later for authorization
    await Review.findByIdAndUpdate(thisReview._id, {createdBy: req.user})

    //adding this later for flash
    req.flash('success', 'new Review Added!')

    res.redirect(`/listings/${thisListing._id}`)

}


module.exports.deleteReview = async (req,res)=>{
    let{id, reviewid} = req.params;

    //adding this later for authorization
    let thisReview1 = await Review.findById(reviewid);
    if(!req.user || !thisReview1.createdBy.equals(req.user._id)){
        req.flash('error', "you don't have permission to delete this review")
        return res.redirect(`/listings/${id}`)
    }

    let thisListing = await Listing.findByIdAndUpdate(id, {$pull:{reviews: reviewid}});

    let thisReview = await Review.findByIdAndDelete(reviewid)

    //adding this later for flash
    req.flash('success', 'Review Deleted!')

    res.redirect(`/listings/${id}`);
}