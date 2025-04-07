import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { uploadFileAction } from "../../actions/uploadActions";
import { generateAIContentAction } from '../../actions/openaiActions';
import { Card, Button, Alert, Form, Spinner } from 'react-bootstrap';
import MainScreen from "../../components/MainScreen";
import ReactMarkdown from 'react-markdown';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation

const UploadFile = () => {
  const [file, setFile] = useState(null);
  const [aiResponses, setAiResponses] = useState([]); 
  const [title, setTitle] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize useNavigate for navigation

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const uploadFileState = useSelector((state) => state.uploadFile);
  const { loading, success, error, extractedText } = uploadFileState;

  const openaiGenerate = useSelector((state) => state.openaiGenerate || {});
  const { aiResponse: openaiResponse, loading: openaiLoading, error: openaiError } = openaiGenerate;

  useEffect(() => {
    if (openaiResponse) {
      // Only add new responses if they are unique
      setAiResponses((prevResponses) => {
        // Prevent duplicate responses
        if (!prevResponses.some((response) => response.content === openaiResponse.content)) {
          return [...prevResponses, openaiResponse];
        }
        return prevResponses;
      });
    }
  }, [openaiResponse]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (file && userInfo) {
      dispatch(uploadFileAction(file));
    }
  };

  const handleGenerateAIContent = async () => {
    if (extractedText) {
      await dispatch(generateAIContentAction(extractedText, title));
    }
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard'); // Navigate back to the dashboard page
  };

  return (
    <MainScreen title="Upload Your Notes">
      <Card style={{ margin: "20px", borderRadius: "10px", backgroundColor: "#f4f4f9" }}>
        <Card.Body>
          <h4 style={{ color: "#333", fontWeight: "600", marginBottom: "20px" }}>Upload File</h4>

          {!userInfo ? (
            <Alert variant="warning" style={{ fontWeight: "bold" }}>
              You must be logged in to upload files.
            </Alert>
          ) : (
            <>
              <Form.Group controlId="fileUpload">
                <Form.Label>Select File</Form.Label>
                <Form.Control 
                  type="file" 
                  onChange={handleFileChange} 
                  style={{
                    padding: "12px", 
                    borderRadius: "8px", 
                    borderColor: "#ccc", 
                    marginBottom: "20px"
                  }} 
                />
                {file && (
                  <div style={{ marginTop: 10, display: 'flex', justifyContent: 'space-between' }}>
                    <strong>Selected File:</strong> {file.name}{" "}
                    <Button 
                      variant="outline-danger" 
                      size="sm" 
                      onClick={() => setFile(null)} 
                      style={{ borderRadius: '20px' }}
                    >
                      Clear
                    </Button>
                  </div>
                )}
                {error && <Alert variant="danger" style={{ marginTop: 10 }}>{error}</Alert>}
              </Form.Group>

              <Button
                onClick={handleUpload}
                style={{ marginTop: 10, borderRadius: "30px", background: "#5C6BC0", color: "#fff", borderColor: "#5C6BC0" }}
                size="lg"
                disabled={!file || loading}
              >
                {loading ? <Spinner animation="border" size="sm" /> : "Upload"}
              </Button>
            </>
          )}

          {/* Success Message */}
          {success && <Alert variant="success" style={{ marginTop: 20, borderRadius: "8px" }}>File uploaded successfully!</Alert>}

          {/* Title Input and AI Button */}
          {extractedText && (
            <div className="mt-4">
              <Form.Group controlId="noteTitle">
                <Form.Label style={{ fontWeight: "bold", fontSize: "18px" }}>Enter Study Note Title</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter a title for the study notes"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  style={{
                    padding: "10px", 
                    borderRadius: "5px", 
                    borderColor: "#ddd", 
                    backgroundColor: "#fff",
                    marginBottom: "20px"
                  }}
                />
              </Form.Group>

              <div className="text-center mt-3">
                <Button 
                  onClick={handleGenerateAIContent} 
                  size="lg" 
                  variant="success" 
                  disabled={!title || openaiLoading}
                  style={{
                    padding: "12px 20px", 
                    borderRadius: "50px", 
                    fontSize: "16px", 
                    background: "#4CAF50", 
                    border: "none", 
                    boxShadow: "0px 6px 8px rgba(0, 128, 0, 0.2)"
                  }}
                >
                  {openaiLoading ? <Spinner animation="border" size="sm" /> : "Generate Study Notes"}
                </Button>
              </div>
            </div>
          )}

          {openaiLoading && <Spinner animation="border" style={{ marginTop: 20 }} />}
          {openaiError && <Alert variant="danger" style={{ marginTop: 20, borderRadius: "8px" }}>{openaiError}</Alert>}

          {aiResponses.length > 0 && (
            <div style={{ marginTop: 20 }}>
              <h5 style={{ fontWeight: "600", color: "#333" }}>STUDY NOTES:</h5>
              {aiResponses.map((response, index) => {
                const content = response?.content || response; // Ensure it is a string
                return (
                  <Card key={index} style={{ padding: "15px", backgroundColor: "#f8f9fa", borderRadius: "10px", marginBottom: "20px" }}>
                    <ReactMarkdown>{content}</ReactMarkdown>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Back to Dashboard Button */}
          <div className="text-center" style={{ marginTop: "20px" }}>
            <Button 
              onClick={handleBackToDashboard} 
              style={{ borderRadius: "30px", backgroundColor: "#FF6F61", color: "#fff", padding: "10px 20px" }}
            >
              Back to Dashboard
            </Button>
          </div>
        </Card.Body>
      </Card>
    </MainScreen>
  );
};

export default UploadFile;
