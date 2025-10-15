//declaring a variable to import the express Router function
const router = require('express').Router();

//declaring a variable to import the extra rate controller functions
const extraRateCtrl = require('../controllers/extraRateController');

//create routes
router.post('/', extraRateCtrl.createExtraRate);
router.get('/', extraRateCtrl.getExtraRates);
router.get('/:id', extraRateCtrl.getExtraRateById);
router.put('/:id', extraRateCtrl.updateExtraRate);
router.delete('/:id', extraRateCtrl.deleteExtraRate);

//export the router
module.exports = router;
