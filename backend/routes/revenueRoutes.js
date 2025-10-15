//declaring a variables to import the express app Router function
const router = require('express').Router();

//declaring a variable to import the revenue controller functions
const revenueCtrl = require('../controllers/revenueController');

//create routes
router.post('/', revenueCtrl.createRevenue);
router.get('/', revenueCtrl.getRevenues);
router.get('/:id', revenueCtrl.getRevenueById);
router.put('/:id', revenueCtrl.updateRevenue);
router.delete('/:id', revenueCtrl.deleteRevenue);

// monthly revenue aggregation
router.get('/monthly/from-payments', revenueCtrl.monthlyFromPayments);

//export the router
module.exports = router;