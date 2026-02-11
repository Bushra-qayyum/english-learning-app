// backend/routes/adminRoutes.js
import express from "express";
import { verifyToken, requireAdmin } from "../middleware/authMiddleware.js";
import {
  getDashboardStats,
  getRecentData,
  getAllUsers,
  updateUserRole,
  toggleUserActive,
  deleteUser,
  getAnalyticsData
} from "../controllers/adminController.js";

const router = express.Router();

router.use(verifyToken, requireAdmin); // Yeh upar laga do taaki sab routes protected hon

router.get("/stats", getDashboardStats);
router.get("/recent", getRecentData);
router.get("/users", getAllUsers);
router.put("/users/:id/role", updateUserRole);
router.put("/users/:id/toggle", toggleUserActive);
router.delete("/users/:id", deleteUser);
router.get("/analytics", getAnalyticsData);

export default router;