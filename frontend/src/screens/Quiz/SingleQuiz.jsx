import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuizByIdAction, submitQuizAction } from '../../actions/quizActions';
import { Button, Container, Card, Form, Alert } from 'react-bootstrap';
import Loading from '../../components/Loading';
import ErrorMessage from '../../components/ErrorMessage';
import MainScreen from '../../components/MainScreen';

const SingleQuiz = () => {
    const { studyNoteId, quizId } = useParams();
    console.log("Quiz ID:", quizId);
    console.log("Study Note ID:", studyNoteId);
    
    const dispatch = useDispatch();
    const navigate = useNavigate();
  
    const [answers, setAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    
    const quizDetails = useSelector((state) => state.quizDisplay);
    const { loading, error, quiz } = quizDetails;
  
    useEffect(() => {
        console.log("Fetching quiz for studyNoteId:", studyNoteId, "and quizId:", quizId);
  
        if (studyNoteId && quizId) {
            dispatch(getQuizByIdAction(studyNoteId, quizId));
        } else {
            console.error("Missing studyNoteId or quizId");
        }
    }, [dispatch, studyNoteId, quizId]);
  
    const handleAnswerChange = (questionId, option) => {
        setAnswers((prevAnswers) => ({
            ...prevAnswers,
            [questionId]: option,
        }));
    };

    const handleNext = () => {
        if (currentQuestionIndex < quiz.questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
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
            console.log("Response from backend:", response);

            const { score, points, feedback } = response || {};
    
            if (score && points !== undefined && Array.isArray(feedback)) {
                const numericScore = parseInt(score.split('/')[0], 10); 
                const numericPoints = parseInt(points, 10);
    
                navigate(`/quizzes/studynote/${studyNoteId}/quiz/${quizId}/submit`, {
                    state: {
                        score: numericScore,
                        points: numericPoints,
                        feedback: feedback,
                    },
                });
            } else {
                console.error('Error: Missing score, points, or feedback in the response data');
            }
        } catch (error) {
            console.error('Error submitting quiz:', error);
        }
    };

    return (
      <MainScreen title={`Quiz: ${quiz?.title || ''}`}>
        <Container>
          {loading ? (
            <Loading />
          ) : error ? (
            <ErrorMessage variant="danger">{error}</ErrorMessage>
          ) : (
            quiz && quiz.questions && Array.isArray(quiz.questions) && quiz.questions.length > 0 ? (
              <div>
                <Card style={{ marginBottom: '20px' }}>
                  <Card.Body>
                    <h3>{quiz.title}</h3>
                    <p>{quiz.description}</p>
                    <div key={quiz.questions[currentQuestionIndex]._id} style={{ marginBottom: '15px' }}>
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
                  </Card.Body>
                </Card>
                <div style={{ marginBottom: '20px' }}>
                  <Button onClick={handlePrev} disabled={currentQuestionIndex === 0}>Previous</Button>
                  <Button onClick={handleNext} disabled={currentQuestionIndex === quiz.questions.length - 1}>Next</Button>
                </div>
                {!submitted ? (
                  <Button onClick={handleSubmit}>Submit Quiz</Button>
                ) : (
                  <Alert variant="success">
                    <h4>Your Quiz has been Submitted!</h4>
                  </Alert>
                )}
              </div>
            ) : (
              <ErrorMessage variant="danger">No questions available in the quiz.</ErrorMessage>
            )
          )}
        </Container>
      </MainScreen>
    );
};

export default SingleQuiz;
