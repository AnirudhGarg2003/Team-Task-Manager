import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";

function ProjectCard({ project, user, refreshProjects }) {
  const [newMemberId, setNewMemberId] = useState("");
  const [taskTitle, setTaskTitle] = useState("");
  const [taskAssignee, setTaskAssignee] = useState("");
  const [taskDeadline, setTaskDeadline] = useState("");

  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      await api.post("/projects/add-member", { projectId: project.id, userId: Number(newMemberId) });
      setNewMemberId("");
      refreshProjects();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add member");
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await api.post("/tasks", {
        title: taskTitle,
        projectId: project.id,
        assignedTo: Number(taskAssignee),
        deadline: taskDeadline
      });
      setTaskTitle("");
      setTaskAssignee("");
      setTaskDeadline("");
      refreshProjects();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create task");
    }
  };

  const handleDeleteProject = async () => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    try {
      await api.delete(`/projects/${project.id}`);
      refreshProjects();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete project");
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await api.delete(`/tasks/${taskId}`);
      refreshProjects();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete task");
    }
  };

  const getBadgeClass = (status) => {
    if (status === "DONE") return "badge-done";
    if (status === "IN_PROGRESS") return "badge-progress";
    return "badge-pending";
  };

  const getAssigneeName = (assignedToId) => {
    const member = project.members.find(m => m.id === assignedToId);
    return member ? `${member.name} #${member.id}` : `ID: ${assignedToId}`;
  };

  return (
    <div className="card project-card">
      <div className="project-header">
        <div>
          <h3 style={{ fontSize: "1.25rem", color: "var(--text-dark)", marginBottom: "4px" }}>{project.name}</h3>
          <span className="item-meta">Project ID: {project.id} | Created By: {project.createdBy}</span>
        </div>
        {user.role === "ADMIN" && (
          <button onClick={handleDeleteProject} className="btn btn-danger">Delete Project</button>
        )}
      </div>

      <div className="project-grid">
        {/* MEMBERS SECTION */}
        <div>
          <h4 className="section-title">Team Members</h4>
          <div style={{ marginBottom: "16px" }}>
            {project.members.map(m => (
              <span key={m.id} className="member-pill">
                {m.name} <span style={{ color: "var(--text-muted)" }}>#{m.id}</span>
              </span>
            ))}
          </div>

          {user.role === "ADMIN" && (
            <form onSubmit={handleAddMember} style={{ display: "flex", gap: "8px" }}>
              <input type="number" className="form-control" value={newMemberId} onChange={e => setNewMemberId(e.target.value)} placeholder="User ID" required />
              <button type="submit" className="btn btn-primary" style={{ whiteSpace: "nowrap" }}>Add</button>
            </form>
          )}
        </div>

        {/* TASKS SECTION */}
        <div>
          <h4 className="section-title">Project Tasks</h4>
          <div className="task-list">
            {project.tasks && project.tasks.length > 0 ? (
              project.tasks.map(t => (
                <div key={t.id} className="task-row">
                  <div className="task-info">
                    <span className="task-title">{t.title}</span>
                    <span className="task-meta">Assigned to: {getAssigneeName(t.assignedTo)} | Due: {new Date(t.deadline).toLocaleDateString()}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span className={`badge ${getBadgeClass(t.status)}`}>{t.status}</span>
                    {user.role === "ADMIN" && (
                      <button onClick={() => handleDeleteTask(t.id)} className="btn btn-danger" style={{ padding: "4px 8px", fontSize: "0.75rem" }}>Delete</button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>No tasks created yet.</p>
            )}
          </div>

          {user.role === "ADMIN" && (
            <form onSubmit={handleCreateTask} style={{ marginTop: "24px", paddingTop: "20px", borderTop: "1px dashed var(--border-color)" }}>
              <h5 style={{ marginBottom: "12px", color: "var(--text-dark)" }}>Assign New Task</h5>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
                <input type="text" className="form-control" style={{ gridColumn: "1 / -1" }} value={taskTitle} onChange={e => setTaskTitle(e.target.value)} placeholder="Task Title" required />
                <select className="form-control" value={taskAssignee} onChange={e => setTaskAssignee(e.target.value)} required>
                  <option value="">Select Assignee...</option>
                  {project.members.map(m => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
                <input type="date" className="form-control" value={taskDeadline} onChange={e => setTaskDeadline(e.target.value)} required />
              </div>
              <button type="submit" className="btn btn-success" style={{ width: "100%" }}>Create Task</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState("");
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await api.get("/projects");
      setProjects(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      await api.post("/projects", { name: newProject });
      setNewProject("");
      fetchProjects();
    } catch (err) {
      alert("Failed to create project");
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h2 className="page-title" style={{ marginBottom: 0 }}>Projects</h2>
        {user.role === "ADMIN" && (
          <form onSubmit={handleCreateProject} style={{ display: "flex", gap: "12px" }}>
            <input 
              type="text" 
              className="form-control"
              value={newProject} 
              onChange={(e) => setNewProject(e.target.value)} 
              placeholder="New Project Name" 
              required 
            />
            <button type="submit" className="btn btn-primary" style={{ whiteSpace: "nowrap" }}>Create Project</button>
          </form>
        )}
      </div>

      <div>
        {projects.map((p) => (
          <ProjectCard key={p.id} project={p} user={user} refreshProjects={fetchProjects} />
        ))}
        {projects.length === 0 && (
          <div className="card" style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>
            No projects available.
          </div>
        )}
      </div>
    </div>
  );
}
