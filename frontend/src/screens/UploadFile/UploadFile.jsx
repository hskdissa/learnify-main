import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { uploadFileAction } from "../../actions/uploadActions";
import { generateAIContentAction } from "../../actions/openaiActions";
import { Card, Button, Alert, Form, Spinner } from "react-bootstrap";
import MainScreen from "../../components/MainScreen";
import ReactMarkdown from "react-markdown";
import { useNavigate } from "react-router-dom";

const UploadFile = () => {
  const [file, setFile] = useState(null);
  const [aiResponses, setAiResponses] = useState([]);
  const [title, setTitle] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const uploadFileState = useSelector((state) => state.uploadFile);
  const { loading, success, error, extractedText } = uploadFileState;

  const openaiGenerate = useSelector((state) => state.openaiGenerate || {});
  const { aiResponse: openaiResponse, loading: openaiLoading, error: openaiError } = openaiGenerate;

  useEffect(() => {
    if (openaiResponse) {
      setAiResponses((prevResponses) => {
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
    navigate("/dashboard");
  };

  return (
    <MainScreen title="Upload Your Notes">
      <Card className="p-4 mx-auto" style={{ maxWidth: "700px", borderRadius: "12px", boxShadow: "0px 4px 12px rgba(0,0,0,0.1)" }}>
        <Card.Body>
          <h4 className="text-center mb-4" style={{ color: "#2C3E50", fontWeight: "600" }}>Upload a File</h4>

          {!userInfo ? (
            <Alert variant="warning" className="text-center font-weight-bold">
              You must be logged in to upload files.
            </Alert>
          ) : (
            <>
              <Form.Group controlId="fileUpload">
                <Form.Label className="fw-bold">Select File</Form.Label>
                <Form.Control type="file" onChange={handleFileChange} className="mb-3" />
                {file && (
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="fw-semibold"> {file.name}</span>
                    <Button variant="outline-danger" size="sm" onClick={() => setFile(null)}>Clear</Button>
                  </div>
                )}
                {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
              </Form.Group>

              <Button variant="primary" size="lg" className="w-100 mt-3" disabled={!file || loading} onClick={handleUpload}>
                {loading ? <Spinner animation="border" size="sm" /> : "Upload"}
              </Button>
            </>
          )}

          {success && <Alert variant="success" className="mt-3 text-center">File uploaded successfully!</Alert>}

          {extractedText && (
            <div className="mt-4">
              <Form.Group controlId="noteTitle">
                <Form.Label className="fw-bold">Enter Study Note Title</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter a title for the study notes"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mb-3"
                />
              </Form.Group>

              <Button variant="success" size="lg" className="w-100" disabled={!title || openaiLoading} onClick={handleGenerateAIContent}>
                {openaiLoading ? <Spinner animation="border" size="sm" /> : "Generate Study Notes"}
              </Button>
            </div>
          )}

          {openaiLoading && <Spinner animation="border" className="d-block mx-auto my-3" />}
          {openaiError && <Alert variant="danger" className="mt-3"> {openaiError}</Alert>}

          {aiResponses.length > 0 && (
            <div className="mt-4">
              <h5 className="fw-bold"> Study Notes:</h5>
              {aiResponses.map((response, index) => (
                <Card key={index} className="p-3 mb-3 bg-light">
                  <ReactMarkdown>{response?.content || response}</ReactMarkdown>
                </Card>
              ))}
            </div>
          )}

          <div className="text-center mt-4">
            <Button variant="secondary" size="lg" className="w-100" onClick={handleBackToDashboard}>
               Back to Dashboard
            </Button>
          </div>
        </Card.Body>
      </Card>
    </MainScreen>
  );
};

export default UploadFile;
