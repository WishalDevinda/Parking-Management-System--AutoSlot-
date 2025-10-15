//declaring a variable to import the express Router function
const router = require('express').Router();

//declaring a variable to import the employee controller functions
const employeeCtrl = require('../controllers/employeeController');

//create routes
router.post('/', employeeCtrl.createEmployee);
router.get('/', employeeCtrl.getEmployees);
router.get('/:id', employeeCtrl.getEmployeeById);
router.put('/:id', employeeCtrl.updateEmployee);
router.delete('/:id', employeeCtrl.deleteEmployee);

//export the router
module.exports = router;
