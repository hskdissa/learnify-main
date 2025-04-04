import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { Button, Card, Badge, Container } from "react-bootstrap";
import { getStudyNoteById } from "../../actions/studyNoteAction.jsx"; // Ensure this is the correct import
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";
import ReactMarkdown from "react-markdown";


const SingleStudyNote = () => {
  const dispatch = useDispatch();
  const { id } = useParams(); // Access the study note ID from the URL

  const studyNoteDetails = useSelector((state) => state.studyNoteDetails);
  const { loading, error, studyNote } = studyNoteDetails;

  useEffect(() => {
    dispatch(getStudyNoteById(id)); // Fetch study note by ID
  }, [dispatch, id]);

  return (
    <Container style={{ maxWidth: "900px", margin: "auto", padding: "20px" }}>
      {loading ? (
        <div className="text-center">
          <Loading />
        </div>
      ) : error ? (
        <ErrorMessage variant="danger">{error}</ErrorMessage>
      ) : (
        studyNote && (
          <Card style={{ 
            padding: "20px", 
            boxShadow: "0px 4px 10px rgba(0,0,0,0.1)" }}>
            <Card.Header
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "#f8f9fa",
              }}
            >
              <h4>
                <Badge bg="success">{studyNote.title || "No Title"}</Badge>
              </h4>
            </Card.Header>

            <Card.Body>
              <h2>Study Note:</h2>
              <div
              >
                {studyNote.aiResponse ? (
                  <ReactMarkdown>{studyNote.aiResponse}</ReactMarkdown>
                ) : (
                  <p className="text-muted">No AI-generated response available.</p>
                )}



                
              </div>

              <footer className="blockquote-footer mt-3">
                Created On{" "}
                <cite title="Source Title">
                  {new Date(studyNote.createdAt).toLocaleDateString()}
                </cite>
              </footer>
            </Card.Body>
          </Card>
        )
      )}

      <div className="text-center mt-4">
        <Link to="/dashboard">
          <Button variant="primary">Back to Dashboard</Button>
        </Link>
      </div>
    </Container>
  );
};

export default SingleStudyNote;
