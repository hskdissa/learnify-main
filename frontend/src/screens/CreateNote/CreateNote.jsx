import React, { useEffect, useState } from 'react';
import MainScreen from '../../components/MainScreen';
import { Button, Card, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { createNoteAction } from '../../actions/noteActions';
import Loading from '../../components/Loading';
import ErrorMessage from '../../components/ErrorMessage';
import ReactMarkdown from 'react-markdown';
import { useNavigate } from 'react-router-dom';

function CreateNote() {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [category, setCategory] = useState("");
  
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Get the note creation state from Redux
    const noteCreate = useSelector((state) => state.noteCreate);
    const { loading, error, note } = noteCreate;

    const resetHandler = () => {
      setTitle("");
      setCategory("");
      setContent("");
    };

    const submitHandler = (e) => {
      e.preventDefault();
      if (!title || !content || !category) return;
      dispatch(createNoteAction(title, content, category));
    };

    useEffect(() => {
      // Redirect to dashboard if note is created successfully
      if (note) {
        navigate("/dashboard");
      }
    }, [note, navigate]); // Re-run this effect whenever the note state changes

    return (
        <MainScreen title="Create a Note">
          <Card>
            <Card.Header>Create a new Reminder</Card.Header>
            <Card.Body>
              <Form onSubmit={submitHandler}>
                {error && <ErrorMessage variant="danger">{error}</ErrorMessage>}
                <Form.Group controlId="title">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    value={title}
                    placeholder="Enter the title"
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </Form.Group>
    
                <Form.Group controlId="content">
                  <Form.Label>Content</Form.Label>
                  <Form.Control
                    as="textarea"
                    value={content}
                    placeholder="Enter the content"
                    rows={4}
                    onChange={(e) => setContent(e.target.value)}
                  />
                </Form.Group>
                
                {content && (
                  <Card>
                    <Card.Header>Reminder Preview</Card.Header>
                    <Card.Body>
                      <ReactMarkdown>{content}</ReactMarkdown>
                    </Card.Body>
                  </Card>
                )}

                <Form.Group controlId="category">
                  <Form.Label>Category</Form.Label>
                  <Form.Control
                    type="text"
                    value={category}
                    placeholder="Enter the Category"
                    onChange={(e) => setCategory(e.target.value)}
                  />
                </Form.Group>

                {loading && <Loading size={50} />}
                
                <Button type="submit" variant="primary">
                  Create Note
                </Button>
                <Button className="mx-2" onClick={resetHandler} variant="danger">
                  Reset Fields
                </Button>
              </Form>
            </Card.Body>

            <Card.Footer className="text-muted">
              {note ? `Created on - ${new Date(note.createdAt).toLocaleDateString()}` : 'Creating on - ' + new Date().toLocaleDateString()}
            </Card.Footer>
          </Card>
        </MainScreen>
    );
}

export default CreateNote;
