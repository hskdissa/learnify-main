import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Container, Card, ListGroup, ListGroupItem, Button, Row, Col } from 'react-bootstrap';
import MainScreen from '../../components/MainScreen';

const QuizResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { studyNoteId, quizId } = useParams(); // Extract studyNoteId from URL
  
  // Get the data passed from SingleQuiz.jsx
  const { score, points, feedback } = location.state || {};
  console.log("Quiz Result Data:", location.state);


  // Navigate back to the study note
  const goBackToStudyNote = () => {
    navigate(`/studynote/${studyNoteId}`); // Dynamically navigate to the study note page
  };

  return (
    <MainScreen title="Quiz Results">
      <Container>
        <Card style={{ marginBottom: '20px', borderRadius: '10px' }}>
          <Card.Body>
            <Row>
              <Col md={6}>
              
                <h3>Quiz Results</h3>
                <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                Your Score: <span style={{ color: '#28a745' }}>{score}/{location.state?.totalQuestions ?? feedback?.length ?? 0}</span>
                </p>


                <p style={{ fontSize: '1.25rem' }}>Total Points: {points}</p>
              </Col>
              <Col md={6} className="text-center">
                <Button 
                  variant="primary" 
                  onClick={goBackToStudyNote} 
                  style={{ fontSize: '1rem', padding: '10px 20px' }}
                >
                  Back to Study Note
                </Button>
              </Col>
            </Row>
            
            <hr />
            
            <h5>Feedback</h5>
            <ListGroup variant="flush">
              {feedback && feedback.length > 0 ? (
                feedback.map((item, index) => (
                  <ListGroupItem key={index} style={{ marginBottom: '15px' }}>
                    <h6 style={{ fontWeight: 'bold' }}>{index + 1}. {item.question}</h6>
                    <p><strong>Your Answer:</strong> {item.userAnswer}</p>
                    <p><strong>Correct Answer:</strong> {item.correctAnswer}</p>
                    <p><strong>Explanation:</strong> {item.explanation}</p>
                  </ListGroupItem>
                ))
              ) : (
                <p>No feedback available.</p>
              )}
            </ListGroup>
          </Card.Body>
        </Card>
      </Container>
    </MainScreen>
  );
};

export default QuizResult;
