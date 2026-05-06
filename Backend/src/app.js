import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import projectRoutes from "./routes/project.routes.js"
import taskRoutes from "./routes/task.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";


const app = express();

const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(",") 
  : ["http://localhost:5173"];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(express.json());

app.use("/auth", authRoutes);

app.use("/projects", projectRoutes)

app.use("/tasks", taskRoutes)

app.use("/dashboard", dashboardRoutes)

export default app;