import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Card, Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { getQuizzesByStudyNoteIdAction } from "../../actions/quizActions"; // Import the correct action

const QuizDisplay = () => {
  const { studyNoteId, quizId } = useParams(); // Get the study note ID and quiz ID from the URL
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux state for quiz details
  const quizDetails = useSelector((state) => state.quizDetails); // Assuming you have a reducer for quiz details
  const { loading, error, quiz } = quizDetails;

  // Local state for controlling quiz flow
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]); // Store answers

  useEffect(() => {
    // Dispatch action to fetch the quiz details for the specific study note and quiz ID when the component mounts
    dispatch(getQuizzesByStudyNoteIdAction(studyNoteId)); // Use studyNoteId instead of quizId, since only one quiz exists per study note
  }, [dispatch, studyNoteId]); // We depend on studyNoteId as the quiz data should be associated with it

  useEffect(() => {
    if (quiz && quiz._id !== quizId) {
      navigate(`/quizzes/${studyNoteId}/${quizId}`);
    }
  }, [quiz, quizId, navigate, studyNoteId]);

  // Handle Start Quiz button
  const handleStartQuiz = () => {
    setQuizStarted(true);
  };

  // Handle next question
  const handleNextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  // Handle previous question
  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // Handle selecting an answer
  const handleAnswerSelect = (answer) => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestionIndex] = answer;
    setAnswers(updatedAnswers);
  };

  // Render quiz questions
  const renderQuiz = () => {
    if (quiz && quiz.questions && quiz.questions.length > 0) {
      const currentQuestion = quiz.questions[currentQuestionIndex];

      return (
        <Card>
          <Card.Body>
            <h5>{currentQuestion.text}</h5>
            <div>
              {currentQuestion.options.map((option, index) => (
                <Button
                  key={index}
                  variant="outline-primary"
                  className="m-1"
                  onClick={() => handleAnswerSelect(option)}
                >
                  {option}
                </Button>
              ))}
            </div>
          </Card.Body>
          <Card.Footer>
            <Button
              variant="secondary"
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
            >
              Previous
            </Button>
            <Button
              variant="primary"
              onClick={handleNextQuestion}
              disabled={currentQuestionIndex === quiz.questions.length - 1}
            >
              Next
            </Button>
          </Card.Footer>
        </Card>
      );
    }
    return null;
  };

  // Render the start quiz button
  const renderStartQuizButton = () => {
    return (
      <Card>
        <Card.Body>
          <h3>Click the button below to start the quiz</h3>
          <Button onClick={handleStartQuiz} variant="primary">
            Start Quiz
          </Button>
        </Card.Body>
      </Card>
    );
  };

  // If no quiz data is loaded or there's an error, display a message
  if (loading) {
    return <div>Loading quiz...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Container>
      <h1>Quiz for Study Note {studyNoteId}</h1>
      {!quizStarted ? renderStartQuizButton() : renderQuiz()}
    </Container>
  );
};

export default QuizDisplay;
