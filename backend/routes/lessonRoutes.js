// backend/routes/lessonRoutes.js
import express from "express";
import Lesson from "../models/Lesson.js";
import User from "../models/User.js";
import { verifyToken, requireTeacher } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET ALL LESSONS
router.get("/", async (req, res) => {
  try {
    const lessons = await Lesson.find().populate("teacher", "name");
    res.json(lessons);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET SINGLE LESSON
router.get("/:id", async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id)
      .populate("teacher", "name")
      .populate("completedBy", "name"); // Bonus: students name bhi dikhega
    if (!lesson) return res.status(404).json({ message: "Lesson not found" });
    res.json(lesson);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// CREATE LESSON (Teacher only)
router.post("/", verifyToken, requireTeacher, async (req, res) => {
  try {
    const lesson = new Lesson({
      ...req.body,
      teacher: req.user._id
    });
    await lesson.save();
    res.status(201).json(lesson);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// MARK AS COMPLETE - WORKING 100%
router.post("/:id/complete", verifyToken, async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) return res.status(404).json({ message: "Lesson not found" });

    const user = await User.findById(req.user._id);
    if (!user.completedLessons.includes(req.params.id)) {
      user.completedLessons.push(req.params.id);
      user.points = (user.points || 0) + 100;
      await user.save();

      lesson.completedBy = lesson.completedBy || [];
      if (!lesson.completedBy.includes(req.user._id)) {
        lesson.completedBy.push(req.user._id);
        await lesson.save();
      }
    }

    res.json({ 
      message: "Lesson completed successfully!", 
      points: user.points 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;