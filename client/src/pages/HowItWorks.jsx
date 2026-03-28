import React from "react";

function HowItWorks() {
  return (
    <div style={pageStyle}>
      <h1 style={title}>🚀 How Move2Earn Works</h1>

      <p style={subtitle}>
        Walk. Earn. Repeat. Transform your daily steps into real rewards using blockchain.
      </p>

      {/* STEPS GRID */}
      <div style={grid}>
        <div style={card}>
          <span style={icon}>👤</span>
          <h3>Create Account</h3>
          <p>Sign up and log in securely to start your journey.</p>
        </div>

        <div style={card}>
          <span style={icon}>👣</span>
          <h3>Track Steps</h3>
          <p>Enter or sync your daily steps from your activity.</p>
        </div>

        <div style={card}>
          <span style={icon}>💰</span>
          <h3>Earn Coins</h3>
          <p>Steps are converted into coins automatically.</p>
        </div>

        <div style={card}>
          <span style={icon}>🔗</span>
          <h3>Blockchain Secure</h3>
          <p>All rewards are secured using smart contracts.</p>
        </div>

        <div style={card}>
          <span style={icon}>💸</span>
          <h3>Withdraw</h3>
          <p>Transfer your coins to your crypto wallet anytime.</p>
        </div>

        <div style={card}>
          <span style={icon}>📊</span>
          <h3>Track Progress</h3>
          <p>View your mining & transaction history easily.</p>
        </div>
      </div>

      {/* EXTRA INFO */}
      <div style={infoSection}>
        <h2>✨ Why Move2Earn?</h2>
        <p>
          Move2Earn motivates users to stay active while earning rewards. By combining
          fitness with blockchain technology, it ensures transparency, security, and
          real value for your effort.
        </p>
      </div>
    </div>
  );
}
const pageStyle = {
  minHeight: "100vh",
  background: "linear-gradient(to right, #020617, #0f172a)",
  color: "white",
  padding: "60px 20px",
  textAlign: "center",
};

const title = {
  fontSize: "40px",
  fontWeight: "bold",
};

const subtitle = {
  marginTop: "10px",
  fontSize: "18px",
  color: "#94a3b8",
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
  gap: "25px",
  marginTop: "50px",
};

const card = {
  background: "#1e293b",
  padding: "25px",
  borderRadius: "20px",
  transition: "0.3s",
  boxShadow: "0 8px 20px rgba(0,0,0,0.4)",
};

const icon = {
  fontSize: "30px",
};

const infoSection = {
  marginTop: "60px",
  maxWidth: "700px",
  marginInline: "auto",
  color: "#cbd5f5",
  fontSize: "17px",
};
export default HowItWorks;