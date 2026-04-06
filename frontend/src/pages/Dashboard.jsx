import { useEffect, useState } from "react";
import API from "../services/api";

function Dashboard() {
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    API.get("/invoice").then(res => setInvoices(res.data));
  }, []);

  return (
    <div className="page">

      <div style={grid}>
        {invoices.map(inv => (
          <div key={inv.id} className="card-hover">

            <div style={row}>
              <span style={label}>Invoice ID</span>
              <span style={value}>{inv.id}</span>
            </div>

            <div style={row}>
              <span style={label}>Customer ID</span>
              <span style={value}>{inv.customer_id}</span>
            </div>

            <div style={row}>
              <span style={label}>Amount</span>
              <span style={value}>₹{inv.total_amount}</span>
            </div>

            <div style={row}>
              <span style={label}>GST Applied</span>
              <span style={value}>{inv.gst_applied ? "Yes" : "No"}</span>
            </div>

            <div style={row}>
              <span style={label}>Date</span>
              <span style={value}>
                {new Date(inv.created_at).toLocaleString()}
              </span>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}

export default Dashboard;


/* styles */

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
  gap: "20px"
};

const row = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "8px"
};

const label = {
  color: "#6b7280",
  fontSize: "13px"
};

const value = {
  fontWeight: "600"
};