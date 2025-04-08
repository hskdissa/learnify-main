import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Card, Badge, Container, Row, Col, Alert } from "react-bootstrap";
import { getStudyNoteById } from "../../actions/studyNoteAction";
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";
import ReactMarkdown from "react-markdown";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { generateFlashcardsAction } from "../../actions/flashcardActions";
import MainScreen from "../../components/MainScreen";
import { generateQuizAction } from "../../actions/quizActions";
import { FaDownload, FaListAlt, FaClipboardList, FaPenAlt } from 'react-icons/fa'; // Icons for buttons

const SingleStudyNote = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  // Redux state for study note
  const studyNoteDetails = useSelector((state) => state.studyNoteDetails);
  const { loading, error, studyNote } = studyNoteDetails;

  // Redux state for quiz generation
  const quizGeneration = useSelector((state) => state.quizGenerateReducer || {});
  const { loading: quizLoading, error: quizError, quiz } = quizGeneration;

  // Loading state for quiz generation
  const [loadingQuiz, setLoadingQuiz] = useState(false);
  const [quizGenerationMessage, setQuizGenerationMessage] = useState("");
  const [hasQuizBeenGenerated, setHasQuizBeenGenerated] = useState(false);

    // Update the quiz state and message based on quiz generation
    useEffect(() => {
      if (quiz) {
        if (!hasQuizBeenGenerated) {
          setLoadingQuiz(false);
          setQuizGenerationMessage("Quiz generated successfully!");
          setHasQuizBeenGenerated(true);
        }
      }
  
      if (quizError) {
        setLoadingQuiz(false);
        setQuizGenerationMessage("Failed to generate quiz. Please try again.");
      }
    }, [quiz, quizError, hasQuizBeenGenerated]);

  // Fetch study note by ID
  useEffect(() => {
    dispatch(getStudyNoteById(id));
  }, [dispatch, id]);

  // Download PDF functionality
  const downloadPDF = () => {
    if (!studyNote) return;

    const doc = new jsPDF();
    const marginLeft = 10;
    const marginTop = 10;
    const maxWidth = 180;
    const formattedText = doc.splitTextToSize(studyNote.aiResponse || "No content available.", maxWidth);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(studyNote.title || "Study Note", marginLeft, marginTop);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(formattedText, marginLeft, marginTop + 10);

    doc.save(`${studyNote.title || "study_note"}.pdf`);
  };

  // Handle flashcard generation
  const handleGenerateFlashcards = () => {
    if (id) {
      dispatch(generateFlashcardsAction(id));
      navigate("/flashcards/generate", { state: { studyNoteId: id } });
    }
  };

  const handleGenerateQuiz = () => {
    if (quiz && quiz.studyNoteId === id) {
      alert("A quiz has already been generated for this study note.");
      return;
    }
  
    setLoadingQuiz(true); // Show loading indicator while generating
    dispatch(generateQuizAction(id));
  };

  // Navigate to view flashcards
  const handleStartQuiz = () => {
    navigate(`/quizzes/${studyNote._id}`);
  };

  const viewFlashcardsHandler = () => {
    navigate(`/studynote/${id}/flashcards`);
  };



  return (
    <MainScreen title={`Study Note: ${studyNote ? studyNote.title : "Loading..."}`}>
      <Container style={{ maxWidth: "900px", margin: "auto", padding: "20px" }}>
        {loading ? (
          <div className="text-center">
            <Loading />
          </div>
        ) : error ? (
          <ErrorMessage variant="danger">{error}</ErrorMessage>
        ) : (
          studyNote && (
            <Card className="shadow-lg rounded p-4 mb-4" style={{ borderColor: "#28a745" }}>
              <Card.Header className="bg-light" style={{ borderBottom: "2px solid #28a745" }}>
                <h4 className="mb-0">
                  <Badge bg="success">{studyNote.title || "No Title"}</Badge>
                </h4>
              </Card.Header>

              <Card.Body>
                <h5 className="text-primary mb-3">Study Note:</h5>
                <div>
                  {studyNote.aiResponse ? (
                    <ReactMarkdown>{studyNote.aiResponse}</ReactMarkdown>
                  ) : (
                    <p className="text-muted">No AI-generated response available.</p>
                  )}
                </div>

                {/* Quiz Generation Status */}
                {quizGenerationMessage && (
                  <Alert variant={quizError ? "danger" : "success"}>{quizGenerationMessage}</Alert>
                )}

                {/* Buttons Row */}
                <Row className="mt-4">
                  <Col md={6} className="mb-3">
                    <Button onClick={downloadPDF} variant="info" className="w-100">
                      <FaDownload className="me-2" /> Download PDF
                    </Button>
                  </Col>
                  <Col md={6} className="mb-3">
                    <Button onClick={handleGenerateFlashcards} variant="primary" className="w-100">
                      <FaListAlt className="me-2" /> Generate Flashcards
                    </Button>
                  </Col>
                </Row>

                <Row className="mt-3">
                  <Col md={6} className="mb-3">
                    <Button onClick={handleStartQuiz} variant="success" className="w-100">
                      <FaClipboardList className="me-2" /> Start Quiz
                    </Button>
                  </Col>
                  <Col md={6} className="mb-3">
                    <Button
                      onClick={handleGenerateQuiz}
                      variant="warning"
                      className="w-100"
                      disabled={loadingQuiz} // Disable while loading
                    >
                      {loadingQuiz ? "Generating..." : <><FaPenAlt className="me-2" /> Generate Quiz</>}
                    </Button>
                  </Col>
                </Row>

                {/* View Flashcards Button */}
                <Row className="mt-3">
                  <Col md={12} className="mb-3">
                    <Button onClick={viewFlashcardsHandler} variant="secondary" className="w-100">
                      <FaListAlt className="me-2" /> View Flashcards
                    </Button>
                  </Col>
                </Row>

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
          <Button variant="secondary" onClick={() => navigate("/dashboard")}>
            Back to Dashboard
          </Button>
        </div>
      </Container>
    </MainScreen>
  );
};

export default SingleStudyNote;

