import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { getFlashcardDetailsAction } from '../../actions/flashcardActions';
import Loading from '../../components/Loading';
import ErrorMessage from '../../components/ErrorMessage';
import { Card, Button, Container } from 'react-bootstrap';

const FlashcardDetailScreen = () => {
  const { id: studyNoteId, flashcardId } = useParams(); // flashcardId represents the flashcard set id
  const dispatch = useDispatch();

  // Get flashcard set details from Redux state
  const flashcardDetails = useSelector((state) => state.flashcardDetails);
  const { loading, error, flashcard } = flashcardDetails;

  useEffect(() => {
    console.log("Study Note ID:", studyNoteId);
    console.log("Flashcard Set ID:", flashcardId);

    if (studyNoteId && flashcardId) {
      dispatch(getFlashcardDetailsAction(studyNoteId, flashcardId));
    } else {
      console.error("Study Note ID or Flashcard Set ID is missing.");
    }
  }, [dispatch, studyNoteId, flashcardId]);

  console.log("Flashcard object:", flashcard);

  return (
    <Container style={{ padding: "20px", maxWidth: "800px", margin: "auto" }}>
      {loading ? (
        <Loading />
      ) : error ? (
        <ErrorMessage variant="danger">{error}</ErrorMessage>
      ) : flashcard ? (
        <div>
          <h2>Flashcard Set Details</h2>
          <Card style={{ border: "1px solid #ddd", padding: "20px", borderRadius: "8px", marginBottom: "20px" }}>
            <h4>{flashcard.title}</h4>
            <p><strong>Created At:</strong> {new Date(flashcard.createdAt).toLocaleString()}</p>
            <p><strong>Updated At:</strong> {new Date(flashcard.updatedAt).toLocaleString()}</p>
          </Card>
          {flashcard.flashcards && flashcard.flashcards.length > 0 ? (
            flashcard.flashcards.map((card, index) => (
              <Card key={card._id} style={{ marginBottom: "15px", padding: "15px" }}>
                <h5>Flashcard {index + 1}</h5>
                <p><strong>Question:</strong> {card.question}</p>
                <p><strong>Answer:</strong> {card.answer}</p>
              </Card>
            ))
          ) : (
            <p>No flashcards available in this set.</p>
          )}
          <Link to={`/studynote/${studyNoteId}/flashcards`}>
            <Button variant="primary" style={{ marginTop: "20px" }}>
              Back to Flashcards List
            </Button>
          </Link>
        </div>
      ) : (
        <p>No flashcard set data available.</p>
      )}
    </Container>
  );
};

export default FlashcardDetailScreen;
