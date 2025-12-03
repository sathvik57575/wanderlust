const mongoose = require('mongoose');
const { Schema } = mongoose;

const { Review } = require('./reviews')

const listingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    image: {
        url: {
            type: String,
            default: "https://www.zdnet.com/a/img/resize/ae1d4928fa0d733fb58280d628c27bd4ed9e28c0/2019/09/05/7c148e17-3f7e-4166-b755-324799ba0c7a/atanas-malamov-tpmav6c33de-unsplash.jpg?auto=webp&width=1024",
            set: (v) => v === "" ? "https://www.zdnet.com/a/img/resize/ae1d4928fa0d733fb58280d628c27bd4ed9e28c0/2019/09/05/7c148e17-3f7e-4166-b755-324799ba0c7a/atanas-malamov-tpmav6c33de-unsplash.jpg?auto=webp&width=1024" : v
        },
        filename: {
            type: String,
            default: 'defaultImage'
        }
    },
    price: {
        type: Number,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    country: String,


    //added later
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Review'
        }
    ],


    //added this later
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },


    //added this later
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },


    //adding this later
    category: {
    type: String,
    enum: [
        "rooms",
        "iconic cities",
        "mountains",
        "castles",
        "amazing pools",
        "camping",
        "farms",
        "arctic"
    ],
    required: true
},
})


//middleware for handling deletion of reviews when a listing is deleted
listingSchema.post('findOneAndDelete', async (listing) => {
    if (listing.reviews.length) {
        for (reviewid of listing.reviews) {
            await Review.findByIdAndDelete(reviewid)
        }
    }
})


const Listing = mongoose.model('Listing', listingSchema)

module.exports = { Listing }