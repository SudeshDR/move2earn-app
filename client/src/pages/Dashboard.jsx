import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "./index.css";

function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [stepsToAdd, setStepsToAdd] = useState(0);
  const [withdrawAmount, setWithdrawAmount] = useState(0);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (!storedUser) {
      navigate("/");
    } else {
      setUser(storedUser);
    }
  }, []);

  const withdrawCoins = async () => {
    try {
      const { data } = await API.post("/wallet/withdraw", {
        userId: user._id,
        amount: withdrawAmount,
      });

      const updatedUser = {
        ...user,
        coins: data.remainingCoins,
      };

      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setWithdrawAmount(0);

      alert("Withdrawal successful!");
    } catch (error) {
      alert("Withdrawal failed");
    }
  };

  const addSteps = async () => {
    try {
      const { data } = await API.post("/steps/add-steps", {
        userId: user._id,
        steps: stepsToAdd,
      });

      const updatedUser = {
        ...user,
        totalSteps: data.totalSteps,
        coins: data.coins,
      };

      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setStepsToAdd(0);
    } catch (error) {
      alert("Error adding steps");
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  if (!user) return null;

  return (
    <div style={pageStyle}>

      {/* HEADER */}
      <div style={header}>
        <h2>🚀 Move2Earn Dashboard</h2>
        <button onClick={logout} style={logoutBtn}>Logout</button>
      </div>

      {/* WELCOME */}
      <h1 style={{ marginTop: "20px" }}>Welcome, {user.name} 👋</h1>

      {/* STATS */}
      <div style={statsContainer}>
        <div style={statCard}>
          <h3>Total Steps</h3>
          <p style={statValue}>{user.totalSteps}</p>
        </div>

        <div style={statCard}>
          <h3>Coins Earned</h3>
          <p style={statValue}>{user.coins}</p>
        </div>
      </div>

      {/* ACTIONS */}
      <div style={actionsContainer}>

        {/* ADD STEPS */}
        <div style={actionCard}>
          <h3>Add Steps</h3>
          <input
            type="number"
            placeholder="Enter steps"
            value={stepsToAdd}
            onChange={(e) => setStepsToAdd(e.target.value)}
            style={inputStyle}
          />
          <button onClick={addSteps} style={buttonStyle}>
            Add Steps
          </button>
        </div>

        {/* WITHDRAW */}
        <div style={actionCard}>
          <h3>Withdraw Coins</h3>
          <input
            type="number"
            placeholder="Enter coins"
            value={withdrawAmount}
            onChange={(e) => setWithdrawAmount(e.target.value)}
            style={inputStyle}
          />
          <button onClick={withdrawCoins} style={buttonStyle}>
            Withdraw
          </button>
        </div>

      </div>

    </div>
  );
}

/* ---------- STYLES ---------- */

const pageStyle = {
  minHeight: "100vh",
  background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
  color: "white",
  padding: "20px"
};

const header = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center"
};

const logoutBtn = {
  padding: "8px 15px",
  borderRadius: "8px",
  border: "none",
  background: "#ff4d4d",
  color: "white",
  cursor: "pointer"
};

const statsContainer = {
  display: "flex",
  gap: "20px",
  marginTop: "30px",
  flexWrap: "wrap"
};

const statCard = {
  flex: "1",
  minWidth: "200px",
  background: "rgba(255,255,255,0.1)",
  padding: "20px",
  borderRadius: "15px",
  backdropFilter: "blur(10px)",
  boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
  textAlign: "center"
};

const statValue = {
  fontSize: "28px",
  fontWeight: "bold",
  marginTop: "10px"
};

const actionsContainer = {
  display: "flex",
  gap: "20px",
  marginTop: "40px",
  flexWrap: "wrap"
};

const actionCard = {
  flex: "1",
  minWidth: "250px",
  background: "rgba(255,255,255,0.1)",
  padding: "20px",
  borderRadius: "15px",
  backdropFilter: "blur(10px)",
  boxShadow: "0 4px 20px rgba(0,0,0,0.3)"
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginTop: "10px",
  borderRadius: "8px",
  border: "none",
  outline: "none"
};

const buttonStyle = {
  marginTop: "10px",
  width: "100%",
  padding: "10px",
  borderRadius: "8px",
  border: "none",
  background: "#00c6ff",
  color: "black",
  fontWeight: "bold",
  cursor: "pointer"
};

export default Dashboard;