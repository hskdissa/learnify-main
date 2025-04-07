import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { getQuizzesByStudyNoteIdAction } from "../../actions/quizActions"; // Correct path
import Loading from "../../components/Loading";

const QuizDisplay = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { quizId } = useParams(); // Extract quizId from the URL

  const quizData = useSelector((state) => state.quizData); // Adjusted the state name
  const { loading, error, quiz } = quizData;

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState([]);

  useEffect(() => {
    // Fetch the quiz using the quizId from the URL
    dispatch(getQuizzesByStudyNoteIdAction(quizId)); // Get quiz by study note ID
  }, [dispatch, quizId]);

  const handleAnswerSelection = (answer) => {
    setSelectedAnswers([...selectedAnswers, answer]);

    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleSubmitQuiz = () => {
    console.log("Quiz submitted:", selectedAnswers);
    navigate("/quiz/results"); // Navigate to quiz results page after submission
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!quiz) {
    return <div>No quiz data available</div>;
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];

  return (
    <div>
      <h2>{quiz.title}</h2>
      <h3>{currentQuestion.question}</h3>
      <div>
        {currentQuestion.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswerSelection(option)}
            className="btn btn-primary"
          >
            {option}
          </button>
        ))}
      </div>
      <div>
        {currentQuestionIndex < quiz.questions.length - 1 ? (
          <button
            className="btn btn-secondary"
            onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
          >
            Next Question
          </button>
        ) : (
          <button className="btn btn-success" onClick={handleSubmitQuiz}>
            Submit Quiz
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizDisplay;
