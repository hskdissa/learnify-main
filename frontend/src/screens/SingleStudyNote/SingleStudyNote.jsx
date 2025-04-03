import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { Button, Card, Badge, Accordion } from 'react-bootstrap';
//import { getStudyNoteById } from '../../actions/studyNoteActions'; // You need to implement this action
import Loading from '../../components/Loading';
import ErrorMessage from '../../components/ErrorMessage';

const SingleStudyNote = () => {
  const dispatch = useDispatch();
  const { id } = useParams(); // Access the study note ID from the URL

  const studyNoteDetails = useSelector((state) => state.studyNoteDetails);
  const { loading, error, studyNote } = studyNoteDetails;

  useEffect(() => {
    dispatch(getStudyNoteById(id)); // Fetch study note by ID
  }, [dispatch, id]);

  return (
    <div>
      {loading && <Loading />}
      {error && <ErrorMessage variant='danger'>{error}</ErrorMessage>}
      {studyNote && (
        <Card style={{ margin: 10 }}>
          <Card.Header style={{ display: 'flex' }}>
            <span
              style={{
                color: 'black',
                textDecoration: 'none',
                flex: 1,
                cursor: 'pointer',
                alignSelf: 'center',
                fontSize: 18,
              }}
            >
              Study Note
            </span>
          </Card.Header>
          <Accordion.Body>
            <Card.Body>
              <h4>
                <Badge bg="success">Topic - {studyNote.title || 'No Title'}</Badge>
              </h4>
              <blockquote className="blockquote mb-0">
                <p>{studyNote.content}</p>
                <footer className="blockquote-footer">
                  Created On{" "}
                  <cite title="Source Title">
                    {new Date(studyNote.createdAt).toLocaleDateString()}
                  </cite>
                </footer>
              </blockquote>
            </Card.Body>
          </Accordion.Body>
        </Card>
      )}

      <Link to="/dashboard">
        <Button style={{ marginTop: 20 }} variant="primary">
          Back to Dashboard
        </Button>
      </Link>
    </div>
  );
};

export default SingleStudyNote;
