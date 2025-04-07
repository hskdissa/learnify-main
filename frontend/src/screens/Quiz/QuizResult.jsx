import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Container, Card, ListGroup, Button, Row, Col, ProgressBar } from "react-bootstrap";
import { FaCheckCircle, FaTimesCircle, FaArrowLeft } from "react-icons/fa";
import MainScreen from "../../components/MainScreen";

const QuizResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { studyNoteId } = useParams();

  // Extract data passed from SingleQuiz.jsx
  const { score, points, feedback } = location.state || {};
  const totalQuestions = feedback?.length || 0;
  const scorePercentage = totalQuestions > 0 ? (score / totalQuestions) * 100 : 0;

  // Navigate back to the study note
  const goBackToStudyNote = () => {
    navigate(`/studynote/${studyNoteId}`);
  };

  return (
    <MainScreen title="Quiz Results and Feedback">
      <Container>
        {/* Score Summary Card */}
        <Card className="shadow-sm p-4 mb-4 rounded" style={{ borderColor: "#28a745" }}>
          <Card.Body>
            <Row className="align-items-center">
              <Col md={8}>
                <h3 className="mb-3 text-primary">Quiz Results</h3>
                <p className="mb-2" style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
                  Your Score: <span style={{ color: "#28a745" }}>{score}/{totalQuestions}</span>
                </p>
                <ProgressBar variant="success" now={scorePercentage} label={`${scorePercentage.toFixed(0)}%`} style={{ height: "20px" }} />
                <p className="mt-3" style={{ fontSize: "1.25rem" }}>
                  Total Points: <strong>{points}</strong>
                </p>
              </Col>
              <Col md={4} className="text-md-end mt-3 mt-md-0">
                <Button 
                  variant="outline-primary" 
                  onClick={goBackToStudyNote} 
                  className="d-flex align-items-center justify-content-center"
                >
                  <FaArrowLeft className="me-2" /> Back to Study Note
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Feedback Section */}
        <h4 className="mb-3 text-secondary">Feedback</h4>
        <ListGroup variant="flush">
          {feedback && feedback.length > 0 ? (
            feedback.map((item, index) => {
              const isCorrect = item.userAnswer === item.correctAnswer;
              return (
                <ListGroup.Item 
                  key={index} 
                  className={`p-3 rounded mb-3 shadow-sm ${isCorrect ? "bg-light" : "bg-white"}`}
                  style={{ borderLeft: `5px solid ${isCorrect ? "#28a745" : "#dc3545"}` }}
                >
                  <h6 className="fw-bold">
                    {index + 1}. {item.question}
                  </h6>
                  <p>
                    <strong>Your Answer: </strong> 
                    <span className={isCorrect ? "text-success" : "text-danger"}>
                      {item.userAnswer} {isCorrect ? <FaCheckCircle className="ms-2" color="green" /> : <FaTimesCircle className="ms-2" color="red" />}
                    </span>
                  </p>
                  <p>
                    <strong>Correct Answer: </strong> {item.correctAnswer}
                  </p>
                  <p>
                    <strong>Explanation: </strong> {item.explanation}
                  </p>
                </ListGroup.Item>
              );
            })
          ) : (
            <p className="text-muted">No feedback available.</p>
          )}
        </ListGroup>
      </Container>
    </MainScreen>
  );
};

export default QuizResult;
