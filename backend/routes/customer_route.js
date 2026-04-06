const express = require('express');
const router = express.Router();

const { createCustomer, getCustomers, updateCustomer, deleteCustomer } = require('../controllers/customer_controller');

// Routes
router.post('/', createCustomer);
router.get('/', getCustomers);
router.delete('/:id', deleteCustomer);
router.put('/:id', updateCustomer);

module.exports = router;
