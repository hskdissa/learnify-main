import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { uploadFileAction } from "../../actions/uploadActions";
import { generateAIContentAction } from '../../actions/openaiActions';
import { Card, Button, Alert, Form, Spinner } from 'react-bootstrap';
import MainScreen from "../../components/MainScreen";
import ReactMarkdown from 'react-markdown';

const UploadFile = () => {
  const [file, setFile] = useState(null);
  const [aiResponses, setAiResponses] = useState([]); 
  const [title, setTitle] = useState("");
  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const uploadFileState = useSelector((state) => state.uploadFile);
  const { loading, success, error, extractedText } = uploadFileState;

  const openaiGenerate = useSelector((state) => state.openaiGenerate || {});
  const { aiResponse: openaiResponse, loading: openaiLoading, error: openaiError } = openaiGenerate;

  console.log('OpenAI Response:', openaiResponse);

  useEffect(() => {
    if (openaiResponse) {
      setAiResponses((prevResponses) => [...prevResponses, openaiResponse]);
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
      console.log('Dispatching AI content generation action');
      await dispatch(generateAIContentAction(extractedText, title));
    }
  };

  return (
    <MainScreen title="Upload Your Notes">
      <Card style={{ margin: 10 }}>
        <Card.Body>
          <h4>Upload File</h4>

          {!userInfo ? (
            <Alert variant="warning">You must be logged in to upload files.</Alert>
          ) : (
            <>
              <Form.Group controlId="fileUpload">
                <Form.Label>Select File</Form.Label>
                <Form.Control type="file" onChange={handleFileChange} />
                {file && (
                  <div style={{ marginTop: 10 }}>
                    <strong>Selected File:</strong> {file.name}{" "}
                    <Button 
                      variant="outline-danger" 
                      size="sm" 
                      onClick={() => setFile(null)}
                    >
                      Clear
                    </Button>
                  </div>
                )}
                {error && <Alert variant="danger" style={{ marginTop: 10 }}>{error}</Alert>}
              </Form.Group>

              <Button
                onClick={handleUpload}
                style={{ marginTop: 10 }}
                size="lg"
                disabled={!file || loading}
              >
                {loading ? <Spinner animation="border" size="sm" /> : "Upload"}
              </Button>
            </>
          )}

          {/* Success Message */}
          {success && <Alert variant="success" style={{ marginTop: 20 }}>File uploaded successfully!</Alert>}

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
                  style={{ padding: "10px", borderRadius: "5px" }}
                />
              </Form.Group>

              <div className="text-center mt-3">
                <Button onClick={handleGenerateAIContent} size="lg" variant="success" disabled={!title || openaiLoading}>
                  {openaiLoading ? <Spinner animation="border" size="sm" /> : "Generate Study Notes"}
                </Button>
              </div>
            </div>
          )}

          {openaiLoading && <Spinner animation="border" style={{ marginTop: 20 }} />}
          {openaiError && <Alert variant="danger" style={{ marginTop: 20 }}>{openaiError}</Alert>}

          {aiResponses.length > 0 && (
            <div style={{ marginTop: 20 }}>
              <h5>STUDY NOTES:</h5>
              {aiResponses.map((response, index) => {
                const content = response?.content || response; // Ensure it is a string
                return (
                  <Card key={index} style={{ padding: "15px", backgroundColor: "#f8f9fa", borderRadius: "5px", marginBottom: "10px" }}>
                    <ReactMarkdown>{content}</ReactMarkdown>
                  </Card>
                );
              })}
            </div>
          )}
          
          
        </Card.Body>
      </Card>
    </MainScreen>
  );
};

export default UploadFile;

