import { Routes, Route, Navigate } from "react-router-dom";

// Auth
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";

// Student
import Dashboard from "./pages/student/Dashboard";
import Lessons from "./pages/student/Lessons";
import LessonDetail from "./pages/student/LessonDetail";
import Assignments from "./pages/student/Assignments";
import AssignmentDetail from "./pages/student/AssignmentDetail";
import LiveSessions from "./pages/student/LiveSessions";
import Progress from "./pages/student/Progress";
import Community from "./pages/student/Community";
import Profile from "./pages/student/Profile";
import Quizzes from "./pages/student/Quizzes";
import QuizDetail from "./pages/student/QuizDetail"; // <-- YE ADD KIYA (student quiz detail)
import SpeechQuiz from "./pages/student/SpeechQuiz";
import SpeechPractice from "./pages/student/SpeechPractice";
import Certificate from "./pages/student/Certificate";
import WritingPractice from "./pages/student/WritingPractice";
import Leaderboard from "./pages/student/Leaderboard";

// Teacher
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import TeacherLessons from "./pages/teacher/TeacherLessons";
import TeacherLessonDetail from "./pages/teacher/TeacherLessonDetail";
import TeacherAssignments from "./pages/teacher/TeacherAssignments";
import TeacherAssignmentDetail from "./pages/teacher/TeacherAssignmentDetail";
import CreateAssignment from "./pages/teacher/CreateAssignment";
import CreateLesson from "./pages/teacher/CreateLesson";
import TeacherLiveSessions from "./pages/teacher/TeacherLiveSessions";
import TeacherProgress from "./pages/teacher/TeacherProgress";
import TeacherCommunity from "./pages/teacher/TeacherCommunity";
import TeacherStudents from "./pages/teacher/TeacherStudents";
import TeacherQuizzes from "./pages/teacher/TeacherQuizzes"; // <-- YE ADD KIYA
import TeacherQuizDetail from "./pages/teacher/TeacherQuizDetail"; // <-- YE ADD KIYA
import CreateQuiz from "./pages/teacher/CreateQuiz"; // <-- YE ADD KAR

// Admin
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminSettings from "./pages/admin/AdminSettings";

// Layout
import Layout from "./components/Layout";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route element={<Layout />}>
        {/* Student Routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/lessons" element={<Lessons />} />
        <Route path="/lessons/:id" element={<LessonDetail />} />
        <Route path="/assignments" element={<Assignments />} />
        <Route path="/assignments/:id" element={<AssignmentDetail />} />
        <Route path="/livesessions" element={<LiveSessions />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/community" element={<Community />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/quizzes" element={<Quizzes />} />
        <Route path="/quizzes/:id" element={<QuizDetail />} /> {/* Student Quiz Detail */}
        <Route path="/speech-quiz" element={<SpeechQuiz />} />
        <Route path="/speech-practice" element={<SpeechPractice />} />
        <Route path="/certificate" element={<Certificate />} />
        <Route path="/writing" element={<WritingPractice />} />
        <Route path="/leaderboard" element={<Leaderboard />} />

        {/* Teacher Routes */}
        <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
        <Route path="/teacher/lessons" element={<TeacherLessons />} />
        <Route path="/teacher/lessons/create" element={<CreateLesson />} />
        <Route path="/teacher/lesson/:id" element={<TeacherLessonDetail />} />
        <Route path="/teacher/assignments" element={<TeacherAssignments />} />
        <Route path="/teacher/assignments/create" element={<CreateAssignment />} />
        <Route path="/teacher/assignments/:id" element={<TeacherAssignmentDetail />} />
        <Route path="/teacher/quizzes" element={<TeacherQuizzes />} />
        <Route path="/teacher/quizzes/:id" element={<TeacherQuizDetail />} /> {/* Teacher Quiz Detail */}
        <Route path="/teacher/quizzes/create" element={<CreateQuiz />} />
        <Route path="/teacher/quizzes/:id/edit" element={<CreateQuiz />} /> {/* Reuse CreateQuiz for edit */}
        {/* <Route path="/teacher/quizzes/:id/attempts" element={<QuizAttempts />} /> */}
        <Route path="/teacher/livesessions" element={<TeacherLiveSessions />} />
        <Route path="/teacher/progress" element={<TeacherProgress />} />
        <Route path="/teacher/community" element={<TeacherCommunity />} />
        <Route path="/teacher/students" element={<TeacherStudents />} />
        <Route path="/teacher/quizzes" element={<TeacherQuizzes />} />
        <Route path="/teacher/create-quiz" element={<CreateQuiz />} />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/analytics" element={<AdminAnalytics />} />
        <Route path="/admin/settings" element={<AdminSettings />} />

        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Route>
    </Routes>
  );
}

export default App;