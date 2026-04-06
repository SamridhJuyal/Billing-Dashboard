const express = require('express');
const router = express.Router();

const { 
    createInvoice, 
    getAllInvoices,
    getInvoiceById,
    getInvoicesByCustomer
} = require('../controllers/invoice_controller');

router.post('/', createInvoice);

router.get('/customer/:id', getInvoicesByCustomer);
router.get('/:id', getInvoiceById);
router.get('/', getAllInvoices);

module.exports = router;