//declaring a variable to import the express Router function
const router = require('express').Router();

//declaring a variable to import the vehicle controller functions
const vehicleCtrl = require('../controllers/vehicleController');

//create routes
router.post('/', vehicleCtrl.createVehicle);
router.get('/', vehicleCtrl.getVehicles);
router.get('/:id', vehicleCtrl.getVehicleById);
router.put('/:id', vehicleCtrl.updateVehicle);
router.delete('/:id', vehicleCtrl.deleteVehicle);

// custom finish endpoint
router.post('/finish/:vehicleNumber', vehicleCtrl.finishByNumber);

//export the router
module.exports = router;