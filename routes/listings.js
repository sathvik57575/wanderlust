const express = require('express');
const {Listing} = require('../models/listing')
const mongoose = require('mongoose')
const {wrapAsync} = require('../utils/wrapAsync');
const { customExpressError } = require('../utils/customExpressError');
const {listingSchema} = require('../utils/schema');

const {Review} = require('../models/reviews')
const {reviewSchema} = require('../utils/schema');
const {isLoggedIn, isOwner} = require('../utils/authenticate') 
const listingControllers = require('../controllers/listingControllers')
const reviewControllers = require('../controllers/reviewControllers')

const multer  = require('multer')
const {cloudinary,storage} = require('../cloudConfig')

const upload  = multer({storage: storage}); //this is how we use it



const router = express.Router();


//index route, to show all listings
router.get('/', wrapAsync(listingControllers.showAll));

//show individual listing
router.get('/listings/:id', wrapAsync(listingControllers.showOne))


//create new listing
router.route('/listing/new')
.get(isLoggedIn, listingControllers.getNew)
.post(isLoggedIn, upload.single('listing[image]'), wrapAsync(listingControllers.postNew))


//edit listing
router.route('/listings/:id/edit')
.get(isLoggedIn ,wrapAsync(listingControllers.getEdit))
.put(isLoggedIn, isOwner, upload.single('listing[image]'), listingValidate, wrapAsync(listingControllers.putEdit))

//delete listing
router.get('/listings/:id/delete', isLoggedIn, isOwner, wrapAsync(listingControllers.delete))


//added later
//filter route
router.get("/listings/category/:category", wrapAsync(listingControllers.filterByCategory));


//added later
//search route
router.get('/listing/search', wrapAsync(listingControllers.search));


//added later for individual listings
router.get('/listing/mine', isLoggedIn, wrapAsync(listingControllers.showMine))


//middlware function for joi listing schema validation
function listingValidate(req,res,next){
    let result = listingSchema.validate(req.body)
    if(result.error){
        const err =  new customExpressError(400, result.error.details[0].message)
        err.name = result.error.name;
        throw err;
    }
    next()
}




// *******************************************************
//here we will create review routes, since reviews are a part of that listing they will start with /listings
router.post('/listings/:id/reviews', validateReview, wrapAsync(reviewControllers.createReview))


//route for deleting reviews
router.delete('/listings/:id/reviews/:reviewid', wrapAsync(reviewControllers.deleteReview))


//middleware for joi review validations, this is if someone tries to send reviews via postman/hoppscotch
function validateReview(req,res,next){
    let result = reviewSchema.validate(req.body)
    if(result.error){
        let err = new customExpressError(400, result.error.details[0].message)
        err.name = result.error.name;
        throw err;
    }
    next();
}



module.exports = {router}