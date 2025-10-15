//declaring a variable to import the express Router function
const router = require('express').Router();

//declaring a variable to import the payment controller function
const paymentCtrl = require('../controllers/paymentController');

//create routes
router.post('/', paymentCtrl.createPayment);
router.get('/', paymentCtrl.getPayments);
router.get('/:id', paymentCtrl.getPaymentById);
router.put('/:id', paymentCtrl.updatePayment);
router.delete('/:id', paymentCtrl.deletePayment);

//special route to pay using vehicle number
router.post('/payForVehicleNumber', paymentCtrl.payForVehicleNumber);

//export the router
module.exports = router;
