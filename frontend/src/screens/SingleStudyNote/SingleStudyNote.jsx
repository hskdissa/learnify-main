import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Card, Badge, Container } from "react-bootstrap";
import { getStudyNoteById } from "../../actions/studyNoteAction";
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";
import ReactMarkdown from "react-markdown";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { generateFlashcardsAction } from "../../actions/flashcardActions";
import MainScreen from "../../components/MainScreen";
import { generateQuizAction, getQuizzesByStudyNoteIdAction } from "../../actions/quizActions"; 

const SingleStudyNote = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const studyNoteDetails = useSelector((state) => state.studyNoteDetails);
  const { loading, error, studyNote } = studyNoteDetails;

  const quizGeneration = useSelector((state) => state.quizGenerateReducer || {});
  const { loading: quizLoading, error: quizError, quiz } = quizGeneration;

  

  // Fetch study note by ID
  useEffect(() => {
    dispatch(getStudyNoteById(id));
  }, [dispatch, id]);


  // Fetch quizzes related to this study note
  useEffect(() => {
    if (studyNote && studyNote._id) {
      dispatch(getQuizzesByStudyNoteIdAction(studyNote._id)); // Fetch quizzes by study note ID
    }
  }, [dispatch, studyNote]);

  

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

  // Navigate to view flashcards
  const viewFlashcardsHandler = () => {
    navigate(`/studynote/${id}/flashcards`);
  };

  const handleGenerateQuiz = () => {
    if (id) {
      dispatch(generateQuizAction(id));
  
      // Navigate to QuizConfirmation while quiz is being generated
      navigate(`/quizzes/generate`, { state: { studyNoteId: id } });
    }
  };
  
  

  // Handle Start Quiz
  const handleStartQuiz = () => {
    if (quiz && quiz._id) {
      navigate(`/quiz/display/${quiz._id}`); // Navigate to QuizDisplay with quiz ID
    }
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
            <Card style={{ padding: "20px", boxShadow: "0px 4px 10px rgba(0,0,0,0.1)" }}>
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
                <div>
                  {studyNote.aiResponse ? (
                    <ReactMarkdown>{studyNote.aiResponse}</ReactMarkdown>
                  ) : (
                    <p className="text-muted">No AI-generated response available.</p>
                  )}
                </div>

                <Button onClick={downloadPDF} className="mt-3" variant="info">
                  Download PDF
                </Button>

                <Button
                  onClick={handleGenerateFlashcards}
                  className="mt-3 ms-3"
                  variant="primary"
                >
                  Generate Flashcards
                </Button>

                <Button
                  onClick={viewFlashcardsHandler}
                  className="mt-3 ms-3"
                  variant="primary"
                >
                  View Flashcards
                </Button>

                {/* Generate Quiz button */}
                <Button
                  onClick={handleGenerateQuiz}
                  className="mt-3 ms-3"
                  variant="primary"
                  disabled={quizLoading || quiz || quizError} // Disable if quiz is loading or already exists
                >
                  Generate Quiz
                </Button>

                {/* Start Quiz button */}
                <Button
                  onClick={handleStartQuiz}
                  className="mt-3 ms-3"
                  variant="primary"
                  disabled={!quiz || quizLoading} // Enable only if quiz exists
                >
                  Start Quiz
                </Button>

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
