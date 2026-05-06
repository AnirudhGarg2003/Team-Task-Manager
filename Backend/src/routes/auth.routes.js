import express from "express";
import { signup, login } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { requireAdmin } from "../middleware/role.middleware.js";

const router = express.Router();

/*
========================
 PUBLIC ROUTES
========================
*/
router.post("/signup", signup);
router.post("/login", login);

/*
========================
 ADMIN ONLY ROUTE (optional test)
========================
*/
router.get("/admin", authMiddleware, requireAdmin, (req, res) => {
  res.json({
    message: "Admin access granted",
  });
});

export default router;