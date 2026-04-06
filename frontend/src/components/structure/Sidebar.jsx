import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <div style={{
      width: "240px",
      height: "100vh",
      background: "#111827",
      color: "white",
      padding: "20px"
    }}>
      <h2>Billing System</h2>

      <nav style={{ marginTop: "30px", display: "flex", flexDirection: "column", gap: "15px" }}>
        <NavLink to="/" style={link}>Dashboard</NavLink>
        <NavLink to="/billing" style={link}>Billing</NavLink>
        <NavLink to="/masters" style={link}>Masters</NavLink>
      </nav>
    </div>
  );
}

const link = ({ isActive }) => ({
  color: isActive ? "#fff" : "#ccc",
  textDecoration: "none",
  padding: "10px",
  borderRadius: "6px",
  background: isActive ? "#2563eb" : "transparent"
});

export default Sidebar;