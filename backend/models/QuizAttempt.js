import mongoose from "mongoose";

const answerSchema = new mongoose.Schema({
  questionId: mongoose.Schema.Types.ObjectId,
  questionIndex: Number,
  questionType: String,
  studentAnswer: mongoose.Schema.Types.Mixed, // Can be string, array, boolean, etc.
  selectedOptions: [String],
  isCorrect: Boolean,
  pointsEarned: {
    type: Number,
    default: 0
  },
  feedback: String,
  timeSpent: Number // in seconds
});

const quizAttemptSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  studentName: String,
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true
  },
  quizTitle: String,
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  },
  lessonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson'
  },
  answers: [answerSchema],
  score: {
    type: Number,
    default: 0
  },
  totalScore: {
    type: Number,
    required: true
  },
  percentage: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['in-progress', 'submitted', 'graded', 'expired'],
    default: 'in-progress'
  },
  startTime: {
    type: Date,
    default: Date.now
  },
  endTime: Date,
  timeTaken: Number, // in seconds
  timeLeft: Number, // in seconds when quiz was submitted
  isPassed: Boolean,
  attemptNumber: {
    type: Number,
    default: 1
  },
  teacherFeedback: String,
  autoGraded: {
    type: Boolean,
    default: false
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewedAt: Date
}, { timestamps: true });

// Calculate percentage before saving
quizAttemptSchema.pre('save', function(next) {
  if (this.score !== undefined && this.totalScore > 0) {
    this.percentage = Math.round((this.score / this.totalScore) * 100);
    this.isPassed = this.percentage >= 70; // Default passing threshold
  }
  
  if (this.startTime && this.endTime) {
    this.timeTaken = Math.floor((this.endTime - this.startTime) / 1000);
  }
  
  next();
});

export default mongoose.model('QuizAttempt', quizAttemptSchema);