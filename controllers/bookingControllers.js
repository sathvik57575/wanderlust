const {Booking} = require('../models/bookings')
const {Listing} = require('../models/listing')
const {User} = require('../models/user')

module.exports.getBook = async(req,res)=>{
    let {id} = req.params
    
    let thisListing = await Listing.findById(id);

    res.render('bookings/new', {thisListing})
}

module.exports.postBook = async(req,res)=>{
    let {id} = req.params
    let {start, end, paymentMethod} = req.body;

    let thisBooking = Booking.create({
        listing: id,
        user: req.user._id,
        start, 
        end,
        paymentMethod
    })

    req.flash('success', 'Booking successful')
    res.redirect(`/listings/${id}`)
}


module.exports.delete = async(req,res)=>{
    let {bookid} = req.params;

    let thisbooking = await Booking.findByIdAndDelete(bookid);
    let id = thisbooking.listing;
    req.flash('success', 'Booking cancelled')
    res.redirect(`/listings/${id}`)
}


module.exports.show = async(req,res)=>{
    let {userid} = req.params;

    let myBookings = await Booking.find({user:userid}).populate('listing');

    res.render('bookings/bookings', {myBookings});
}