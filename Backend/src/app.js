import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import projectRoutes from "./routes/project.routes.js"
import taskRoutes from "./routes/task.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";


const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);

app.use("/projects", projectRoutes)

app.use("/tasks", taskRoutes)

app.use("/dashboard", dashboardRoutes)

export default app;