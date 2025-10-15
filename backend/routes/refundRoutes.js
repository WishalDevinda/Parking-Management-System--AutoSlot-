//declaring a variable to import the express Router function
const router = require('express').Router();

//declaring a variable to import the refund controller functions
const refundCtrl = require('../controllers/refundController');

//create routes
router.post('/', refundCtrl.createRefund);
router.get('/', refundCtrl.getRefunds);
router.get('/:id', refundCtrl.getRefundById);
router.put('/:id', refundCtrl.updateRefund);
router.delete('/:id', refundCtrl.deleteRefund);

//export the router
module.exports = router;