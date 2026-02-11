// backend/routes/otherRoutes.js
import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import User from "../models/User.js";

const router = express.Router();

// Leaderboard - Top 10 Students by Points
router.get("/leaderboard", verifyToken, async (req, res) => {
  try {
    const topStudents = await User.find({ role: "student" })
      .sort({ points: -1 })
      .limit(10)
      .select("name points");

    if (topStudents.length === 0) {
      return res.json([{ name: "No students yet", points: 0 }]);
    }

    res.json(topStudents);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Temporary fake quizzes (jab tak real na banao)
router.get("/quizzes", verifyToken, (req, res) => {
  res.json([
    { _id: "1", title: "Basic Grammar Quiz", questions: 10 },
    { _id: "2", title: "Vocabulary Challenge", questions: 15 },
    { _id: "3", title: "Speaking Practice", questions: 5 }
  ]);
});

export default router;