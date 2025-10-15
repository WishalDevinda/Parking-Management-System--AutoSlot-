//declaring a variable to import the express Router function
const router = require('express').Router();

//declaring a variable to import the slot controller functions
const slotCtrl = require('../controllers/slotController');

//create routes
router.post('/', slotCtrl.createSlot);
router.get('/', slotCtrl.getSlots);
router.get('/:id', slotCtrl.getSlotById);
router.put('/:id', slotCtrl.updateSlot);
router.delete('/:id', slotCtrl.deleteSlot);

//extra action routes
router.put('/:id/occupy', slotCtrl.markOccupied);
router.put('/:id/free', slotCtrl.markFree);

//export the router
module.exports = router;