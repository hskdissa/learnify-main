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

  console.log('Quiz state:', quiz);


  // Debugging: Log the raw value of 'quizzes' in localStorage
  const storedQuizzes = localStorage.getItem('quizzes');
  console.log("Stored quizzes from localStorage:", storedQuizzes);

  // Try to fetch quizzes from localStorage and handle possible invalid format
  let updatedQuizzes = [];
  try {
    if (storedQuizzes) {
      updatedQuizzes = JSON.parse(storedQuizzes);
      if (!Array.isArray(updatedQuizzes)) {
        console.error("Expected quizzes to be an array, but it's not. Resetting to empty array.");
        updatedQuizzes = [];
      }
    } else {
      console.warn("No quizzes found in localStorage. Initializing empty array.");
      updatedQuizzes = [];
    }
  } catch (error) {
    console.error("Error parsing quizzes from localStorage:", error);
    updatedQuizzes = [];
  }

  // Ensure quizzes are always an array
  if (!Array.isArray(updatedQuizzes)) {
    updatedQuizzes = [];
  }




  useEffect(() => {
    if (!studyNoteId) {
      navigate('/dashboard');
      return;
    }
  
    const alreadyGenerated = localStorage.getItem(`quizGeneratedFor_${studyNoteId}`);
    const storedQuiz = localStorage.getItem(`generatedQuiz_${studyNoteId}`);
  
    if (storedQuiz) {
      console.log("Retrieved quiz from localStorage:", JSON.parse(storedQuiz));
      // Ensure that the quiz is set from localStorage if already generated
      dispatch({ type: "QUIZ_GENERATED_SUCCESS", payload: JSON.parse(storedQuiz) });
    } else if (!alreadyGenerated) {
      console.log("Starting quiz generation...");
      dispatch(generateQuizAction(studyNoteId)); // This will handle both generation and success/failure
      localStorage.setItem(`quizGeneratedFor_${studyNoteId}`, 'true');
    }
  }, [dispatch, studyNoteId, navigate]);
  
  




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
