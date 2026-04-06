import { useEffect, useState } from "react";
import API from "../services/api";

function Masters() {
  const [activeTab, setActiveTab] = useState("customers");

  const [customers, setCustomers] = useState([]);
  const [items, setItems] = useState([]);

  const [custForm, setCustForm] = useState({
    name: "",
    email: "",
    phone: "",
    gst_number: "",
  });

  const [itemForm, setItemForm] = useState({
    name: "",
    price: "",
  });

  const fetchData = async () => {
    try {
      const c = await API.get("/customers");
      const i = await API.get("/items");

      setCustomers(c.data);
      setItems(i.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addCustomer = async () => {
    if (!custForm.name || !custForm.email) return;

    await API.post("/customers", {
      ...custForm,
      gst_registered: custForm.gst_number !== "",
    });

    setCustForm({ name: "", email: "", phone: "", gst_number: "" });
    await fetchData();
  };

  const addItem = async () => {
    if (!itemForm.name || !itemForm.price) return;

    await API.post("/items", {
      name: itemForm.name,
      price: Number(itemForm.price),
    });

    setItemForm({ name: "", price: "" });
    await fetchData();
  };

  const updateCustomer = async (c) => {
    const name = prompt("Name", c.name);
    const email = prompt("Email", c.email);
    const phone = prompt("Phone", c.phone || "");
    const gst = prompt("GST Number", c.gst_number || "");

    if (!name || !email) return;

    await API.put(`/customers/${c.id}`, {
      name,
      email,
      phone,
      gst_number: gst,
      gst_registered: gst !== "",
    });

    await fetchData();
  };

  const updateItem = async (i) => {
    const name = prompt("Item Name", i.name);
    const price = prompt("Price", i.price);

    if (!name || !price) return;

    await API.put(`/items/${i.id}`, {
      name,
      price: Number(price),
    });

    await fetchData();
  };

  const deleteCustomer = async (id) => {
    try {
      await API.delete(`/customers/${id}`);
      await fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  const deleteItem = async (id) => {
    try {
      await API.delete(`/items/${id}`);
      await fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="page">
      <div className="card" style={{ display: "flex", gap: "10px" }}>
        <button className="btn" onClick={() => setActiveTab("customers")}>
          Customers
        </button>
        <button className="btn" onClick={() => setActiveTab("items")}>
          Items
        </button>
      </div>

      {activeTab === "customers" && (
        <>
          <div className="card">
            <h3>Add Customer</h3>

            <div className="form-row">
              <input
                placeholder="Name"
                value={custForm.name}
                onChange={(e) =>
                  setCustForm({ ...custForm, name: e.target.value })
                }
              />
              <input
                placeholder="Email"
                value={custForm.email}
                onChange={(e) =>
                  setCustForm({ ...custForm, email: e.target.value })
                }
              />
            </div>

            <div className="form-row">
              <input
                placeholder="Phone"
                value={custForm.phone}
                onChange={(e) =>
                  setCustForm({ ...custForm, phone: e.target.value })
                }
              />
              <input
                placeholder="GST Number"
                value={custForm.gst_number}
                onChange={(e) =>
                  setCustForm({ ...custForm, gst_number: e.target.value })
                }
              />
            </div>

            <div style={{ marginTop: "20px" }}>
              <button className="btn" onClick={addCustomer}>
                Add Customer
              </button>
            </div>
          </div>

          <div className="card">
            <h3>Customers</h3>

            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>GST</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {customers.map((c) => (
                  <tr key={c.id}>
                    <td>{c.name}</td>
                    <td>{c.email}</td>
                    <td>{c.phone || "-"}</td>
                    <td>{c.gst_registered ? "Yes" : "No"}</td>
                    <td style={{ display: "flex", gap: "10px" }}>
                      <button className="btn" onClick={() => updateCustomer(c)}>
                        Update
                      </button>
                      <button
                        className="btn-danger"
                        onClick={() => deleteCustomer(c.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {activeTab === "items" && (
        <>
          <div className="card">
            <h3>Add Item</h3>

            <div className="form-row">
              <input
                placeholder="Item Name"
                value={itemForm.name}
                onChange={(e) =>
                  setItemForm({ ...itemForm, name: e.target.value })
                }
              />
              <input
                placeholder="Price"
                type="number"
                value={itemForm.price}
                onChange={(e) =>
                  setItemForm({ ...itemForm, price: e.target.value })
                }
              />
            </div>

            <div style={{ marginTop: "20px" }}>
              <button className="btn" onClick={addItem}>
                Add Item
              </button>
            </div>
          </div>

          <div className="card">
            <h3>Items</h3>

            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {items.map((i) => (
                  <tr key={i.id}>
                    <td>{i.name}</td>
                    <td>₹{i.price}</td>
                    <td style={{ display: "flex", gap: "10px" }}>
                      <button className="btn" onClick={() => updateItem(i)}>
                        Update
                      </button>
                      <button
                        className="btn-danger"
                        onClick={() => deleteItem(i.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

export default Masters;
