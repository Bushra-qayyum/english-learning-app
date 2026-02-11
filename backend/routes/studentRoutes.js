// backend/routes/studentRoutes.js
import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import User from "../models/User.js";
import Lesson from "../models/Lesson.js";
import Assignment from "../models/Assignment.js";

const router = express.Router();

// Progress
router.get("/progress", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const totalLessons = await Lesson.countDocuments();
    const totalAssignments = await Assignment.countDocuments();

    res.json({
      lessons: totalLessons ? Math.round((user.completedLessons.length / totalLessons) * 100) : 0,
      assignments: totalAssignments ? Math.round((user.completedAssignments?.length || 0) / totalAssignments) * 100 : 0,
      quizzes: 85,
      points: user.points || 0,
      streak: user.streak || 0
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Leaderboard
router.get("/leaderboard", verifyToken, async (req, res) => {
  try {
    const top = await User.find({ role: "student" })
      .sort({ points: -1 })
      .limit(10)
      .select("name points");
    res.json(top.length ? top : [{ name: "No data yet", points: 0 }]);
  } catch (err) {
    res.status(500).json({ message: "Error" });
  }
});

// Speech Score
router.post("/speech-score", verifyToken, async (req, res) => {
  try {
    const { score } = req.body;
    const user = await User.findById(req.user._id);
    user.points += Math.round(score);
    await user.save();
    res.json({ message: "Score saved!", points: user.points });
  } catch (err) {
    res.status(500).json({ message: "Error" });
  }
});

export default router;