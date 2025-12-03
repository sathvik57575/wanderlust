const Joi = require('joi');
const { Listing } = require('../models/listing');
const { Review } = require('../models/reviews')

const listingSchema = Joi.object({

    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().required().min(0),
        // image: Joi.string().allow("", null)//image is not required, but we can allow "", null values. We can skip this too

        category: Joi.string().valid(
            "rooms",
            "iconic cities",
            "mountains",
            "castles",
            "amazing pools",
            "camping",
            "farms",
            "arctic"
        ).required()
    }).required()

})

let reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required()
    }).required()
})

module.exports = { listingSchema, reviewSchema }