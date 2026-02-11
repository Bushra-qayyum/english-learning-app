import { useNavigate } from "react-router-dom";

function LessonCard({ lesson }) {
  const navigate = useNavigate();
  return (
    <div className="bg-white rounded-lg shadow p-3 flex flex-col">
      <img
        src={lesson.thumbnail || "https://via.placeholder.com/400x200?text=Lesson"}
        alt={lesson.title}
        className="h-40 w-full object-cover rounded"
      />
      <h3 className="mt-3 font-semibold text-lg">{lesson.title}</h3>
      <p className="text-sm text-gray-500">{lesson.category} • {lesson.level}</p>
      <div className="mt-3 flex gap-2">
        <button
          onClick={() => navigate("/lessons")}
          className="bg-blue-600 text-white px-3 py-1 rounded"
        >
          Open
        </button>
        <button
          onClick={() => navigate("/quizzes")}
          className="bg-gray-100 px-3 py-1 rounded"
        >
          Quiz
        </button>
      </div>
    </div>
  );
}

export default LessonCard;
