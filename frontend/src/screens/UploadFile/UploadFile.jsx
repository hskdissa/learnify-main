import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { uploadFileAction } from "../../actions/uploadActions";
import { generateAIContentAction } from '../../actions/openaiActions';
import { Card, Button, Alert, Form, Spinner } from 'react-bootstrap';
import MainScreen from "../../components/MainScreen";

const UploadFile = () => {
  const [file, setFile] = useState(null);
  const dispatch = useDispatch();

<<<<<<< HEAD
  // get user login state
=======

>>>>>>> 2dc9157 (AI-generated Notes Implementation)
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const uploadFileState = useSelector((state) => state.uploadFile);
  const { loading, success, error, extractedText } = uploadFileState;

  const openaiGenerate = useSelector((state) => state.openaiGenerate || {});
  const { aiResponse: openaiResponse, loading: openaiLoading, error: openaiError } = openaiGenerate;

  console.log('OpenAI Response:', openaiResponse);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (file && userInfo) {
      dispatch(uploadFileAction(file));
    }
  };

  // handle AI content generation
  const handleGenerateAIContent = async () => {
    if (extractedText) {
      console.log('Dispatching AI content generation action');
      await dispatch(generateAIContentAction(extractedText));
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


          {success && <Alert variant="success" style={{ marginTop: 20 }}>File uploaded successfully!</Alert>}

          {extractedText && (
            <div style={{ marginTop: 20 }}>
              <h5>Extracted Text:</h5>
              <pre style={{
                whiteSpace: "pre-wrap",
                backgroundColor: "#f8f9fa",
                padding: "10px",
                borderRadius: "5px",
                maxHeight: "300px",
                overflowY: "auto"
              }}>
                {extractedText}
              </pre>
            </div>
          )}

          {openaiResponse && (
            <div style={{ marginTop: 20 }}>
              <h5>AI Response:</h5>
              <pre style={{
                whiteSpace: "pre-wrap",
                backgroundColor: "#f8f9fa",
                padding: "10px",
                borderRadius: "5px",
                maxHeight: "300px",
                overflowY: "auto"
              }}>
                {openaiResponse}
              </pre>
            </div>
          )}

          {openaiLoading && <Spinner animation="border" style={{ marginTop: 20 }} />}
          {openaiError && <Alert variant="danger" style={{ marginTop: 20 }}>{openaiError}</Alert>}

          {extractedText && !openaiLoading && (
            <Button 
              onClick={handleGenerateAIContent} 
              style={{ marginTop: 20 }} 
              size="lg"
            >
              Generate AI Content
            </Button>
          )}
        </Card.Body>
      </Card>
    </MainScreen>
  );
};

export default UploadFile;

