const express = require('express');
const router = express.Router();
const {wrapAsync} = require('../utils/wrapAsync')
const bookingControllers = require('../controllers/bookingControllers')
const {isLoggedIn, canBook, canCancel} = require('../utils/authenticate')

router.route('/:id')
.get(isLoggedIn, canBook, wrapAsync(bookingControllers.getBook))
.post(isLoggedIn, canBook, wrapAsync(bookingControllers.postBook))

router.get('/:bookid/cancel', canCancel, isLoggedIn, wrapAsync(bookingControllers.delete))

router.get('/show/:userid', isLoggedIn, wrapAsync(bookingControllers.show))

module.exports = {router}