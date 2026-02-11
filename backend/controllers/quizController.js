import Quiz from '../models/Quiz.js';
import QuizAttempt from '../models/QuizAttempt.js';
import User from '../models/User.js';

// Create a new quiz (Teacher only)
export const createQuiz = async (req, res) => {
  try {
    const { 
      title, 
      description, 
      questions, 
      courseId, 
      lessonId,
      timeLimit,
      passingScore,
      attemptsAllowed,
      shuffleQuestions,
      showResults,
      showCorrectAnswers,
      startDate,
      endDate,
      tags,
      languageLevel,
      category
    } = req.body;

    if (req.user.role !== 'teacher') {
      return res.status(403).json({ message: 'Only teachers can create quizzes' });
    }

    const quiz = new Quiz({
      title,
      description,
      questions,
      courseId,
      lessonId,
      createdBy: req.user.id,
      teacherName: req.user.name,
      timeLimit: timeLimit || 30,
      passingScore: passingScore || 70,
      attemptsAllowed: attemptsAllowed || 1,
      shuffleQuestions: shuffleQuestions || false,
      showResults: showResults !== undefined ? showResults : true,
      showCorrectAnswers: showCorrectAnswers !== undefined ? showCorrectAnswers : true,
      startDate,
      endDate,
      tags,
      languageLevel: languageLevel || 'intermediate',
      category: category || 'grammar',
      isPublished: false // Default to draft
    });

    await quiz.save();

    res.status(201).json({
      success: true,
      message: 'Quiz created successfully!',
      quiz
    });
  } catch (error) {
    console.error('Create quiz error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all quizzes for a teacher
export const getTeacherQuizzes = async (req, res) => {
  try {
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const quizzes = await Quiz.find({ createdBy: req.user.id })
      .sort({ createdAt: -1 })
      .select('-questions.options.isCorrect'); // Hide correct answers

    res.json({
      success: true,
      quizzes
    });
  } catch (error) {
    console.error('Get teacher quizzes error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all published quizzes for students
export const getPublishedQuizzes = async (req, res) => {
  try {
    const now = new Date();
    const quizzes = await Quiz.find({
      isPublished: true,
      $or: [
        { startDate: { $exists: false } },
        { startDate: { $lte: now } }
      ],
      $or: [
        { endDate: { $exists: false } },
        { endDate: { $gte: now } }
      ]
    })
    .sort({ createdAt: -1 })
    .select('-questions.options.isCorrect -questions.correctAnswer');

    res.json({
      success: true,
      quizzes
    });
  } catch (error) {
    console.error('Get published quizzes error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single quiz (teacher sees all, student sees without answers)
export const getQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // If user is teacher or admin, show everything
    if (req.user.role === 'teacher' || req.user.role === 'admin') {
      return res.json({
        success: true,
        quiz
      });
    }

    // For students, remove correct answers
    const studentQuiz = quiz.toObject();
    
    // Hide correct answers from questions
    studentQuiz.questions = studentQuiz.questions.map(question => {
      const q = { ...question };
      delete q.correctAnswer;
      
      // Hide which options are correct
      if (q.options) {
        q.options = q.options.map(option => ({
          text: option.text,
          imageUrl: option.imageUrl
        }));
      }
      
      return q;
    });

    // Check if student has already taken this quiz
    const previousAttempts = await QuizAttempt.find({
      studentId: req.user.id,
      quizId: quiz._id
    });

    res.json({
      success: true,
      quiz: studentQuiz,
      previousAttempts: previousAttempts.length,
      maxAttempts: quiz.attemptsAllowed
    });
  } catch (error) {
    console.error('Get quiz error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Start a quiz attempt
export const startQuizAttempt = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    if (!quiz.isPublished) {
      return res.status(400).json({ message: 'Quiz is not published yet' });
    }

    // Check if quiz has started
    if (quiz.startDate && new Date() < quiz.startDate) {
      return res.status(400).json({ message: 'Quiz has not started yet' });
    }

    // Check if quiz has ended
    if (quiz.endDate && new Date() > quiz.endDate) {
      return res.status(400).json({ message: 'Quiz has ended' });
    }

    // Check attempts limit
    const previousAttempts = await QuizAttempt.countDocuments({
      studentId: req.user.id,
      quizId: quiz._id
    });

    if (previousAttempts >= quiz.attemptsAllowed) {
      return res.status(400).json({ 
        message: `Maximum attempts (${quiz.attemptsAllowed}) reached` 
      });
    }

    // Create quiz attempt
    const attempt = new QuizAttempt({
      studentId: req.user.id,
      studentName: req.user.name,
      quizId: quiz._id,
      quizTitle: quiz.title,
      courseId: quiz.courseId,
      lessonId: quiz.lessonId,
      totalScore: quiz.totalPoints,
      attemptNumber: previousAttempts + 1,
      status: 'in-progress'
    });

    await attempt.save();

    // Prepare quiz for student (without answers)
    const studentQuiz = {
      ...quiz.toObject(),
      questions: quiz.questions.map(q => {
        const question = { ...q.toObject() };
        delete question.correctAnswer;
        
        if (question.options) {
          question.options = question.options.map(opt => ({
            text: opt.text,
            imageUrl: opt.imageUrl
          }));
        }
        
        return question;
      })
    };

    res.json({
      success: true,
      attemptId: attempt._id,
      quiz: studentQuiz,
      timeLimit: quiz.timeLimit * 60, // Convert to seconds
      startTime: attempt.startTime
    });
  } catch (error) {
    console.error('Start quiz error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Submit quiz answers
export const submitQuiz = async (req, res) => {
  try {
    const { attemptId, answers, timeLeft } = req.body;

    const attempt = await QuizAttempt.findOne({
      _id: attemptId,
      studentId: req.user.id,
      status: 'in-progress'
    });

    if (!attempt) {
      return res.status(404).json({ message: 'Attempt not found or already submitted' });
    }

    const quiz = await Quiz.findById(attempt.quizId);
    
    let totalScore = 0;
    const gradedAnswers = [];

    // Auto-grade answers
    for (let i = 0; i < answers.length; i++) {
      const studentAnswer = answers[i];
      const question = quiz.questions.find(q => 
        q._id.toString() === studentAnswer.questionId
      );

      if (!question) continue;

      let isCorrect = false;
      let pointsEarned = 0;

      // Auto-grading based on question type
      switch (question.questionType) {
        case 'multiple-choice':
          const selectedOptions = studentAnswer.selectedOptions || [];
          const correctOptions = question.options
            .filter(opt => opt.isCorrect)
            .map(opt => opt.text);
          
          // Check if all correct options are selected and no incorrect ones
          isCorrect = selectedOptions.length === correctOptions.length &&
            selectedOptions.every(opt => correctOptions.includes(opt)) &&
            correctOptions.every(opt => selectedOptions.includes(opt));
          break;

        case 'true-false':
          isCorrect = studentAnswer.studentAnswer === question.correctAnswer;
          break;

        case 'fill-blank':
          // Case insensitive comparison for fill in the blank
          isCorrect = studentAnswer.studentAnswer?.toLowerCase().trim() === 
                     question.correctAnswer?.toLowerCase().trim();
          break;

        case 'short-answer':
          // For short answer, we'll mark it as needs review
          isCorrect = false; // Needs teacher review
          break;

        default:
          isCorrect = false;
      }

      if (isCorrect) {
        pointsEarned = question.points;
        totalScore += pointsEarned;
      }

      gradedAnswers.push({
        questionId: studentAnswer.questionId,
        questionIndex: studentAnswer.questionIndex,
        questionType: question.questionType,
        studentAnswer: studentAnswer.studentAnswer,
        selectedOptions: studentAnswer.selectedOptions,
        isCorrect,
        pointsEarned,
        timeSpent: studentAnswer.timeSpent
      });
    }

    // Update attempt
    attempt.answers = gradedAnswers;
    attempt.score = totalScore;
    attempt.percentage = Math.round((totalScore / attempt.totalScore) * 100);
    attempt.endTime = new Date();
    attempt.timeLeft = timeLeft;
    attempt.status = 'submitted';
    attempt.autoGraded = true;
    attempt.isPassed = attempt.percentage >= quiz.passingScore;

    await attempt.save();

    // Update quiz statistics
    quiz.attemptsCount += 1;
    quiz.averageScore = ((quiz.averageScore * (quiz.attemptsCount - 1)) + attempt.percentage) / quiz.attemptsCount;
    await quiz.save();

    // Update student's progress
    await User.findByIdAndUpdate(req.user.id, {
      $addToSet: {
        quizAttempts: {
          quizId: attempt.quizId,
          attemptId: attempt._id,
          score: attempt.score,
          completedAt: attempt.endTime
        }
      },
      $inc: { points: totalScore * 10 } // Award points
    });

    res.json({
      success: true,
      message: 'Quiz submitted successfully!',
      result: {
        score: attempt.score,
        totalScore: attempt.totalScore,
        percentage: attempt.percentage,
        isPassed: attempt.isPassed,
        timeTaken: attempt.timeTaken,
        showResults: quiz.showResults,
        showCorrectAnswers: quiz.showCorrectAnswers
      }
    });
  } catch (error) {
    console.error('Submit quiz error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get quiz results for student
export const getQuizResults = async (req, res) => {
  try {
    const attempt = await QuizAttempt.findById(req.params.attemptId)
      .populate('quizId', 'title showCorrectAnswers');

    if (!attempt) {
      return res.status(404).json({ message: 'Attempt not found' });
    }

    // Verify ownership
    if (attempt.studentId.toString() !== req.user.id && req.user.role !== 'teacher') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const quiz = await Quiz.findById(attempt.quizId);

    // If quiz doesn't show correct answers, remove them
    if (!quiz.showCorrectAnswers && req.user.role === 'student') {
      const quizWithoutAnswers = { ...quiz.toObject() };
      quizWithoutAnswers.questions = quizWithoutAnswers.questions.map(q => {
        const question = { ...q };
        delete question.correctAnswer;
        if (question.options) {
          question.options = question.options.map(opt => ({
            text: opt.text,
            imageUrl: opt.imageUrl
          }));
        }
        return question;
      });
    }

    res.json({
      success: true,
      attempt,
      quiz: quiz.showCorrectAnswers || req.user.role === 'teacher' ? quiz : quizWithoutAnswers
    });
  } catch (error) {
    console.error('Get quiz results error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get student's quiz attempts
export const getStudentAttempts = async (req, res) => {
  try {
    const attempts = await QuizAttempt.find({ studentId: req.user.id })
      .populate('quizId', 'title category languageLevel')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      attempts
    });
  } catch (error) {
    console.error('Get student attempts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Teacher: Get all attempts for a quiz
export const getQuizAttempts = async (req, res) => {
  try {
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const attempts = await QuizAttempt.find({ quizId: req.params.id })
      .populate('studentId', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      attempts
    });
  } catch (error) {
    console.error('Get quiz attempts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Teacher: Update quiz (publish/unpublish, etc.)
export const updateQuiz = async (req, res) => {
  try {
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const quiz = await Quiz.findOne({
      _id: req.params.id,
      createdBy: req.user.id
    });

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Only allow updating certain fields
    const allowedUpdates = [
      'title', 'description', 'isPublished', 'timeLimit', 
      'passingScore', 'attemptsAllowed', 'shuffleQuestions',
      'showResults', 'showCorrectAnswers', 'startDate', 'endDate',
      'tags', 'languageLevel', 'category'
    ];

    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        quiz[field] = req.body[field];
      }
    });

    await quiz.save();

    res.json({
      success: true,
      message: 'Quiz updated successfully!',
      quiz
    });
  } catch (error) {
    console.error('Update quiz error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Teacher: Delete quiz
export const deleteQuiz = async (req, res) => {
  try {
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const quiz = await Quiz.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user.id
    });

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Also delete all attempts for this quiz
    await QuizAttempt.deleteMany({ quizId: req.params.id });

    res.json({
      success: true,
      message: 'Quiz deleted successfully!'
    });
  } catch (error) {
    console.error('Delete quiz error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get quiz statistics for teacher dashboard
export const getQuizStatistics = async (req, res) => {
  try {
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const totalQuizzes = await Quiz.countDocuments({ createdBy: req.user.id });
    const publishedQuizzes = await Quiz.countDocuments({ 
      createdBy: req.user.id, 
      isPublished: true 
    });
    
    const totalAttempts = await QuizAttempt.countDocuments({
      quizId: { $in: await Quiz.find({ createdBy: req.user.id }).distinct('_id') }
    });

    // Get recent attempts
    const recentAttempts = await QuizAttempt.find({
      quizId: { $in: await Quiz.find({ createdBy: req.user.id }).distinct('_id') }
    })
    .populate('studentId', 'name')
    .populate('quizId', 'title')
    .sort({ createdAt: -1 })
    .limit(10);

    res.json({
      success: true,
      statistics: {
        totalQuizzes,
        publishedQuizzes,
        totalAttempts,
        averageScore: await Quiz.aggregate([
          { $match: { createdBy: req.user._id } },
          { $group: { _id: null, avgScore: { $avg: "$averageScore" } } }
        ]).then(result => result[0]?.avgScore || 0),
        quizzesByCategory: await Quiz.aggregate([
          { $match: { createdBy: req.user._id } },
          { $group: { _id: "$category", count: { $sum: 1 } } }
        ])
      },
      recentAttempts
    });
  } catch (error) {
    console.error('Get quiz statistics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};