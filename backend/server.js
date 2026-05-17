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
// CORS FIXED (PRODUCTION)
// =======================
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://english-learning-app-bay.vercel.app"
  ],
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
// MONGODB
// =======================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// =======================
// SERVER
// =======================
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});

// =======================
// SOCKET IO FIXED
// =======================
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://english-learning-app-bay.vercel.app"
    ],
    credentials: true
  }
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});