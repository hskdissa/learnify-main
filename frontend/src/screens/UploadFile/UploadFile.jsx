import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Card, Form, Spinner, Alert } from "react-bootstrap";
import MainScreen from "../../components/MainScreen";
import { uploadFileAction } from "../../actions/uploadActions";

const UploadFile = () => {
  const [file, setFile] = useState(null);
  const dispatch = useDispatch();

  // get user login state
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const uploadFileState = useSelector((state) => state.uploadFile);
  const { loading, success, error, extractedText } = uploadFileState;

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (file && userInfo) {
      dispatch(uploadFileAction(file));
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

          {error && <Alert variant="danger" style={{ marginTop: 20 }}>{error}</Alert>}
          {success && <Alert variant="success" style={{ marginTop: 20 }}>File uploaded successfully!</Alert>}

          {extractedText && (
            <div style={{ marginTop: 20 }}>
              <h5>Extracted Text:</h5>
              <pre style={{ whiteSpace: "pre-wrap", backgroundColor: "#f8f9fa", padding: "10px", borderRadius: "5px" }}>
                {extractedText}
              </pre>
            </div>
          )}
        </Card.Body>
      </Card>
    </MainScreen>
  );
};

export default UploadFile;
