const {Listing} = require('../models/listing')
const {Booking} = require('../models/bookings')

//updated isloggedIn middleware
const isLoggedIn = function(req,res,next){
    //when we are not loggedIn, we want to remember our current path, so once we login we should redirect there only 
    if(!req.isAuthenticated()){
        
        req.session.remember = req.originalUrl;

        req.flash('failure', `you must be logged in to do this action`)
        return res.redirect('/user/login')
    }
    next();
}



const isOwner = async (req,res,next)=>{
    let {id} = req.params;
    let thisListing1 = await Listing.findById(id);
    if(!thisListing1.owner.equals(req.user._id)){
        req.flash('error', "you don't have permission to do this operation")
        return res.redirect(`/listings/${thisListing1._id}`)
    }
    next();
}


const canBook = async(req,res, next)=>{
    let {id} = req.params;
    let thisListing = await Listing.findById(id);

    if(thisListing.owner.equals(req.user._id)){
        req.flash('failure', 'cannot book your own listing')
        return res.redirect(`/listings/${id}`);
    }
    next()
}

const canCancel = async(req,res,next) =>{
    let {bookid} = req.params;
    let booking = await Booking.findById(bookid);

    if(!booking.user.equals(req.user._id)){
        req.flash('failure', 'cannot cancel this listing')
        return res.redirect(`/listings/${booking.listing}`);
    }
    next()
}


module.exports = {isLoggedIn, isOwner, canBook, canCancel}