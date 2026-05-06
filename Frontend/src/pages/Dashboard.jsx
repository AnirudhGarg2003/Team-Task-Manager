import { useState, useEffect } from "react";
import api from "../services/api";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get("/dashboard");
        setStats(res.data.data);
      } catch (err) {
        setError("Failed to load dashboard");
      }
    };
    fetchDashboard();
  }, []);

  if (error) return <p style={{ color: "var(--danger)" }}>{error}</p>;
  if (!stats) return <p>Loading dashboard...</p>;

  return (
    <div>
      <h2 className="page-title">Dashboard Overview</h2>
      <div className="stats-grid">
        <div className="card stat-card">
          <span className="stat-title">Total Tasks</span>
          <span className="stat-value" style={{color: "var(--primary)"}}>{stats.total}</span>
        </div>
        <div className="card stat-card">
          <span className="stat-title">Pending</span>
          <span className="stat-value" style={{color: "var(--warning)"}}>{stats.pending}</span>
        </div>
        <div className="card stat-card">
          <span className="stat-title">Completed</span>
          <span className="stat-value" style={{color: "var(--success)"}}>{stats.completed}</span>
        </div>
        <div className="card stat-card">
          <span className="stat-title">Overdue</span>
          <span className="stat-value" style={{color: "var(--danger)"}}>{stats.overdue}</span>
        </div>
      </div>
    </div>
  );
}
