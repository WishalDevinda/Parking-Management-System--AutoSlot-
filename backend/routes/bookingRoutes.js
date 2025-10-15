//declaring a variable to import the express Router function
const router = require('express').Router();

//declaring a variable to import the booking controller functions
const bookingCtrl = require('../controllers/bookingController');

//create routes
router.post('/', bookingCtrl.createBooking);
router.get('/', bookingCtrl.getBookings);
router.get('/:id', bookingCtrl.getBookingById);
router.put('/:id', bookingCtrl.updateBooking);
router.delete('/:id', bookingCtrl.deleteBooking);

//export the router
module.exports = router;