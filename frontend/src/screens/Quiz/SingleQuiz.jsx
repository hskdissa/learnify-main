import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuizByIdAction, submitQuizAction } from '../../actions/quizActions';
import { Button, Container, Card, Form, Alert } from 'react-bootstrap';
import Loading from '../../components/Loading';
import ErrorMessage from '../../components/ErrorMessage';
import MainScreen from '../../components/MainScreen';

const SingleQuiz = () => {
    const { studyNoteId, quizId } = useParams();  // Correctly destructure studyNoteId and quizId
    console.log("Quiz ID:", quizId);
    console.log("Study Note ID:", studyNoteId);  // Log studyNoteId
    
    const dispatch = useDispatch();
    const navigate = useNavigate();
  
    const [answers, setAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [incorrectAnswers, setIncorrectAnswers] = useState(0);
    
  
    const quizDetails = useSelector((state) => state.quizDisplay);
    const { loading, error, quiz } = quizDetails;
  
    useEffect(() => {
        console.log("studyNoteId:", studyNoteId);
      
        if (studyNoteId && quizId) {
          dispatch(getQuizByIdAction(studyNoteId, quizId));
        } else {
          console.error("Missing studyNoteId or quizId");
        }
      }, [dispatch, studyNoteId, quizId]);

      console.log("Quiz Data: ", quiz);

  
    const handleAnswerChange = (questionId, option) => {
      setAnswers((prevAnswers) => ({
        ...prevAnswers,
        [questionId]: option,
      }));
    };
  

    const handleSubmit = async () => {
        setSubmitted(true);
    
        try {
            // Send answers to the backend for submission
            const response = await dispatch(submitQuizAction(studyNoteId, quizId, answers));
    
            console.log("Response from backend:", response);
    
            // Check if the response contains the expected structure
            if (response && response.score && response.points !== undefined && Array.isArray(response.feedback)) {
                const { score, points, feedback } = response;
    
                // If score, points, or feedback is missing, log an error
                if (!score || !points || !feedback) {
                    console.error('Error: Missing score, points, or feedback in the response data');
                    return;
                }
    
                // Proceed with navigating to the result page
                navigate(`/quizzes/studynote/${studyNoteId}/quiz/${quizId}/submit`, {
                    state: {
                        score: score,   // e.g. "3/6" or "score/totalQuestions"
                        points: points, // Total points achieved
                        feedback: feedback, // Feedback array
                    },
                });
            } else {
                console.error('Error: Response structure is invalid or missing properties');
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
            quiz && quiz.questions ? (
              <div>
                <Card style={{ marginBottom: '20px' }}>
                  <Card.Body>
                    <h3>{quiz.title}</h3>
                    <p>{quiz.description}</p>
                    {quiz.questions.map((question, index) => (
                      <div key={question._id} style={{ marginBottom: '15px' }}>
                        <h5>{index + 1}. {question.text}</h5>
                        <Form>
                          {question.options.map((option, i) => (
                            <Form.Check
                              type="radio"
                              label={option}
                              name={`question-${question._id}`}
                              value={option}
                              onChange={() => handleAnswerChange(question._id, option)}
                              checked={answers[question._id] === option}
                              key={i}
                            />
                          ))}
                        </Form>
                      </div>
                    ))}
                  </Card.Body>
                </Card>
                {!submitted ? (
                  <Button onClick={handleSubmit}>Submit Quiz</Button>
                ) : (
                  <Alert variant="success">
                    <h4>Your Quiz has been Submitted!</h4>
                  </Alert>
                )}
              </div>
            ) : (
              <ErrorMessage variant="danger">No quiz found or questions missing.</ErrorMessage>
            )
          )}
        </Container>
      </MainScreen>
    );
};

export default SingleQuiz;
