import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  questionType: {
    type: String,
    enum: ['multiple-choice', 'true-false', 'fill-blank', 'matching', 'short-answer'],
    required: true
  },
  questionText: {
    type: String,
    required: true
  },
  options: [{
    text: String,
    isCorrect: Boolean,
    imageUrl: String
  }],
  correctAnswer: String, // For fill-blank, short-answer, etc.
  explanation: String,
  points: {
    type: Number,
    default: 1
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  imageUrl: String,
  audioUrl: String, // For listening comprehension questions
  timeLimit: Number // in seconds for individual question
}, { _id: true });

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  },
  lessonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  teacherName: String,
  questions: [questionSchema],
  totalPoints: {
    type: Number,
    default: 0
  },
  passingScore: {
    type: Number,
    default: 70
  },
  timeLimit: {
    type: Number,
    default: 30,
    description: "Overall quiz time limit in minutes"
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  attemptsAllowed: {
    type: Number,
    default: 1
  },
  shuffleQuestions: {
    type: Boolean,
    default: false
  },
  showResults: {
    type: Boolean,
    default: true
  },
  showCorrectAnswers: {
    type: Boolean,
    default: true
  },
  startDate: Date,
  endDate: Date,
  tags: [String], // e.g., ["grammar", "vocabulary", "listening"]
  languageLevel: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'intermediate'
  },
  category: {
    type: String,
    enum: ['grammar', 'vocabulary', 'reading', 'listening', 'writing', 'speaking'],
    default: 'grammar'
  },
  attemptsCount: {
    type: Number,
    default: 0
  },
  averageScore: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

// Calculate total points before saving
quizSchema.pre('save', function(next) {
  this.totalPoints = this.questions.reduce((total, question) => total + question.points, 0);
  next();
});

// Virtual for getting quiz status
quizSchema.virtual('status').get(function() {
  const now = new Date();
  if (this.startDate && now < this.startDate) return 'scheduled';
  if (this.endDate && now > this.endDate) return 'expired';
  return this.isPublished ? 'active' : 'draft';
});

export default mongoose.model('Quiz', quizSchema);