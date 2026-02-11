// backend/routes/assignmentRoutes.js
import express from "express";
import Assignment from "../models/Assignment.js";
import User from "../models/User.js";
import { verifyToken, requireTeacher, requireStudent } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create assignment (Teacher only)
router.post("/", verifyToken, requireTeacher, async (req, res) => {
  try {
    const assignment = new Assignment({
      ...req.body,
      teacher: req.user._id
    });
    await assignment.save();
    res.status(201).json(assignment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all assignments
router.get("/", async (req, res) => {
  try {
    const assignments = await Assignment.find().populate("teacher", "name");
    res.json(assignments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get one assignment
router.get("/:id", async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) return res.status(404).json({ message: "Not found" });
    res.json(assignment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Student submits assignment
router.post("/:id/submit", verifyToken, requireStudent, async (req, res) => {
  try {
    const { answer } = req.body;
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) return res.status(404).json({ message: "Not found" });

    const alreadySubmitted = assignment.submissions.some(
      s => s.student?.toString() === req.user._id.toString()
    );

    if (alreadySubmitted) {
      return res.status(400).json({ message: "You have already submitted" });
    }

    assignment.submissions.push({
      student: req.user._id,
      studentName: req.user.name,
      answer
    });
    await assignment.save();

    // Give points for submission
    const user = await User.findById(req.user._id);
    user.points = (user.points || 0) + 50;
    await user.save();

    res.json({ message: "Submitted successfully!", points: user.points });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// TEACHER GIVES MARKS — YE ALAG SE HAI!
router.post("/:id/grade", verifyToken, requireTeacher, async (req, res) => {
  try {
    const { submissionId, marks } = req.body;
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) return res.status(404).json({ message: "Assignment not found" });

    const submission = assignment.submissions.id(submissionId);
    if (!submission) return res.status(404).json({ message: "Submission not found" });

    submission.marks = marks;
    await assignment.save();

    // Add marks to student's total points
    const student = await User.findById(submission.student);
    student.points = (student.points || 0) + marks;
    await student.save();

    res.json({ message: "Marks given successfully!", marks });
  } catch (err) {
    console.error("Grade error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router; // YE LINE SABSE LAST MEIN HOGI!