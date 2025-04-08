import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { getFlashcardDetailsAction } from '../../actions/flashcardActions';
import Loading from '../../components/Loading';
import ErrorMessage from '../../components/ErrorMessage';
import { Card, Button, Container, Row, Col } from 'react-bootstrap';
import MainScreen from '../../components/MainScreen';

const FlashcardDetailScreen = () => {
  const { id: studyNoteId, flashcardId } = useParams(); // flashcardId represents the flashcard set id
  const dispatch = useDispatch();

  const flashcardDetails = useSelector((state) => state.flashcardDetails);
  const { loading, error, flashcard } = flashcardDetails;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false); // For card flip effect

  useEffect(() => {
    if (studyNoteId && flashcardId) {
      dispatch(getFlashcardDetailsAction(studyNoteId, flashcardId));
    } else {
      console.error("Study Note ID or Flashcard Set ID is missing.");
    }
  }, [dispatch, studyNoteId, flashcardId]);

  const nextFlashcard = () => {
    if (currentIndex < flashcard.flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setFlipped(false); // Reset flip
    }
  };

  const prevFlashcard = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setFlipped(false); // Reset flip
    }
  };

  const toggleFlip = () => {
    setFlipped(!flipped);
  };

  return (
    <MainScreen title={`Flashcard Set: ${flashcard?.title}`}>
      <Container className="py-4" style={{ maxWidth: "800px", margin: "auto" }}>
        {loading && <Loading />}
        {error && <ErrorMessage variant="danger">{error}</ErrorMessage>}

        {/* Flashcard Set Details */}
        {flashcard && flashcard.flashcards && flashcard.flashcards.length > 0 ? (
          <>
            <Card className="mb-4" style={{ backgroundColor: '#f4f4f9', borderRadius: '8px' }}>
              <Card.Body>
                <h4 className="text-center mb-3">{flashcard.title}</h4>
                <p><strong>Created At:</strong> {new Date(flashcard.createdAt).toLocaleString()}</p>
                <p><strong>Updated At:</strong> {new Date(flashcard.updatedAt).toLocaleString()}</p>
              </Card.Body>
            </Card>

            <Row className="justify-content-center mb-4">
              <Col md={8}>
                {/* Flashcard with flip effect */}
                <Card className={`flashcard-card ${flipped ? 'flipped' : ''}`} onClick={toggleFlip}>
                  <div className="flashcard-inner">
                    <div className="flashcard-front">
                      <Card.Body className="d-flex justify-content-center align-items-center">
                        <h5 className="flashcard-question" style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
                          Q: {flashcard.flashcards[currentIndex].question}
                        </h5>
                      </Card.Body>
                    </div>
                    <div className="flashcard-back">
                      <Card.Body className="d-flex justify-content-center align-items-center">
                        <p className="flashcard-answer" style={{ fontSize: '1.25rem', color: '#17a2b8' }}>
                          A: {flashcard.flashcards[currentIndex].answer}
                        </p>
                      </Card.Body>
                    </div>
                  </div>
                </Card>
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
                disabled={currentIndex === flashcard.flashcards.length - 1}
                className="mx-3 px-4 py-2 rounded-pill shadow"
                style={{ fontSize: "1rem" }}
              >
                Next
              </Button>
            </div>
          </>
        ) : (
          <p>No flashcards available in this set.</p>
        )}

        {/* Back to Flashcards List */}
        <div className="text-center mt-5">
          <Link to={`/studynote/${studyNoteId}/flashcards`}>
            <Button variant="primary" className="px-5 py-2 rounded-pill shadow">
              Back to Flashcards List
            </Button>
          </Link>
        </div>
      </Container>
    </MainScreen>
  );
};

export default FlashcardDetailScreen;
