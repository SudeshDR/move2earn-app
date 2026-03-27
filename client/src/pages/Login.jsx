import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import "./index.css";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
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
      const { data } = await API.post("/auth/login", formData);

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      alert("Login successful!");
      navigate("/dashboard");

    } catch (error) {
      alert("Invalid Credentials");
      console.log(error);
    }
  };

  return (
    <div style={pageStyle}>

      {/* HERO */}
      <div style={heroStyle}>
        <h1 style={{ fontSize: "40px" }}>Welcome Back 👋</h1>
        <p style={{ maxWidth: "600px", textAlign: "center" }}>
          Track your steps, earn crypto rewards, and stay fit with Move2Earn.
        </p>
      </div>

      {/* FEATURES */}
      <div style={cardContainer}>
        <div style={card}>
          <h3>🚶 Track Activity</h3>
          <p>Monitor your steps and daily fitness goals easily.</p>
        </div>

        <div style={card}>
          <h3>🪙 Earn Tokens</h3>
          <p>Get rewarded in crypto for staying active.</p>
        </div>

        <div style={card}>
          <h3>🔐 Secure Login</h3>
          <p>Your data and wallet are protected with secure APIs.</p>
        </div>
      </div>

      {/* LOGIN CARD */}
      <div style={loginCard}>
        <h2>Login</h2>

        <form onSubmit={handleSubmit} style={formStyle}>
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

          <button type="submit" style={buttonStyle}>
            Login
          </button>
        </form>

        <p style={{ marginTop: "10px" }}>
          Don’t have an account? <Link to="/signup">Signup</Link>
        </p>
      </div>

      {/* EXTRA INFO */}
      <div style={aboutSection}>
        <h2>Why Move2Earn?</h2>
        <p style={{ maxWidth: "700px", textAlign: "center" }}>
          Move2Earn combines fitness with blockchain technology to create a
          rewarding ecosystem where users earn while staying healthy.
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

const loginCard = {
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

export default Login;