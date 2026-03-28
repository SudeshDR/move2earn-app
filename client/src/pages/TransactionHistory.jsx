import { useEffect, useState } from "react";
import API from "../services/api";
import "./index.css";

function TransactionHistory() {
  const [transactions, setTransactions] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const { data } = await API.get(`/wallet/history/${user._id}`);
      setTransactions(data);
    } catch (error) {
      alert("Error fetching history");
    }
  };

  return (
    <div className="page-container">
      <h2>📜 Transaction History</h2>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Amount</th>
              <th>Wallet</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {transactions.map((tx, index) => (
              <tr key={index}>
                <td>{new Date(tx.createdAt).toLocaleString()}</td>
                <td>{tx.amount}</td>
                <td>{tx.walletAddress}</td>
                <td>{tx.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TransactionHistory;