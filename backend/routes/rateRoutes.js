//declaring a variable to import the express Router function
const router = require('express').Router();

//declaring a variable to import the rate controller functions
const rateCtrl = require('../controllers/rateController');

//create routes
router.post('/', rateCtrl.createRate);
router.get('/', rateCtrl.getRates);
router.get('/:id', rateCtrl.getRateById);
router.put('/:id', rateCtrl.updateRate);
router.delete('/:id', rateCtrl.deleteRate);

//export the router
module.exports = router;