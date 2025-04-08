import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate, Link } from "react-router-dom";
import { listFlashcardsByStudyNote } from "../../actions/flashcardActions";
import { Accordion, Card, Button, Container, Badge } from "react-bootstrap"; 
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";
import MainScreen from "../../components/MainScreen";

const FlashcardDisplayScreen = () => {
  const { id: studyNoteId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const flashcardList = useSelector((state) => state.flashcardList);
  const { loading, error, flashcards } = flashcardList;

  useEffect(() => {
    if (studyNoteId) {
      dispatch(listFlashcardsByStudyNote(studyNoteId));
    }
  }, [dispatch, studyNoteId]);

  // Delete Handler (integrate actual delete logic here)
  const deleteHandler = (flashcardId) => {
    console.log(`Deleting flashcard with ID: ${flashcardId}`);
  };

  return (
    <MainScreen title={`Flashcards for Study Note`}>
      <Container style={{ maxWidth: "900px", padding: "20px" }}>
        
        <Button 
          onClick={() => navigate(`/studynote/${studyNoteId}`)} 
          variant="secondary" 
          className="mb-4"
        >
          Back
        </Button>

        {loading ? (
          <Loading />
        ) : error ? (
          <ErrorMessage variant="danger">{error}</ErrorMessage>
        ) : flashcards && flashcards.length > 0 ? (
          <div>
            <h3 className="mb-3">Available Flashcard Sets</h3>

            <Accordion defaultActiveKey="0">
              {[...flashcards].reverse().map((flashcardSet) => (
                <Accordion.Item key={flashcardSet._id} eventKey={flashcardSet._id}>
                  <Card className="shadow-sm border-0 mb-3">
                    <Card.Header className="d-flex justify-content-between align-items-center bg-light">
                      <div className="fw-bold">{flashcardSet.title}</div>

                      <div>
                        <Link to={`/studynote/${studyNoteId}/flashcards/${flashcardSet._id}`}>
                          <Button variant="primary" className="me-2">View</Button>
                        </Link>

                      </div>
                    </Card.Header>
                    
                    <Accordion.Body>
                      <Badge bg="success" className="mb-2">Category: {flashcardSet.category}</Badge>
                    </Accordion.Body>
                  </Card>
                </Accordion.Item>
              ))}
            </Accordion>
          </div>
        ) : (
          <p className="text-muted text-center">No flashcards available.</p>
        )}
      </Container>
    </MainScreen>
  );
};

export default FlashcardDisplayScreen;
