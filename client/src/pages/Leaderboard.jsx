import { useEffect, useState } from "react";
import API from "../services/api";
import "./index.css";

function Leaderboard() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const { data } = await API.get("/leaderboard");
      setUsers(data);
    } catch (error) {
      console.error("Error fetching leaderboard");
    }
  };

  return (
    <div className="leaderboard-container">
      <h2>🏆 Leaderboard</h2>

      <div className="leaderboard-list">
        {users.map((user, index) => (
          <div key={index} className="leaderboard-card">
            <h3>#{index + 1}</h3>
            <p>👤 {user.name}</p>
            <p>🚶 Steps: {user.totalSteps}</p>
            <p>💰 Coins: {user.coins}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Leaderboard;