import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import MainScreen from '../../components/MainScreen';
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";
import './FlashcardDisplay.css'; // External CSS for flip effect

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
  const [flipped, setFlipped] = useState(false); // State to manage flip

  // Function to go to the next flashcard
  const nextFlashcard = () => {
    if (currentIndex < flashcards.flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setFlipped(false); // Reset flip when changing flashcards
    }
  };

  // Function to go to the previous flashcard
  const prevFlashcard = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setFlipped(false); // Reset flip when changing flashcards
    }
  };

  // Toggle flip state
  const toggleFlip = () => {
    setFlipped(!flipped);
  };

  return (
    <MainScreen title={`Generated Flashcards`}>
      <Container className="py-4" style={{ maxWidth: "800px", margin: "auto" }}>
        {loading && <Loading />}
        {error && <ErrorMessage variant="danger">{error}</ErrorMessage>}

        {/* Flashcards display */}
        {flashcards && flashcards.flashcards.length > 0 && (
          <div className="flashcards-container">
            <h4 className="text-center mb-4 text-primary" style={{ fontSize: "2rem" }}>
              {flashcards.title}
            </h4>

            <Row className="justify-content-center">
              <Col md={8}>
                {/* Flashcard with flip effect */}
                <div className="flashcard-container">
                  <Card className={`flashcard-card ${flipped ? "flipped" : ""}`} onClick={toggleFlip}>
                    <div className="flashcard-inner">
                      <div className="flashcard-front">
                        <Card.Body className="d-flex justify-content-center align-items-center">
                          <h5 className="flashcard-question" style={{ fontSize: "1.25rem", fontWeight: "bold" }}>
                            Q: {flashcards.flashcards[currentIndex].question}
                          </h5>
                        </Card.Body>
                      </div>
                      <div className="flashcard-back">
                        <Card.Body className="d-flex justify-content-center align-items-center">
                          <p className="flashcard-answer" style={{ fontSize: "1.25rem", color: "#17a2b8" }}>
                            A: {flashcards.flashcards[currentIndex].answer}
                          </p>
                        </Card.Body>
                      </div>
                    </div>
                  </Card>
                </div>
              </Col>
            </Row>

            {/* Navigation buttons */}
            <div className="text-center mt-4">
              <Button
                variant="secondary"
                onClick={prevFlashcard}
                disabled={currentIndex === 0}
                className="mx-3 px-4 py-2 rounded-pill shadow"
                style={{ fontSize: "1rem" }}
              >
                Previous
              </Button>
              <Button
                variant="secondary"
                onClick={nextFlashcard}
                disabled={currentIndex === flashcards.flashcards.length - 1}
                className="mx-3 px-4 py-2 rounded-pill shadow"
                style={{ fontSize: "1rem" }}
              >
                Next
              </Button>
            </div>
          </div>
        )}

        {/* Button to go to Dashboard */}
        <div className="text-center mt-5">
          <Button variant="secondary" onClick={redirectToDashboard} className="px-5 py-2 rounded-pill shadow">
            Go to Dashboard
          </Button>
        </div>
      </Container>
    </MainScreen>
  );
};

export default FlashcardDisplay;
