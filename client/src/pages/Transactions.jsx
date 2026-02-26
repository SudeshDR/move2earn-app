import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Transactions() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (!storedUser) {
      navigate("/");
    } else {
      setUser(storedUser);
      fetchTransactions(storedUser._id);
    }
  }, []);

  const fetchTransactions = async (userId) => {
    try {
      const { data } = await API.get(`/wallet/history/${userId}`);
      setTransactions(data);
    } catch (error) {
      alert("Error fetching transactions");
    }
  };

  return (
    <div style={containerStyle}>
      <h2>Transaction History</h2>

      <button onClick={() => navigate("/dashboard")}>
        Back to Dashboard
      </button>

      {transactions.length === 0 ? (
        <p>No transactions found</p>
      ) : (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Amount</th>
              <th>Wallet</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx._id}>
                <td>{tx.amount}</td>
                <td>{tx.walletAddress}</td>
                <td>{tx.status}</td>
                <td>{new Date(tx.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const containerStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  marginTop: "50px",
  gap: "20px"
};

export default Transactions;