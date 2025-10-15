//declaring a variable to import the express Router function
const router = require('express').Router();

//declaring variables to import the hardwareController functions
const hardwareCtrl = require('../controllers/hardwareController');

//creating routes
router.post('/', hardwareCtrl.createHardware);
router.get('/', hardwareCtrl.getHardware);
router.get('/:id', hardwareCtrl.getHardwareById);
router.put('/:id', hardwareCtrl.updateHardware);
router.delete('/:id', hardwareCtrl.deleteHardware);

//export the router
module.exports = router;