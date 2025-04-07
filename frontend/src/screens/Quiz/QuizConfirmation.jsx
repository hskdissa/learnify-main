import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { generateQuizAction } from "../../actions/quizActions";
import { useNavigate, useParams, Link } from "react-router-dom";  // Import Link from react-router-dom
import MainScreen from "../../components/MainScreen";
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";
import { Button } from "react-bootstrap"; // Make sure Button is imported

const QuizConfirmation = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { studyNoteId } = useParams(); // Get study note ID from URL

  // Get quiz state from Redux store
  const quizGenerate = useSelector((state) => state.quizGenerate || {});
  const { loading, quiz, error } = quizGenerate;

  // Log the entire state to check if the quiz data is there
  console.log('quizGenerate state:', quizGenerate);




  const handleGoToStudyNote = () => {
    // Navigate to the study note page
    navigate(`/studynote/${studyNoteId}`);
  };

  // Fetch quiz when component mounts
  useEffect(() => {
    if (studyNoteId && !quiz) {
      // Dispatch the generate quiz action if studyNoteId is available and quiz is not already generated
      dispatch(generateQuizAction(studyNoteId));
    }
  }, [dispatch, studyNoteId, quiz]);

  // Show loading state
  if (loading) {
    return (
      <MainScreen title="Generating Quiz...">
        <Loading />
      </MainScreen>
    );
  }

  // Show error message if quiz generation failed
  if (error) {
    return (
      <MainScreen title="Error">
        <ErrorMessage variant="danger">{error}</ErrorMessage>
      </MainScreen>
    );
  }

  // Show success message when quiz is generated
  if (quiz) {
    return (
      <MainScreen title="Quiz Generated Successfully!">
        <p>Your quiz has been successfully created.</p>
        <h4>{quiz.title}</h4>
        <div>
          {quiz.questions && quiz.questions.length > 0 ? (
            <ul>
              {quiz.questions.map((question, index) => (
                <li key={index}>
                  <strong>{question.question}</strong>
                  <ul>
                    {question.options.map((option, idx) => (
                      <li key={idx}>{option}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          ) : (
            <p>No questions available for this quiz.</p>
          )}
        </div>
        <Link to={`/studynote/${studyNoteId}`}>
          <Button variant="primary" size="sm">
            Back to Study Note
          </Button>
        </Link>
      </MainScreen>
    );
  }

  // If quiz is not available (unexpected state)
  return (
    <MainScreen title="No Quiz Available">
      <p>Something went wrong. Please try again later.</p>
    </MainScreen>
  );
};

export default QuizConfirmation;
