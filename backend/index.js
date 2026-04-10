const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

const customerRoutes = require("./routes/customer_route");
const itemRoutes = require("./routes/item_route");
const invoiceRoutes = require("./routes/invoice_route");

app.use(cors());
app.use(express.json());

app.use("/api/customers", customerRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/invoice", invoiceRoutes);

app.get("/", (req, res) => {
  res.send("API running...");
});

const pool = require("./db/connection");
pool
  .connect()
  .then(() => console.log("DB connected"))
  .catch((err) => console.error("DB connection error:", err));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
