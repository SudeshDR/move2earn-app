import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import "./index.css";

function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    walletAddress: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/auth/signup", formData);
      alert("Signup successful!");
      navigate("/");
    } catch (error) {
      alert("Error signing up");
      console.log(error);
    }
  };

  return (
    <div style={pageStyle}>
      
      {/* HERO SECTION */}
      <div style={heroStyle}>
        <h1 style={{ fontSize: "40px" }}>Move2Earn 🚀</h1>
        <p style={{ maxWidth: "600px", textAlign: "center" }}>
          Earn crypto rewards for every step you take. Connect your wallet,
          stay active, and get paid on the blockchain.
        </p>
      </div>

      {/* BENEFITS SECTION */}
      <div style={cardContainer}>
        <div style={card}>
          <h3>💰 Earn Rewards</h3>
          <p>Convert your daily steps into real crypto tokens.</p>
        </div>

        <div style={card}>
          <h3>🔗 Blockchain Powered</h3>
          <p>Secure, transparent and decentralized transactions.</p>
        </div>

        <div style={card}>
          <h3>⚡ Instant Withdrawals</h3>
          <p>Withdraw earnings directly to your crypto wallet.</p>
        </div>
      </div>

      {/* SIGNUP SECTION */}
      <div style={signupCard}>
        <h2>Create Account</h2>

        <form onSubmit={handleSubmit} style={formStyle}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            required
            style={inputStyle}
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            onChange={handleChange}
            required
            style={inputStyle}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
            style={inputStyle}
          />

          <input
            type="text"
            name="walletAddress"
            placeholder="Test Wallet Address"
            onChange={handleChange}
            required
            style={inputStyle}
          />

          <button type="submit" style={buttonStyle}>
            Signup
          </button>
        </form>

        <p style={{ marginTop: "10px" }}>
          Already have an account? <Link to="/">Login</Link>
        </p>
      </div>

      {/* ABOUT SECTION */}
      <div style={aboutSection}>
        <h2>About Move2Earn</h2>
        <p style={{ maxWidth: "700px", textAlign: "center" }}>
          Move2Earn is a blockchain-based fitness platform that rewards users
          for physical activity. By integrating smart contracts and crypto
          wallets, users can earn tokens simply by walking or running.
        </p>
      </div>

    </div>
  );
}

/* ---------- STYLES ---------- */

const pageStyle = {
  minHeight: "100vh",
  background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
  color: "white",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  paddingBottom: "50px"
};

const heroStyle = {
  marginTop: "60px",
  textAlign: "center"
};

const cardContainer = {
  display: "flex",
  gap: "20px",
  marginTop: "40px",
  flexWrap: "wrap",
  justifyContent: "center"
};

const card = {
  background: "rgba(255,255,255,0.1)",
  padding: "20px",
  borderRadius: "15px",
  width: "220px",
  backdropFilter: "blur(10px)",
  textAlign: "center",
  boxShadow: "0 4px 20px rgba(0,0,0,0.3)"
};

const signupCard = {
  marginTop: "50px",
  background: "rgba(255,255,255,0.1)",
  padding: "30px",
  borderRadius: "15px",
  backdropFilter: "blur(10px)",
  boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
  width: "300px",
  textAlign: "center"
};

const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  marginTop: "15px"
};

const inputStyle = {
  padding: "10px",
  borderRadius: "8px",
  border: "none",
  outline: "none"
};

const buttonStyle = {
  padding: "10px",
  borderRadius: "8px",
  border: "none",
  background: "#00c6ff",
  color: "black",
  fontWeight: "bold",
  cursor: "pointer"
};

const aboutSection = {
  marginTop: "60px",
  textAlign: "center"
};

export default Signup;