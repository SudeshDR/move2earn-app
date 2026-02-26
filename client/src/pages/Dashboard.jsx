import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "./index.css"

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
  <div className="container">
    <h2>👋 Welcome {user.name}</h2>

    <div className="dashboard-grid">

      <div className="stat-card">
        <div className="stat-icon">👟</div>
        <div className="stat-value">{user.totalSteps}</div>
        <div className="stat-label">TOTAL STEPS</div>
      </div>

      <div className="stat-card">
        <div className="stat-icon">🪙</div>
        <div className="stat-value">{user.coins}</div>
        <div className="stat-label">TOTAL COINS</div>
      </div>

      <div className="stat-card">
        <div className="stat-icon">💸</div>
        <div className="stat-label">Withdraw Coins</div>

        <input
          type="number"
          placeholder="Enter coins"
          value={withdrawAmount}
          onChange={(e) => setWithdrawAmount(e.target.value)}
        />

        <button onClick={withdrawCoins}>Withdraw</button>
      </div>

      <div className="stat-card">
        <div className="stat-icon">➕</div>
        <div className="stat-label">Add Steps</div>

        <input
          type="number"
          placeholder="Enter steps"
          value={stepsToAdd}
          onChange={(e) => setStepsToAdd(e.target.value)}
        />

        <button onClick={addSteps}>Add Steps</button>
      </div>

    </div>

    <button onClick={logout} style={{ marginTop: "40px" }}>
      Logout
    </button>
  </div>
);
}

const containerStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  marginTop: "100px",
  gap: "10px",
};

export default Dashboard;
