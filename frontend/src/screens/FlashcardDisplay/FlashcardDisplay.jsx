import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Container, Card, Row, Col, Button } from "react-bootstrap";
import MainScreen from '../../components/MainScreen';
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";
import './FlashcardDisplay.css'; // Custom CSS for improved styles

const FlashcardDisplay = () => {
  // Accessing flashcard generation state from Redux
  const flashcardGenerate = useSelector((state) => state.flashcardGenerate);
  const { loading, error, flashcards } = flashcardGenerate;

  const navigate = useNavigate();
  // Redirection to Dashboard
  const redirectToDashboard = () => {
    navigate("/dashboard"); 
  };

  const [currentIndex, setCurrentIndex] = useState(0);

  // Function to go to the next flashcard
  const nextFlashcard = () => {
    if (currentIndex < flashcards.flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  // Function to go to the previous flashcard
  const prevFlashcard = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <MainScreen title={`Generated Flashcards`}>
      <Container>

        {loading && <Loading />}
        {error && <ErrorMessage variant="danger">{error}</ErrorMessage>}

        {/* Flashcards display */}
        {flashcards && flashcards.flashcards.length > 0 && (
          <div className="flashcards-container">
            <h4 className="text-center mb-3">{flashcards.title}</h4>

            <Row className="justify-content-center">
              <Col md={8} className="mb-44">
                <div className="flashcard">
                  <Card className="flashcard-card">
                    <div className="flashcard-inner">
                      <div className="flashcard-front">
                        <Card.Body>
                          <h5 className="flashcard-question">
                            Q: {flashcards.flashcards[currentIndex].question}
                          </h5>
                        </Card.Body>
                      </div>
                      <div className="flashcard-back">
                        <Card.Body>
                          <p className="flashcard-answer">
                            A: {flashcards.flashcards[currentIndex].answer}
                          </p>
                        </Card.Body>
                      </div>
                    </div>
                  </Card>
                </div>
              </Col>
            </Row>

            <div className="text-center1">
              <Button
                variant="secondary"
                onClick={prevFlashcard}
                disabled={currentIndex === 0}
                className="mx-22"
              >
                Previous
              </Button>
              <Button
                variant="secondary"
                onClick={nextFlashcard}
                disabled={currentIndex === flashcards.flashcards.length - 1}
                className="mx-22"
              >
                Next
              </Button>
            </div>
            
          </div>
        )}
        {/* Button to go to Dashboard */}
      <div className="text-center mt-4">
        <Button variant="secondary" onClick={redirectToDashboard}>
          Go to Dashboard
        </Button>
      </div>

      </Container>
    </MainScreen>
  );
};

export default FlashcardDisplay;
