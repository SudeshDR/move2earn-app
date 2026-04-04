import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="navbar">
      <div className="navbar-logo">Move2earn⚡</div>

      <div className="navbar-links">
        {user && <Link to="/dashboard">Dashboard</Link>}
        {user?.role === "admin" && <Link to="/admin">Admin</Link>}
        {!user && <Link to="/">Login</Link>}
        {!user && <Link to="/signup">Signup</Link>}
      </div>

      {user && (
        <button className="navbar-button" onClick={logout}>
          Logout
        </button>
      )}
    </div>
  );
}

export default Navbar;
