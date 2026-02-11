function QuizCard({ quiz, onStart }) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="font-semibold text-lg">{quiz.title}</h3>
      <p className="text-sm text-gray-500 mt-1">{quiz.description}</p>
      <p className="text-xs text-gray-400 mt-1">{quiz.questions.length} questions</p>
      <button
        onClick={() => onStart(quiz)}
        className="mt-3 bg-green-600 text-white px-3 py-1 rounded"
      >
        Start Quiz
      </button>
    </div>
  );
}

export default QuizCard;
