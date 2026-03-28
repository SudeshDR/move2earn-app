import { useEffect, useState } from "react";
import API from "../services/api";
import "./index.css";

function MiningHistory() {
  const [logs, setLogs] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const { data } = await API.get(`/steps/history/${user._id}`);
      setLogs(data);
    } catch {
      alert("Error loading mining history");
    }
  };

  return (
    <div className="page-container">
      <h2>⛏️ Mining History</h2>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Steps</th>
              <th>Coins Earned</th>
            </tr>
          </thead>

          <tbody>
            {logs.map((log, i) => (
              <tr key={i}>
                <td>{new Date(log.createdAt).toLocaleString()}</td>
                <td>{log.steps}</td>
                <td>{log.coinsEarned}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default MiningHistory;