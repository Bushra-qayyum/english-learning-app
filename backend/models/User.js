import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ["student", "teacher", "admin"], 
    default: "student" 
  },
  isActive: { type: Boolean, default: true },

  // GAMIFICATION & PROGRESS
  points: { type: Number, default: 0 },
  badges: [{ type: String }],
  streak: { type: Number, default: 0 },
  lastActiveDate: { type: Date },

  // Completed items
  completedLessons: [{ 
    lessonId: { type: mongoose.Schema.Types.ObjectId, ref: "Lesson" },
    completedAt: Date 
  }],
  completedAssignments: [{ 
    assignmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Assignment" },
    score: Number,
    completedAt: Date 
  }],
  completedQuizzes: [{ 
    quizId: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz" },
    score: Number,
    maxScore: Number,
    percentage: Number,
    isPassed: Boolean,
    completedAt: Date 
  }],
  quizAttempts: [{
    quizId: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz" },
    attemptId: { type: mongoose.Schema.Types.ObjectId, ref: "QuizAttempt" },
    score: Number,
    completedAt: Date
  }]

}, { timestamps: true });

export default mongoose.model("User", userSchema);