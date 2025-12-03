if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const mongoose = require('mongoose');
const path = require('path')
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const { customExpressError } = require('./utils/customExpressError')

const { router: listingRoutes } = require('./routes/listings');
const { router: userRoutes } = require('./routes/users');
const { router: bookingRoutes } = require('./routes/bookings');


const session = require('express-session')
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require('passport');
const localStrategy = require('passport-local');
const { User } = require('./models/user');

const app = express();
const PORT = process.env.PORT;

const MONGO_URL = process.env.MONGO_ATLAS_URL
mongoose.connect(MONGO_URL).then(() => {
    console.log('MONGODB SUCCESSFULLY CONNECTED');
})

app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))
app.use('/public', express.static(path.join(__dirname, 'public')))
app.use(methodOverride('_method'))
app.engine('ejs', ejsMate) //this is how you use ejs-mate


//adding this later, for online connect-mongo session store
const store = MongoStore.create({
    mongoUrl: process.env.MONGO_ATLAS_URL,
    crypto: {
        secret: process.env.SECRET
    },
    touchAfter: 24 * 3600
})
store.on('error', (err) => {
    console.log('error in mongo session store', err);
})

//using express-sessions and flash
app.use(session({
    store: store,
    secret: process.env.SECRET,
    saveUninitialized: true,
    resave: false,
    cookie: {
        expires: Date.now() + 1 * 24 * 3600 * 1000,
        maxAge: 1 * 24 * 3600 * 1000,
        httpOnly: true
    }
}))
app.use(flash())

//using passsport middlewares
app.use(passport.initialize()); //used for initializing passport
app.use(passport.session()); //used for identfying users between sessions
passport.use(new localStrategy(User.authenticate())) //or do passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser()); //these 2 methods are for serializing and de-serialzing users.
passport.deserializeUser(User.deserializeUser());



//middleware for flash
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.failure = req.flash('failure');

    //adding this later for passport error flash
    res.locals.error = req.flash('error');

    //adding this later for storing req.user in locals variable so we can use it for login/logout/signup
    res.locals.currUser = req.user;

    next()
})

//LISTING routes
app.use('/', listingRoutes)

//user routes
app.use('/user', userRoutes)

//added later
//booking routes
app.use('/booking', bookingRoutes)

//middleware for page not found
app.use((req, res) => {
    throw new customExpressError(404, 'Page not found!!!')
})


//error handling middleware
app.use((err, req, res, next) => {
    let { status = 500, message } = err;

    err.status = status

    res.status(status).render('error', { err })
})

app.listen(PORT, () => {
    console.log('server started on port', PORT);
})