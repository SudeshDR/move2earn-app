import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "./index.css";

function Admin() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [stepLogs, setStepLogs] = useState([]);
  const [goals, setGoals] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [goalForm, setGoalForm] = useState({
    title: "",
    badgeLabel: "",
    stepsRequired: "",
    bonusCoins: "",
    color: "#00ffcc"
  });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (!storedUser) {
      navigate("/");
      return;
    }

    if (storedUser.role !== "admin") {
      navigate("/dashboard");
      return;
    }

    loadAdminData();
  }, []);

  const loadAdminData = async (query = "") => {
    try {
      setLoading(true);

      const [statsRes, usersRes, withdrawalsRes, stepLogsRes, goalsRes] = await Promise.all([
        API.get("/admin/stats"),
        API.get("/admin/users", { params: query ? { search: query } : {} }),
        API.get("/admin/withdrawals"),
        API.get("/admin/step-logs"),
        API.get("/admin/goals")
      ]);

      setStats(statsRes.data);
      setUsers(usersRes.data);
      setWithdrawals(withdrawalsRes.data);
      setStepLogs(stepLogsRes.data);
      setGoals(goalsRes.data);
    } catch (error) {
      console.error(error);
      alert("Unable to load admin data");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    loadAdminData(search.trim());
  };

  const handleGoalChange = (e) => {
    setGoalForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const createGoal = async (e) => {
    e.preventDefault();

    try {
      const { data } = await API.post("/admin/goals", goalForm);
      setGoals((prev) => [...prev, data].sort((a, b) => a.stepsRequired - b.stepsRequired));
      setGoalForm({
        title: "",
        badgeLabel: "",
        stepsRequired: "",
        bonusCoins: "",
        color: "#00ffcc"
      });
      alert("Goal created");
    } catch (error) {
      console.error(error);
      alert("Unable to create goal");
    }
  };

  if (loading && !stats) {
    return (
      <div className="admin-page">
        <div className="admin-shell">
          <h1>Admin Dashboard</h1>
          <p className="admin-muted">Loading admin data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-shell">
        <div className="admin-hero">
          <div>
            <p className="admin-kicker">Control Center</p>
            <h1>Move2Earn Admin Dashboard</h1>
            <p className="admin-muted">
              Review platform growth, monitor withdrawals, and spot suspicious activity.
            </p>
          </div>

          <button onClick={() => loadAdminData(search.trim())}>
            Refresh Data
          </button>
        </div>

        <div className="admin-stats-grid">
          <div className="admin-stat-card">
            <span>Total Users</span>
            <strong>{stats?.totalUsers ?? 0}</strong>
          </div>

          <div className="admin-stat-card">
            <span>Total Steps</span>
            <strong>{stats?.totalSteps ?? 0}</strong>
          </div>

          <div className="admin-stat-card">
            <span>Total Coins</span>
            <strong>{stats?.totalCoins ?? 0}</strong>
          </div>

          <div className="admin-stat-card">
            <span>Total Withdrawn</span>
            <strong>{stats?.totalWithdrawn ?? 0}</strong>
          </div>

          <div className="admin-stat-card admin-stat-card--accent">
            <span>New Users Last 7 Days</span>
            <strong>{stats?.newUsersLast7Days ?? 0}</strong>
          </div>
        </div>

        <section className="admin-panel">
          <div className="admin-panel-header">
            <div>
              <h2>Goal Badge Manager</h2>
              <p className="admin-muted">Create milestone tags users can unlock by reaching step targets.</p>
            </div>
          </div>

          <div className="admin-goal-layout">
            <form className="admin-goal-form" onSubmit={createGoal}>
              <input
                type="text"
                name="title"
                placeholder="Goal title"
                value={goalForm.title}
                onChange={handleGoalChange}
                required
              />
              <input
                type="text"
                name="badgeLabel"
                placeholder="Badge label"
                value={goalForm.badgeLabel}
                onChange={handleGoalChange}
                required
              />
              <input
                type="number"
                name="stepsRequired"
                placeholder="Steps required"
                min="1"
                value={goalForm.stepsRequired}
                onChange={handleGoalChange}
                required
              />
              <input
                type="number"
                name="bonusCoins"
                placeholder="Bonus coins"
                min="0"
                value={goalForm.bonusCoins}
                onChange={handleGoalChange}
              />
              <input
                type="text"
                name="color"
                placeholder="Badge color"
                value={goalForm.color}
                onChange={handleGoalChange}
              />
              <button type="submit">Create Goal</button>
            </form>

            <div className="admin-goal-list">
              {goals.length === 0 ? (
                <p className="admin-muted">No goals created yet.</p>
              ) : (
                goals.map((goal) => (
                  <div key={goal._id} className="admin-goal-card">
                    <span
                      className="admin-goal-badge"
                      style={{ backgroundColor: goal.color }}
                    >
                      {goal.badgeLabel}
                    </span>
                    <h3>{goal.title}</h3>
                    <p>{goal.stepsRequired} steps</p>
                    <p>{goal.bonusCoins || 0} bonus coins</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        <section className="admin-panel">
          <div className="admin-panel-header">
            <div>
              <h2>User Management</h2>
              <p className="admin-muted">Search by name, email, or wallet address.</p>
            </div>

            <form className="admin-search" onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button type="submit">Search</button>
            </form>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Wallet</th>
                  <th>Steps</th>
                  <th>Coins</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>{user.walletAddress}</td>
                    <td>{user.totalSteps}</td>
                    <td>{user.coins}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <div className="admin-grid">
          <section className="admin-panel">
            <div className="admin-panel-header">
              <div>
                <h2>Recent Withdrawals</h2>
                <p className="admin-muted">Latest payout activity across the app.</p>
              </div>
            </div>

            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Wallet</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {withdrawals.map((item) => (
                    <tr key={item._id}>
                      <td>{item.userId?.name || "Unknown"}</td>
                      <td>{item.amount}</td>
                      <td>{item.status}</td>
                      <td>{item.walletAddress}</td>
                      <td>{new Date(item.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="admin-panel">
            <div className="admin-panel-header">
              <div>
                <h2>Step Log Monitor</h2>
                <p className="admin-muted">Flags entries with unusually high step counts.</p>
              </div>
            </div>

            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Steps</th>
                    <th>Coins</th>
                    <th>Risk</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {stepLogs.map((log) => (
                    <tr key={log._id} className={log.suspicious ? "admin-danger-row" : ""}>
                      <td>{log.userId?.name || "Unknown"}</td>
                      <td>{log.steps}</td>
                      <td>{log.coinsEarned}</td>
                      <td>{log.suspicious ? "Review" : "Normal"}</td>
                      <td>{new Date(log.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Admin;
