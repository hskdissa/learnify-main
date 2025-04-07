import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuizByIdAction, submitQuizAction } from '../../actions/quizActions';
import { Button, Container, Card, Form, Alert, ProgressBar } from 'react-bootstrap';
import Loading from '../../components/Loading';
import ErrorMessage from '../../components/ErrorMessage';
import MainScreen from '../../components/MainScreen';

const SingleQuiz = () => {
  const { studyNoteId, quizId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const quizDetails = useSelector((state) => state.quizDisplay);
  const { loading, error, quiz } = quizDetails;

  useEffect(() => {
    if (studyNoteId && quizId) {
      dispatch(getQuizByIdAction(studyNoteId, quizId));
    }
  }, [dispatch, studyNoteId, quizId]);

  const handleAnswerChange = (questionId, option) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: option,
    }));
  };

  // Check if answer is selected before moving to next question
  const handleNext = () => {
    const currentQuestion = quiz.questions[currentQuestionIndex];
    if (answers[currentQuestion._id]) { // Only move to the next question if the answer is selected
      if (currentQuestionIndex < quiz.questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      }
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async () => {
    setSubmitted(true);

    try {
      const response = await dispatch(submitQuizAction(studyNoteId, quizId, answers));

      const { score, points, feedback } = response || {};
      const numericScore = parseInt(score.split('/')[0], 10);
      const numericPoints = parseInt(points, 10);

      navigate(`/quizzes/studynote/${studyNoteId}/quiz/${quizId}/submit`, {
        state: {
          score: numericScore,
          points: numericPoints,
          feedback: feedback,
        },
      });
    } catch (error) {
      console.error('Error submitting quiz:', error);
    }
  };

  return (
    <MainScreen title={`${quiz?.title || ''}`}>
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        {loading ? (
          <Loading />
        ) : error ? (
          <ErrorMessage variant="danger">{error}</ErrorMessage>
        ) : (
          quiz && quiz.questions && quiz.questions.length > 0 && (
            <Card className="shadow-lg rounded" style={{ width: '100%', maxWidth: '800px', padding: '20px' }}>
              <Card.Body>
                <h3 className="text-center">{quiz.title}</h3>
                <p className="text-center text-muted">{quiz.description}</p>

                {/* Progress Bar */}
                <ProgressBar
                  now={(currentQuestionIndex + 1) * (100 / quiz.questions.length)}
                  label={`Question ${currentQuestionIndex + 1} of ${quiz.questions.length}`}
                  className="mb-4"
                />

                <div style={{ marginBottom: '20px' }}>
                  <h5>{currentQuestionIndex + 1}. {quiz.questions[currentQuestionIndex].question}</h5>
                  <Form>
                    {quiz.questions[currentQuestionIndex].options.map((option, i) => {
                      const optionLabel = String.fromCharCode(65 + i); // Converts index to A, B, C, etc.
                      return (
                        <Form.Check
                          type="radio"
                          label={`${optionLabel}. ${option}`}
                          name={`question-${quiz.questions[currentQuestionIndex]._id}`}
                          value={option}
                          onChange={() => handleAnswerChange(quiz.questions[currentQuestionIndex]._id, option)}
                          checked={answers[quiz.questions[currentQuestionIndex]._id] === option}
                          key={i}
                        />
                      );
                    })}
                  </Form>
                </div>

                <div className="d-flex justify-content-between">
                  <Button
                    onClick={handlePrev}
                    disabled={currentQuestionIndex === 0}
                    variant="outline-secondary"
                    className="w-45"
                  >
                    Previous
                  </Button>

                  <Button
                    onClick={handleNext}
                    disabled={currentQuestionIndex === quiz.questions.length - 1 || !answers[quiz.questions[currentQuestionIndex]._id]}
                    variant="outline-primary"
                    className="w-45"
                  >
                    Next
                  </Button>
                </div>

                <div className="text-center mt-4">
                  {!submitted ? (
                    <Button onClick={handleSubmit} variant="success" size="lg" className="w-100">
                      Submit Quiz
                    </Button>
                  ) : (
                    <Alert variant="success">
                      <h4>Your Quiz has been Submitted!</h4>
                      <h4>Checking your Answers now...</h4>
                    </Alert>
                  )}
                </div>
              </Card.Body>
            </Card>
          )
        )}
      </Container>
    </MainScreen>
  );
};

export default SingleQuiz;
