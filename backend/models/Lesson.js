// backend/models/Lesson.js
import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  content: { type: String },
  videoUrl: String,
  audioUrl: String,
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  completedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Sirf ek baar
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Lesson", lessonSchema);