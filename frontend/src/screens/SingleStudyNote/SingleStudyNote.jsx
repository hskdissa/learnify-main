import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { Button, Card, Badge, Container } from "react-bootstrap";
import { getStudyNoteById } from "../../actions/studyNoteAction.jsx"; // Ensure this is the correct import
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";
import ReactMarkdown from "react-markdown";
import { jsPDF } from "jspdf";
import "jspdf-autotable"; 




const SingleStudyNote = () => {
  const dispatch = useDispatch();
  const { id } = useParams(); // Access the study note ID from the URL

  const studyNoteDetails = useSelector((state) => state.studyNoteDetails);
  const { loading, error, studyNote } = studyNoteDetails;


  const downloadPDF = () => {
    if (!studyNote) return;
  
    const doc = new jsPDF();
    const marginLeft = 10;
    const marginTop = 10;
    const maxWidth = 180; // Ensure text fits within the page width
    const lineSpacing = 6; // Adjusted line spacing to reduce the space between lines
  
    // Set the title of the study note
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(studyNote.title || "Study Note", marginLeft, marginTop);
  
    // Move to the next line after the title
    let yPosition = marginTop + 10;
  
    // Set body text format (normal text)
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
  
    // Function to handle bold text (e.g., for headings)
    const formatText = (text) => {
      // Bold text should be wrapped in ** (like markdown style)
      let formattedText = [];
      let parts = text.split("**");
  
      // Alternate between normal and bold
      parts.forEach((part, index) => {
        if (index % 2 === 0) {
          formattedText.push({ text: part, isBold: false });
        } else {
          formattedText.push({ text: part, isBold: true });
        }
      });
  
      return formattedText;
    };
  
    // Format the study note text and split it to fit the width
    const formattedText = formatText(studyNote.aiResponse || "No content available.");
    
    // Loop through the formatted text and add to the document
    formattedText.forEach(({ text, isBold }, index) => {
      // Apply bold formatting for the specific parts
      if (isBold) {
        doc.setFont("helvetica", "bold");
      } else {
        doc.setFont("helvetica", "normal");
      }
  
      // Split the text to fit within the maxWidth
      const splitText = doc.splitTextToSize(text, maxWidth);
  
      splitText.forEach((line, lineIndex) => {
        if (yPosition + 10 > doc.internal.pageSize.height - marginTop) {
          doc.addPage(); // Add a new page if text exceeds page limit
          yPosition = marginTop; // Reset yPosition for new page
        }
        doc.text(line, marginLeft, yPosition);
        yPosition += 10; // Move to the next line
      });
    });
  
    // Save the PDF
    doc.save(`${studyNote.title || "study_note"}.pdf`);
  };
  
  
  

  



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

              <Button onClick={() => downloadPDF(studyNote?.title, studyNote?.aiResponse)}>
                Download PDF
              </Button>

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
