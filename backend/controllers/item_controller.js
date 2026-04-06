const pool = require('../db/connection');

exports.createItem = async (req, res) => {
  try {
    const { name, price } = req.body;

    const result = await pool.query(
      `INSERT INTO items (name, price)
       VALUES ($1, $2) RETURNING *`,
      [name, Number(price)]
    );

    res.status(201).json(result.rows[0]);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

exports.getItems = async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM items ORDER BY id DESC`);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateItem = async (req, res) => {
  try {
    const { name, price } = req.body;

    if (!name || price === undefined) {
      return res.status(400).json({ message: "Invalid data" });
    }

    const result = await pool.query(
      `UPDATE items 
       SET name=$1, price=$2 
       WHERE id=$3 RETURNING *`,
      [name, Number(price), req.params.id]
    );

    res.json(result.rows[0]);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

exports.deleteItem = async (req, res) => {
  try {
    await pool.query(
      `DELETE FROM items WHERE id=$1`,
      [req.params.id]
    );

    res.json({ message: "Item deleted" });

  } catch (err) {
    if (err.code === '23503') {
      return res.status(400).json({ message: "Item used in invoices" });
    }

    res.status(500).json({ message: err.message });
  }
};