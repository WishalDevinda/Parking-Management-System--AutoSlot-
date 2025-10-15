//declaring a variable to import the express Router function
const router = require('express').Router();

//declaring a variable to import the in-parking reservation controller functions
const inParkingReservationCtrl = require('../controllers/inParkingReservationController');

//create routes
router.post('/', inParkingReservationCtrl.createReservation);
router.get('/', inParkingReservationCtrl.getReservations);
router.get('/:id', inParkingReservationCtrl.getReservationById);
router.put('/:id', inParkingReservationCtrl.updateReservation);
router.delete('/:id', inParkingReservationCtrl.deleteReservation);

//export the router
module.exports = router;