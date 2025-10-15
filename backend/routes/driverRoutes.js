//declaring a variable to import the express Router function
const router = require('express').Router();

//declaring a variable to import driver controller functions
const driverCtrl = require('../controllers/driverController');

//create routes
router.post('/', driverCtrl.createDriver);
router.get('/', driverCtrl.getDrivers);
router.get('/:id', driverCtrl.getDriverById);
router.put('/:id', driverCtrl.updateDriver);
router.delete('/:id', driverCtrl.deleteDriver);

//export the router
module.exports = router;