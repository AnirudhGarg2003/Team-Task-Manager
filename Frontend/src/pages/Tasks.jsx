import { useState, useEffect } from "react";
import api from "../services/api";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await api.get("/tasks");
      setTasks(res.data.data);
    } catch (err) {
      console.error("Failed to fetch tasks");
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await api.put(`/tasks/${taskId}`, { status: newStatus });
      fetchTasks();
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const getBadgeClass = (status) => {
    if (status === "DONE") return "badge-done";
    if (status === "IN_PROGRESS") return "badge-progress";
    return "badge-pending";
  };

  return (
    <div>
      <h2 className="page-title">My Assigned Tasks</h2>
      <div className="item-list">
        {tasks.map(t => (
          <div key={t.id} className="item-card">
            <div className="item-details">
              <h4>{t.title}</h4>
              <div className="item-meta">
                Due: {new Date(t.deadline).toLocaleDateString()}
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <span className={`badge ${getBadgeClass(t.status)}`}>{t.status}</span>
              <select 
                className="form-control" 
                style={{ width: "150px" }}
                value={t.status} 
                onChange={(e) => handleStatusChange(t.id, e.target.value)}
              >
                <option value="PENDING">PENDING</option>
                <option value="IN_PROGRESS">IN_PROGRESS</option>
                <option value="DONE">DONE</option>
              </select>
            </div>
          </div>
        ))}
        {tasks.length === 0 && <p style={{ color: "var(--text-muted)" }}>You have no tasks assigned to you right now.</p>}
      </div>
    </div>
  );
}
