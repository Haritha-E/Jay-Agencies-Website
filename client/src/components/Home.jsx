import React from "react";
import { useNavigate } from "react-router-dom";

const Home = ({ onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout(); // Calls the logout function from App.js
    navigate("/"); // Redirect to login page
  };

  return (
    <div style={styles.container}>
      <h1>Welcome to Jay Agencies</h1>
      <p>You have successfully logged in.</p>
      <button onClick={handleLogout} style={styles.logoutButton}>Logout</button>
    </div>
  );
};

// Inline styles for basic styling
const styles = {
  container: {
    textAlign: "center",
    marginTop: "50px",
  },
  logoutButton: {
    backgroundColor: "#d9534f",
    color: "white",
    border: "none",
    padding: "10px 20px",
    fontSize: "16px",
    cursor: "pointer",
    borderRadius: "5px",
    marginTop: "20px",
  },
};

export default Home;
