// backend/server.js
import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from "bcryptjs";
import { Server } from "socket.io";

// Routes
import authRoutes from "./routes/auth.js";
import studentRoutes from "./routes/studentRoutes.js";
import assignmentRoutes from "./routes/assignmentRoutes.js";
import lessonRoutes from "./routes/lessonRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import otherRoutes from "./routes/otherRoutes.js";
import quizRoutes from './routes/quizRoutes.js';

// Models
import User from "./models/User.js";

const app = express();

// CORS — Frontend ko allow kar
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

// Body parser
app.use(express.json());

// All Routes
app.use("/api/auth", authRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/lessons", lessonRoutes);
app.use('/api/quizzes', quizRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api", otherRoutes);

// === REAL QUIZ SYSTEM (IN-MEMORY) ===

// In-memory storage for quizzes
let quizzes = [];

// Default quiz taake test kar sake
quizzes = [
  {
    _id: "default1",
    title: "Basic English Quiz",
    description: "Test your basic knowledge",
    questions: [
      { type: "mcq", question: "What is the opposite of 'happy'?", options: ["Sad", "Joyful", "Excited", "Calm"], answer: "Sad" },
      { type: "fill", question: "The capital of Pakistan is _____.", answer: "Islamabad" }
    ],
    attempts: 0,
    averageScore: 0,
    createdAt: new Date()
  }
];

// Create Quiz (Teacher)
app.post("/api/quizzes", (req, res) => {
  try {
    const { title, description, questions } = req.body;

    if (!title || !description || !questions || questions.length === 0) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newQuiz = {
      _id: Date.now().toString(),
      title,
      description,
      questions,
      attempts: 0,
      averageScore: 0,
      createdAt: new Date()
    };

    quizzes.push(newQuiz);
    console.log("New quiz created:", newQuiz.title);
    res.json({ success: true, message: "Quiz created successfully!", quiz: newQuiz });
  } catch (error) {
    console.error("Create quiz error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all quizzes
app.get("/api/quizzes", (req, res) => {
  console.log("Sending", quizzes.length, "quizzes to frontend");
  res.json(quizzes);
});

// Get single quiz
app.get("/api/quizzes/:id", (req, res) => {
  const quiz = quizzes.find(q => q._id === req.params.id);
  if (quiz) {
    console.log("Quiz found and sent:", quiz.title);
    res.json(quiz);
  } else {
    console.log("Quiz not found for id:", req.params.id);
    res.status(404).json({ message: "Quiz not found" });
  }
});

// === BAQI ENDPOINTS SAME RAHENGE ===

// Student Dashboard Stats
app.get("/api/student/stats", (req, res) => {
  res.json({
    totalLessons: 15,
    completedLessons: 10,
    pendingAssignments: 4,
    completedAssignments: 6,
    totalPoints: 2850,
    currentStreak: 9
  });
});

// Student Announcements
app.get("/api/student/announcements", (req, res) => {
  res.json([
    "New assignment: Write an Essay on My Hobby (Due: Jan 15)",
    "New lesson: Advanced Grammar added",
    "Live session scheduled for Friday at 6 PM",
    "Vocabulary Quiz 2 is now open!"
  ]);
});

// Teacher Stats
app.get("/api/teacher/stats", (req, res) => {
  res.json({
    lessons: 12,
    assignments: 8,
    students: 42,
    averageProgress: 78
  });
});

// Teacher Recent Activity
app.get("/api/teacher/recent-activity", (req, res) => {
  res.json([
    { student: "Bushra Qayyum", action: "submitted assignment 'Grammar Basics'", time: "2 minutes ago" },
    { student: "Ali Khan", action: "completed Speech Quiz", time: "15 minutes ago" },
    { student: "Sara Ahmed", action: "submitted assignment 'Essay Writing'", time: "1 hour ago" },
    { student: "Zainab Fatima", action: "completed lesson 'Vocabulary'", time: "2 hours ago" }
  ]);
});

// Student Live Sessions
app.get("/api/livesessions", (req, res) => {
  res.json([
    { _id: 1, topic: "Speaking Practice", date: "2025-01-10", time: "6:00 PM", status: "Upcoming" },
    { _id: 2, topic: "Grammar Q&A", date: "2025-01-12", time: "5:00 PM", status: "Upcoming" }
  ]);
});

// Community Threads
app.get("/api/community/threads", (req, res) => {
  res.json([
    { id: 1, author: "Teacher", content: "Reminder: Assignment due tomorrow!", replies: [] },
    { id: 2, author: "Ali Khan", content: "Sir, can you explain past tense?", replies: [{ author: "Teacher", content: "Yes, in next session." }] }
  ]);
});

// Teacher Students List
app.get("/api/teacher/students", (req, res) => {
  res.json({
    students: [
      { _id: 1, name: "Bushra Qayyum", email: "bushra@example.com", progress: 85, isActive: true },
      { _id: 2, name: "Ali Khan", email: "ali@example.com", progress: 70, isActive: true },
      { _id: 3, name: "Sara Ahmed", email: "sara@example.com", progress: 90, isActive: true }
    ],
    stats: { total: 42, active: 38, inactive: 4 }
  });
});

// Assignment Submit
app.post("/api/assignments/:id/submit", (req, res) => {
  console.log("Assignment submitted:", req.body);
  res.json({ message: "Assignment submitted successfully!" });
});

// MongoDB Connection + Auto Admin Create
mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB Connected Successfully!");

    const adminEmail = (process.env.ADMIN_EMAIL || "admin@englishapp.com").toLowerCase();
    const adminPassword = process.env.ADMIN_PASSWORD || "Admin@123";

    const existingAdmin = await User.findOne({ email: adminEmail });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      await User.create({
        name: "Admin",
        email: adminEmail,
        password: hashedPassword,
        role: "admin",
        isActive: true
      });
      console.log(`Admin Created → Email: ${adminEmail} | Password: ${adminPassword}`);
    } else {
      console.log(`Admin Already Exists → ${adminEmail}`);
    }
  })
  .catch((err) => {
    console.error("MongoDB Connection Failed:", err);
  });

// Server Start
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server is Running on http://localhost:${PORT}`);
  console.log(`Frontend URL → http://localhost:5173`);
});

// Socket.IO Setup
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true
  }
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("submitAssignment", (data) => {
    io.emit("newSubmission", data);
  });

  socket.on("completeLesson", (data) => {
    io.emit("newLessonCompletion", data);
  });

  socket.on("createAssignment", (data) => {
    io.emit("newAssignment", data);
  });

  socket.on("createLesson", (data) => {
    io.emit("newLesson", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});