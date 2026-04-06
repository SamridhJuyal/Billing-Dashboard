function Card({ children }) {
  return (
    <div style={{
      background: "#fff",
      padding: "20px",
      borderRadius: "10px",
      boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
      marginBottom: "20px"
    }}>
      {children}
    </div>
  );
}

export default Card;