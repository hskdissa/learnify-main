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

  useEffect(() => {
    // If no studyNoteId, navigate back to the dashboard
    if (!studyNoteId) {
      navigate('/dashboard');
    } else if (!quiz) {  // Check if quiz is not already generated
      // Ensure the quiz generation is triggered only once
      const alreadyGenerated = localStorage.getItem(`quizGeneratedFor_${studyNoteId}`);
      if (!alreadyGenerated) {
        console.log("Starting quiz generation...");
        // Dispatch the action to generate the quiz
        dispatch(generateQuizAction(studyNoteId));
        localStorage.setItem(`quizGeneratedFor_${studyNoteId}`, 'true');  // Mark as generated in local storage
      }
    }
  }, [dispatch, studyNoteId, navigate, quiz]);  // Add quiz to dependency array to track changes

  useEffect(() => {
    if (quiz && quiz._id) {
      console.log("Quiz successfully generated:", quiz); // Log the generated quiz details
      // After the quiz is generated, we won't navigate automatically. We leave it to the user.
    }
  }, [quiz]);

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
              onClick={() => navigate(`/studynote/${studyNoteId}`)}  // Allow user to navigate manually
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
