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

/* =========================
   ✅ FIXED CORS (IMPORTANT)
========================= */
const allowedOrigins = [
  "http://localhost:5173",
  "https://english-learning-app-bay.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true); // allow all (safe for now)
    }
  },
  credentials: true
}));

// Body parser
app.use(express.json());

/* =========================
   ROUTES
========================= */
app.use("/api/auth", authRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/lessons", lessonRoutes);
app.use('/api/quizzes', quizRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api", otherRoutes);

/* =========================
   QUIZ SYSTEM
========================= */

let quizzes = [
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

// Create Quiz
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
    res.json({ success: true, quiz: newQuiz });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get quizzes
app.get("/api/quizzes", (req, res) => {
  res.json(quizzes);
});

// Get single quiz
app.get("/api/quizzes/:id", (req, res) => {
  const quiz = quizzes.find(q => q._id === req.params.id);
  if (!quiz) return res.status(404).json({ message: "Quiz not found" });
  res.json(quiz);
});

/* =========================
   STATIC API ENDPOINTS
========================= */

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

app.get("/api/student/announcements", (req, res) => {
  res.json([
    "New assignment due tomorrow",
    "New lesson added",
    "Live session Friday",
    "Quiz available"
  ]);
});

app.get("/api/teacher/stats", (req, res) => {
  res.json({
    lessons: 12,
    assignments: 8,
    students: 42,
    averageProgress: 78
  });
});

app.get("/api/teacher/recent-activity", (req, res) => {
  res.json([
    { student: "Bushra Qayyum", action: "submitted assignment", time: "2 min ago" }
  ]);
});

/* =========================
   MONGODB
========================= */

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB Connected");

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

      console.log("Admin Created");
    }
  })
  .catch(err => console.log(err));

/* =========================
   SERVER
========================= */

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});

/* =========================
   SOCKET IO
========================= */

const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});