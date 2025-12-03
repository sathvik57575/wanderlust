const { Listing } = require('../models/listing')
const mongoose = require('mongoose')
const multer = require('multer')
const { listingSchema } = require('../utils/schema');
const { customExpressError } = require('../utils/customExpressError');
const {Booking} = require('../models/bookings')

//mapbox-sdk
const mbxGeoCoding = require('@mapbox/mapbox-sdk/services/geocoding')
const mapToken = process.env.MAP_TOKEN
const geocodingClient = mbxGeoCoding({ accessToken: mapToken })


module.exports.showAll = async (req, res) => {
    const allListings = await Listing.find({});
    res.render('listings/home', { allListings });
}

module.exports.showOne = async (req, res, next) => {
    let { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(new customExpressError(400, 'Invalid listing ID'))
    }

    const thisListing = await Listing.findById(id).populate({ path: 'reviews', populate: { path: 'createdBy' } }).populate('owner')

    if (!thisListing) {
        return next(new customExpressError(401, 'No listing found'))
    }

    let hasbooked = null;
    //added this later for bookings
    if(req.isAuthenticated()){ //req.user
        hasbooked = await Booking.findOne({listing: id,user: req.user._id})
    }
    console.log(hasbooked);
    res.render('listings/show', { thisListing, hasbooked })
}

module.exports.getNew = (req, res) => {
    console.log(req.user);
    res.render('listings/new')
}

module.exports.postNew = async (req, res) => {
    let { listing } = req.body;

    console.log('new adding', listing);
    console.log('file info:', req.file);

    const result = listingSchema.validate(req.body);

    if (result.error) {
        const err = new customExpressError(400, result.error.details[0].message)
        err.name = result.error.name;
        throw err;
    }

    if (req.file) {
        listing.image = { url: req.file.path, filename: req.file.filename }
        //we cannot do listing.image.url = req.file.path; as listing.image doesn't exist yet
    }

    //doing this before you create the listing as geometry is required before we create the listing
    const response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
    })
    .send()
    listing.geometry = response.body.features[0].geometry;

    let thisListing = await Listing.create(listing)

    await Listing.findByIdAndUpdate(thisListing._id, { owner: req.user })

    console.log(thisListing);

    //adding this later for flash
    req.flash('success', 'new Listing created!')
    res.redirect(`/listings/${thisListing._id}`)


    // const response = await geocodingClient.forwardGeocode({
    //     query: req.body.listing.location,
    //     limit: 1
    // })
    // .send()

    // // console.log(response);
    // console.log(response.body.features);
    // console.log(response.body.features[0].geometry);
    // res.send('hi');
}

module.exports.getEdit = async (req, res) => {
    let { id } = req.params;
    let thisListing = await Listing.findById(id);

    if (!thisListing) {
        req.flash('failure', "listing doesn't exist")
        return res.redirect('/')
    }

    let originalPreview = thisListing.image.url;
    originalPreview = originalPreview.replace('upload', 'upload/h_100,w_250')

    res.render('listings/edit', { thisListing, originalPreview })
}

module.exports.putEdit = async (req, res) => {
    let { id } = req.params;
    let { listing } = req.body;

    let thisListing = await Listing.findByIdAndUpdate(id, listing)

    //we can just do this lol
    if (req.file) {
        thisListing.image.url = req.file.path;
        thisListing.image.filename = req.file.filename;
        await thisListing.save()
    }

    //adding this later for flash
    req.flash('success', 'Listing Updated!')

    res.redirect(`/listings/${thisListing._id}`)
}

module.exports.delete = async (req, res) => {
    let { id } = req.params;
    let thisListing = await Listing.findByIdAndDelete(id)

    //adding this later for flash
    req.flash('success', 'Listing Deleted!')

    res.redirect('/')
}


//added later
module.exports.filterByCategory = async (req, res) => {
    const { category } = req.params;

    if (category === "all") {
        const allListings = await Listing.find({});
        return res.render("listings/home", { allListings });
    }

    const allListings = await Listing.find({ category });

    res.render("listings/home", { allListings });
};


//added later
module.exports.search = async(req,res)=>{
    let {string} = req.query;
    if(!string || string.trim()==''){
        req.flash('failure', 'Please enter something to search')
        return res.redirect('/');
    }

   let regex = new RegExp(string.trim(), 'i');

   let allListings = await Listing.find({
    $or:[
        {category: regex},
        {country: regex},
        {location: regex}
    ]
   })

   res.render('listings/home', {allListings})
}


//added later
module.exports.showMine = async(req,res)=>{
    let owner = req.user._id;
    console.log(req.user);
    let allListings = await Listing.find({owner})

    res.render('listings/home', {allListings});
}