import express from "express";
import {
  createProjectController,
  addMemberController,
  getProjectsController,
  deleteProjectController,
} from "../controllers/project.controller.js";

import { authMiddleware } from "../middleware/auth.middleware.js";
import { requireAdmin } from "../middleware/role.middleware.js";

const router = express.Router();

// CREATE PROJECT (Admin only)
router.post("/", authMiddleware, requireAdmin, createProjectController);

// ADD MEMBER (Admin only)
router.post("/add-member", authMiddleware, requireAdmin, addMemberController);

// GET PROJECTS (all logged-in users)
router.get("/", authMiddleware, getProjectsController);

// DELETE PROJECT (Admin only)
router.delete("/:id", authMiddleware, requireAdmin, deleteProjectController);

export default router;