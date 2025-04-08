import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { Button, Container, Alert } from "react-bootstrap";
import MainScreen from "../../components/MainScreen";
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";
import { generateQuizAction } from "../../actions/quizActions"; // Action to generate the quiz

const QuizConfirmation = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { state } = useLocation();
  const { studyNoteId } = state || {};

  // State management for quiz generation
  const quizGeneration = useSelector((state) => state.quizGenerateReducer);
  const { loading, error, quiz } = quizGeneration;

  // Debugging: Log the quiz object from Redux
  console.log("Quiz from Redux:", quiz);

  useEffect(() => {
    if (!studyNoteId) {
      navigate('/dashboard');
      return;
    }

    // Check if quiz already exists in Redux
    if (quiz && quiz.studyNoteId === studyNoteId) {
      // Quiz already exists, no need to generate again
      console.log("Quiz already generated, skipping quiz generation.");
    } else {
      // If no quiz exists for this study note, generate one
      console.log("Starting quiz generation...");
      dispatch(generateQuizAction(studyNoteId)); // Dispatching the quiz generation action
    }
  }, [dispatch, studyNoteId, navigate, quiz]); // Added 'quiz' as a dependency to handle state changes

  // If quiz is generated, navigate to the study note page
  const handleBackToStudyNote = () => {
    navigate(`/studynote/${studyNoteId}`);
  };

  return (
    <MainScreen title="Quiz Confirmation">
      <Container>
        {loading && <Loading />} {/* Show loading spinner when quiz is being generated */}
        {error && <ErrorMessage variant="danger">{error}</ErrorMessage>} {/* Show error message if there's an error */}

        {!loading && !error && quiz && (
          <Alert variant="success">
            <h4>Quiz has been successfully generated!</h4>
            <p>You can now go back to your study note.</p>
            <Button
              variant="primary"
              onClick={handleBackToStudyNote}  // Allow user to navigate manually
            >
              Back to Study Note
            </Button>
          </Alert>
        )}
      </Container>
    </MainScreen>
  );
};

export default QuizConfirmation;
