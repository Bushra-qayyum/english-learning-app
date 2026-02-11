import express from 'express';
import {
  createQuiz,
  getTeacherQuizzes,
  getPublishedQuizzes,
  getQuiz,
  startQuizAttempt,
  submitQuiz,
  getQuizResults,
  getStudentAttempts,
  getQuizAttempts,
  updateQuiz,
  deleteQuiz,
  getQuizStatistics
} from '../controllers/quizController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authMiddleware);

// Teacher routes
router.post('/', createQuiz);
router.get('/teacher', getTeacherQuizzes);
router.get('/teacher/statistics', getQuizStatistics);
router.get('/teacher/:id/attempts', getQuizAttempts);
router.put('/:id', updateQuiz);
router.delete('/:id', deleteQuiz);

// Student routes
router.get('/published', getPublishedQuizzes);
router.get('/student/attempts', getStudentAttempts);
router.get('/:id', getQuiz);
router.post('/:id/start', startQuizAttempt);
router.post('/submit', submitQuiz);
router.get('/results/:attemptId', getQuizResults);

export default router;