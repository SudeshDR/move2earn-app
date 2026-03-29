import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "./index.css";

function Dashboard() {
  const navigate = useNavigate();

  const [autoWalk, setAutoWalk] = useState(false);
  const [motionSteps, setMotionSteps] = useState(0);

  const [user, setUser] = useState(null);
  const [stepsToAdd, setStepsToAdd] = useState(0);
  const [withdrawAmount, setWithdrawAmount] = useState(0);

  // ✅ Load user
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (!storedUser) {
      navigate("/");
    } else {
      setUser(storedUser);
    }
  }, []);

  // ✅ AUTO WALK LOGIC (REPLACES MOTION SENSOR)
  useEffect(() => {
    let interval;

    if (autoWalk) {
      interval = setInterval(() => {
  setMotionSteps((prev) => prev + Math.floor(Math.random() * 2 + 1));
}, 5000);
    }

    return () => clearInterval(interval);
  }, [autoWalk]);
 
  // ✅ SAVE STEPS
  const saveMotionSteps = async () => {
    try {
      const { data } = await API.post("/steps/add-steps", {
        userId: user._id,
        steps: motionSteps,
      });

      const updatedUser = {
        ...user,
        totalSteps: data.totalSteps,
        coins: data.coins,
      };

      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setMotionSteps(0);

      alert("Steps saved!");
    } catch (err) {
      alert("Error saving steps");
    }
  };

  // ✅ WITHDRAW
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

  // ✅ MANUAL STEPS
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

const startRealMotionDemo = async () => {
  try {
    // iOS permission
    if (typeof DeviceMotionEvent !== "undefined" &&
        typeof DeviceMotionEvent.requestPermission === "function") {

      const permission = await DeviceMotionEvent.requestPermission();

      if (permission !== "granted") {
        alert("Motion permission denied");
        return;
      }
    }

    alert("Motion sensor activated ✅");

    window.addEventListener("devicemotion", (event) => {
      const x = event.accelerationIncludingGravity?.x;
      const y = event.accelerationIncludingGravity?.y;
      const z = event.accelerationIncludingGravity?.z;

      console.log("Motion Data:", { x, y, z });

      // 👇 just for demo (small increment)
      if (Math.abs(y) > 7) {
        setMotionSteps((prev) => prev + 1);
      }
    });

  } catch (err) {
    console.log(err);
    alert("DeviceMotion not supported");
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
        <button onClick={logout} style={logoutBtn}>
          Logout
        </button>
      </div>

      <h1 style={{ marginTop: "20px" }}>
        Welcome, {user.name} 👋
      </h1>

      {/* DASHBOARD CARDS */}
      <div className="dashboard-grid">
        <div className="card">
          <h3>🚶 Total Steps</h3>
          <p>{user.totalSteps}</p>
        </div>

        <div className="card">
          <h3>💰 Coins</h3>
          <p>{user.coins}</p>
        </div>

        <div className="card">
          <h3>⚡ Mining Rate</h3>
          <p>1 coin / 1000 steps</p>
        </div>

        <div className="card">
          <h3>🔥 Activity</h3>
          <p>
            {user.totalSteps > 10000
              ? "🔥 High"
              : user.totalSteps > 5000
              ? "⚡ Medium"
              : "😴 Low"}
          </p>
        </div>
      </div>

      {/* 🚶 SMART WALK MODE */}
      <div style={actionCard}>
        <h3>🚶 Smart Walking Mode</h3>

        <p>Live Steps: {motionSteps}</p>

        {!autoWalk ? (
          <button onClick={() => setAutoWalk(true)} style={buttonStyle}>
            Start Walking
          </button>
        ) : (
          <button onClick={() => setAutoWalk(false)} style={buttonStyle}>
            Stop Walking
          </button>
        )}

        <button
          onClick={saveMotionSteps}
          style={{ ...buttonStyle, marginTop: "10px" }}
        >
          Save Steps
        </button>
      </div>

      {/* MANUAL + WITHDRAW */}
      <div style={actionsContainer}>
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
  padding: "20px",
};

const header = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const logoutBtn = {
  padding: "8px 15px",
  borderRadius: "8px",
  border: "none",
  background: "#ff4d4d",
  color: "white",
  cursor: "pointer",
};

const actionsContainer = {
  display: "flex",
  gap: "20px",
  marginTop: "40px",
  flexWrap: "wrap",
};

const actionCard = {
  flex: "1",
  minWidth: "250px",
  background: "rgba(255,255,255,0.1)",
  padding: "20px",
  borderRadius: "15px",
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginTop: "10px",
  borderRadius: "8px",
  border: "none",
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
  cursor: "pointer",
};

export default Dashboard;