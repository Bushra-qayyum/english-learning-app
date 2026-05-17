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
import quizRoutes from "./routes/quizRoutes.js";

// Models
import User from "./models/User.js";

const app = express();

// =======================
// CORS (PRODUCTION SAFE)
// =======================
const allowedOrigins = [
  "http://localhost:5173",
  "https://english-learning-app-bay.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(null, true); // temporary open (safe for debugging)
  },
  credentials: true
}));

app.use(express.json());

// =======================
// ROUTES
// =======================
app.use("/api/auth", authRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/lessons", lessonRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api", otherRoutes);

// =======================
// MONGODB (FIXED + SAFE)
// =======================
mongoose
  .connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 10000,
  })
  .then(() => {
    console.log("✅ MongoDB Connected Successfully");
  })
  .catch((err) => {
    console.log("❌ MongoDB Connection Error:", err.message);
  });

// =======================
// SERVER
// =======================
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on ${PORT}`);
});

// =======================
// SOCKET IO
// =======================
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true
  }
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});