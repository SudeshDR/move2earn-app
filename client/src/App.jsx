import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Navbar from "./components/Navbar";
import TransactionHistory from "./pages/TransactionHistory";
import MiningHistory from "./pages/MiningHistory";
import Leaderboard from "./pages/Leaderboard";
import HowItWorks from "./pages/HowItWorks";



const showToast = (message, type = "success") => {
  const container = document.getElementById("toast-container");

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerText = message;

  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3500);
};

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/history" element={<TransactionHistory />} />
        <Route path="/mining-history" element={<MiningHistory />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
      </Routes>
    </Router>
    
  );
  
}

export default App;