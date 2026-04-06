const pool = require('../db/connection');

// Generate invoice id
const generateInvoiceid = () => {
    const num = Math.floor(100000 + Math.random() * 900000);
    return `INVC${num}`;
};

// Create invoice
exports.createInvoice = async (req, res) => {
    const client = await pool.connect();

    try {
        const { customer_id, items } = req.body;

        if (!customer_id || !items || items.length === 0) {
            return res.status(400).json({ message: "Invalid data" });
        }

        await client.query('BEGIN');

        // Get customer
        const customerRes = await client.query(
            `SELECT * FROM customers WHERE id = $1`,
            [customer_id]
        );

        const customer = customerRes.rows[0];

        if (!customer) {
            throw new Error("Customer not found");
        }

        let total = 0;
        let invoiceItemsData = [];

        for (let item of items) {
            const itemRes = await client.query(
                `SELECT * FROM items WHERE id = $1`,
                [item.item_id]
            );

            const dbitem = itemRes.rows[0];

            if (!dbitem) {
                throw new Error(`Item not found: ${item.item_id}`);
            }

            const itemTotal = dbitem.price * item.quantity;
            total += itemTotal;

            invoiceItemsData.push({
                item_id: item.item_id,
                quantity: item.quantity,
                price: dbitem.price
            });
        }

        // GST logic
        let gst_applied = false;

        if (!customer.gst_registered) {
            total = total + total * 0.18;
            gst_applied = true;
        }

        const invoiceId = generateInvoiceid();

        // Insert into invoices table
        await client.query(
            `INSERT INTO invoices (id, customer_id, total_amount, gst_applied)
             VALUES ($1, $2, $3, $4)`,
            [invoiceId, customer_id, total, gst_applied]
        );

        // Insert all invoice items
        for (let item of invoiceItemsData) {
            await client.query(
                `INSERT INTO invoice_items (invoice_id, item_id, quantity, price)
                 VALUES ($1, $2, $3, $4)`,
                [invoiceId, item.item_id, item.quantity, item.price]
            );
        }

        await client.query('COMMIT');

        res.status(201).json({
            message: "Invoice created",
            invoice_id: invoiceId,
            total
        });

    } catch (err) {
        await client.query('ROLLBACK');

        console.error(err);
        res.status(500).json({ message: err.message });

    } finally {
        client.release();
    }
};

// Get all invoices
exports.getAllInvoices = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT * FROM invoices ORDER BY created_at DESC`
        );
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// Get invoice by id
exports.getInvoiceById = async (req, res) => {
    try {
        const { id } = req.params;

        const invoice = await pool.query(
            `SELECT * FROM invoices WHERE id = $1`,
            [id]
        );

        const items = await pool.query(
            `SELECT * FROM invoice_items WHERE invoice_id = $1`,
            [id]
        );

        res.json({
            invoice: invoice.rows[0],
            items: items.rows
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// Get invoices by customer
exports.getInvoicesByCustomer = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `SELECT * FROM invoices WHERE customer_id = $1 ORDER BY created_at DESC`,
            [id]
        );

        res.json(result.rows);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};