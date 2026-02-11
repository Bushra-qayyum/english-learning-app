// backend/models/Assignment.js
import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  studentName: String,
  answer: String,
  submittedAt: { type: Date, default: Date.now }
});

const assignmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  deadline: Date,
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  submissions: [submissionSchema],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Assignment", assignmentSchema);