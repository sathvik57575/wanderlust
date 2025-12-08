const {Listing} = require('../models/listing')
const mongoose = require('mongoose')
let {sampleListings} = require('./data')

const MONGO_URL = '***********'
mongoose.connect(MONGO_URL).then(()=>{
    console.log('MONGODB SUCCESSFULLY CONNECTED');
})

async function initDb() {
    //clearing the existing data
    await Listing.deleteMany({});


    //adding this later for adding an owner property
    sampleListings = sampleListings.map((obj)=>{
        obj = {
            ...obj, owner: '68fe3ad76df730dbf9c52acc'
        }
        return obj;
    })


    //adding the data
    await Listing.insertMany(sampleListings);

    console.log('data successfully initialized');
}

initDb();
