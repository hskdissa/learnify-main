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
    // Logic to delete flashcard
    console.log(`Deleting flashcard with ID: ${flashcardId}`);
  };

  return (
    <MainScreen title={`Flashcards for Study Note ${studyNoteId}`}>
      <Container style={{ maxWidth: "900px", margin: "auto", padding: "20px" }}>
      <Button 
          onClick={() => navigate(`/studynote/${studyNoteId}`)} // Navigate to the SingleStudyNote page
          variant="secondary" 
          className="mb-4"
        >
          Back
        </Button>

        {loading ? (
          <Loading />
        ) : error ? (
          <ErrorMessage variant="danger">{error}</ErrorMessage>
        ) : (
          flashcards && flashcards.length > 0 && (
            <div>
              <h3>Flashcards for Study Note: {studyNoteId}</h3>

              <Accordion defaultActiveKey="0">
                {/* Loop through each flashcard set */}
                {[...flashcards].reverse().map((flashcardSet) => (
                  <Accordion.Item key={flashcardSet._id} eventKey={flashcardSet._id}>
                    <Card style={{ margin: 10 }}>
                      <Card.Header style={{ display: "flex" }}>
                        <span
                          style={{
                            color: "black",
                            textDecoration: "none",
                            flex: 1,
                            cursor: "pointer",
                            alignSelf: "center",
                            fontSize: 18,
                          }}
                        >
                          <Accordion.Button as="div">{flashcardSet.title}</Accordion.Button>
                        </span>
                        <div>

                        <Link to={`/studynote/${studyNoteId}/flashcards/${flashcardSet._id}`}>
                          <Button>View</Button>
                        </Link>



                          {/* Delete Button */}
                          <Button
                            variant="danger"
                            className="mx-2"
                            onClick={() => deleteHandler(flashcardSet._id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </Card.Header>

                      <Accordion.Body>
                        <Card.Body>
                          {/* Display flashcards inside the set */}
                          <h4>
                            <Badge bg="success">Category - {flashcardSet.category}</Badge>
                          </h4>

                          {flashcardSet.flashcards.map((flashcard) => (
                          <div key={flashcard._id} className="mb-3">
                            <strong>Q:</strong> {flashcard.question} <br />
                            <strong>A:</strong> {flashcard.answer}

                          </div>
                        ))}

                        </Card.Body>
                      </Accordion.Body>
                    </Card>
                  </Accordion.Item>
                ))}
              </Accordion>
            </div>
          )
        )}
      </Container>
    </MainScreen>
  );
};

export default FlashcardDisplayScreen;
