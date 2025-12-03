const express = require('express')
const passport = require('passport')
const { User } = require('../models/user')
const { wrapAsync } = require('../utils/wrapAsync')
let userControllers = require('../controllers/userControllers')
const {isLoggedIn} = require('../utils/authenticate')

const router = express.Router();

//signup route
router.get('/signup', userControllers.getSignup)
router.post('/signup', wrapAsync(userControllers.postSignup))



router.get('/login', userControllers.getLogin)
router.post('/login',

    //adding another callback right here instead of middlware
    (req, res, next) => {
        res.locals.remember = req.session.remember;
        next();
    },
    
    passport.authenticate('local', { failureRedirect: '/user/login', failureFlash: true }), userControllers.postLogin)


router.get('/logout', userControllers.logout)

//added later
//edit user
router.get('/edit',isLoggedIn, wrapAsync(userControllers.getEdit))
router.post('/edit',isLoggedIn, wrapAsync(userControllers.postEdit))

module.exports = { router }