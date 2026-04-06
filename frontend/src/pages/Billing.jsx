import { useEffect, useState } from "react";
import API from "../services/api";

function Billing() {
  const [customers, setCustomers] = useState([]);
  const [items, setItems] = useState([]);

  const [customerId, setCustomerId] = useState("");
  const [selectedItems, setSelectedItems] = useState([
    { item_id: "", quantity: 1 },
  ]);

  const [subtotal, setSubtotal] = useState(0);
  const [tax, setTax] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    API.get("/customers").then((res) => setCustomers(res.data));
    API.get("/items").then((res) => setItems(res.data));
  }, []);

  const updateItem = (index, field, value) => {
    const updated = [...selectedItems];
    updated[index][field] = value;
    setSelectedItems(updated);

    if (field === "item_id" && index === selectedItems.length - 1) {
      setSelectedItems([...updated, { item_id: "", quantity: 1 }]);
    }
  };

  useEffect(() => {
    let sub = 0;

    selectedItems.forEach((i) => {
      const item = items.find((it) => it.id === i.item_id);
      if (item) {
        sub += item.price * i.quantity;
      }
    });

    const customer = customers.find((c) => c.id === Number(customerId));

    let gst = 0;
    if (customer && !customer.gst_registered) {
      gst = sub * 0.18;
    }

    setSubtotal(sub);
    setTax(gst);
    setTotal(sub + gst);
  }, [selectedItems, customerId, items, customers]);

  const createInvoice = async () => {
    if (!customerId) {
      alert("Select customer");
      return;
    }

    const filteredItems = selectedItems.filter(
      (i) => i.item_id && i.quantity > 0,
    );

    if (filteredItems.length === 0) {
      alert("Add at least one item");
      return;
    }

    try {
      await API.post("/invoice", {
        customer_id: Number(customerId),
        items: filteredItems.map((i) => ({
          item_id: Number(i.item_id),
          quantity: Number(i.quantity),
        })),
      });

      alert("Invoice Created");

      setSelectedItems([{ item_id: "", quantity: 1 }]);
    } catch (err) {
      alert(err.response?.data?.message || "Error creating invoice");
    }
  };

  return (
    <div className="page">
      <div className="card">
        <h3>Select Customer</h3>

        <select
          value={customerId}
          onChange={(e) => setCustomerId(e.target.value)}
        >
          <option value="" disabled>
            Select Customer
          </option>

          {customers.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="card">
        <h3>Invoice Items</h3>

        {selectedItems.map((item, i) => (
          <div className="form-row" key={i}>
            <select
              value={item.item_id}
              onChange={(e) => updateItem(i, "item_id", Number(e.target.value))}
            >
              <option value="">Select Item</option>

              {items.map((it) => (
                <option key={it.id} value={it.id}>
                  {it.name}
                </option>
              ))}
            </select>

            <input
              type="number"
              min="1"
              value={item.quantity}
              onChange={(e) =>
                updateItem(i, "quantity", Number(e.target.value))
              }
            />
          </div>
        ))}
      </div>

      <div className="card">
        <h3>Invoice Summary</h3>

        <div style={row}>
          <span>Subtotal</span>
          <span>₹{subtotal.toFixed(2)}</span>
        </div>

        <div style={row}>
          <span>GST (18%)</span>
          <span>₹{tax.toFixed(2)}</span>
        </div>

        <hr style={{ margin: "10px 0" }} />

        <div style={{ ...row, fontWeight: "bold", fontSize: "18px" }}>
          <span>Total</span>
          <span>₹{total.toFixed(2)}</span>
        </div>
      </div>

      <button className="btn" onClick={createInvoice}>
        Generate Invoice
      </button>
    </div>
  );
}

export default Billing;

const row = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "8px",
};
