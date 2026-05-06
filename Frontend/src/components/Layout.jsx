import { Outlet, Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Layout() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="app-container">
      <nav className="sidebar">
        <h3>Team Task Manager</h3>
        <div className="sidebar-user">
          <strong>{user.name}</strong><br/>
          Role: {user.role}
        </div>
        <div className="nav-menu">
          <Link to="/dashboard" className="nav-link">Dashboard</Link>
          <Link to="/projects" className="nav-link">Projects</Link>
          <Link to="/tasks" className="nav-link">My Tasks</Link>
        </div>
        <button onClick={handleLogout} className="btn btn-outline" style={{marginTop: "auto"}}>Logout</button>
      </nav>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
