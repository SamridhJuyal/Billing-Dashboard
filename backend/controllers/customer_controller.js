const pool = require("../db/connection");

exports.createCustomer = async (req, res) => {
  try {
    const { name, email, phone, gst_number } = req.body;

    await pool.query(
      `INSERT INTO customers (name, email, phone, gst_number, gst_registered)
        VALUES ($1, $2, $3, $4, $5)`,
      [name, email, phone, gst_number, gst_number !== ""],
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getCustomers = async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM customers ORDER BY id DESC`);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateCustomer = async (req, res) => {
  try {
    const { name, email, gst_registered } = req.body;

    const result = await pool.query(
      `UPDATE customers 
       SET name=$1, email=$2, gst_registered=$3
       WHERE id=$4 RETURNING *`,
      [name, email, gst_registered, req.params.id],
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteCustomer = async (req, res) => {
  try {
    const check = await pool.query(
      `SELECT * FROM invoices WHERE customer_id=$1`,
      [req.params.id],
    );

    if (check.rows.length > 0) {
      return res.status(400).json({
        message: "Customer has invoices, cannot delete",
      });
    }

    await pool.query(`DELETE FROM customers WHERE id=$1`, [req.params.id]);

    res.json({ message: "Customer deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
