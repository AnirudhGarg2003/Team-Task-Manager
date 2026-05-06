import express from "express";
import {
  createTaskController,
  getTasksController,
  updateTaskController,
  deleteTaskController,
} from "../controllers/task.controller.js";

import { authMiddleware } from "../middleware/auth.middleware.js";
import { requireAdmin } from "../middleware/role.middleware.js";

const router = express.Router();

// CREATE TASK (Admin only)
router.post("/", authMiddleware, requireAdmin, createTaskController);

// GET TASKS (user-specific)
router.get("/", authMiddleware, getTasksController);

// UPDATE STATUS (any assigned user)
router.put("/:id", authMiddleware, updateTaskController);

// DELETE TASK (Admin only)
router.delete("/:id", authMiddleware, requireAdmin, deleteTaskController);

export default router;