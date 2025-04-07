import React, { useEffect } from 'react';
import MainScreen from '../../components/MainScreen';
import { Link, useNavigate } from 'react-router-dom';
import { Accordion, Badge, Button, Card, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { listNotes } from '../../actions/noteActions';
import { listStudyNotes, deleteStudyNote } from "../../actions/studyNoteAction.jsx";
import { listFlashcardsAction } from "../../actions/flashcardActions";
import { FaEdit, FaTrash, FaBook, FaLayerGroup,  } from 'react-icons/fa';
import Loading from '../../components/Loading';
import ErrorMessage from '../../components/ErrorMessage';

const Dashboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const noteList = useSelector((state) => state.noteList);
    const { loading, notes, error } = noteList || {};

    const studyNoteList = useSelector((state) => state.studyNoteList);
    const { loading: loadingStudy, studyNotes, error: errorStudy } = studyNoteList || {};

    const flashcardList = useSelector((state) => state.flashcardList);
    const { loading: loadingFlashcards, flashcards, error: errorFlashcards } = flashcardList || {};

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin || {};

    useEffect(() => {
        if (!userInfo) {
            navigate("/");
        } else {
            dispatch(listNotes());
            dispatch(listStudyNotes());
            dispatch(listFlashcardsAction());
        }
    }, [dispatch, userInfo, navigate]);

    const deleteHandler = (id) => {
        if (window.confirm("Are you sure you want to delete this study note?")) {
            dispatch(deleteStudyNote(id));
        }
    };

    return (
        <MainScreen title={`Welcome Back, ${userInfo?.name}!`}>
            <div className="d-flex gap-3 mb-4">
                <Link to="/uploadfile">
                    <Button variant="primary" size="lg">Upload Notes</Button>
                </Link>
                <Link to="/createnote">
                    <Button variant="secondary" size="lg">Add Reminder</Button>
                </Link>
            </div>

            {error && <ErrorMessage variant='danger'>{error}</ErrorMessage>}
            {loading && <Loading />} 

            <h3><FaBook /> My Notes</h3>
            {!loading && !error && notes?.length > 0 && (
                <Accordion defaultActiveKey="0">
                    {notes.map((note) => (
                        <Accordion.Item key={note._id} eventKey={note._id}>
                            <Card className="shadow-sm rounded mb-3">
                                <Card.Header className="d-flex justify-content-between align-items-center">
                                    <Accordion.Button as="div" className="fw-bold">{note.title}</Accordion.Button>
                                    <div>
                                        <Link to={`/note/${note._id}`}>
                                            <Button variant="outline-success" className="me-2">
                                                <FaEdit />
                                            </Button>
                                        </Link>
                                        <Button variant="outline-danger" onClick={() => deleteHandler(note._id)}>
                                            <FaTrash />
                                        </Button>
                                    </div>
                                </Card.Header>
                                <Accordion.Body>
                                    <Card.Body>
                                        <h5><Badge bg="success">{note.category}</Badge></h5>
                                        <p>{note.content}</p>
                                        <footer className="blockquote-footer">Created On {note.createdAt.substring(0, 10)}</footer>
                                    </Card.Body>
                                </Accordion.Body>
                            </Card>
                        </Accordion.Item>
                    ))}
                </Accordion>
            )}

            <h3><FaBook /> My Study Notes</h3>
            {!loadingStudy && !errorStudy && studyNotes?.length > 0 && (
                <Row>
                    {studyNotes.map((studyNote) => (
                        <Col key={studyNote._id} md={6} lg={4} xl={3} className="mb-4">
                            <Card className="shadow-sm rounded">
                                <Card.Body>
                                    <Card.Title>{studyNote.title}</Card.Title>
                                    <div className="border p-2 bg-light rounded">
                                        <strong>AI Response:</strong> {studyNote.aiResponse?.substring(0, 100)}...
                                    </div>
                                    <div className="d-flex justify-content-between mt-3">
                                        <Link to={`/studynote/${studyNote._id}`}>
                                            <Button variant="primary" size="sm">Study</Button>
                                        </Link>
                                        <Button variant="danger" size="sm" onClick={() => deleteHandler(studyNote._id)}>
                                            <FaTrash />
                                        </Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}

            <h3><FaLayerGroup /> My Flashcards</h3>
            {loadingFlashcards && <Loading />}
            {errorFlashcards && <ErrorMessage variant="danger">{errorFlashcards}</ErrorMessage>}
            {!loadingFlashcards && !errorFlashcards && flashcards?.length > 0 && (
                <Row>
                    {flashcards.map((flashcard) => (
                        <Col key={flashcard._id} md={6} lg={4} xl={3} className="mb-4">
                            <Card className="shadow-sm rounded">
                                <Card.Body>
                                    <Card.Title>{flashcard.title}</Card.Title>
                                    <p>{flashcard.question}</p>
                                    <p>{flashcard.answer}</p>
                                    <Link to={`/flashcard/${flashcard._id}`}>
                                        <Button variant="primary" size="sm">Study Flashcard</Button>
                                    </Link>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
        </MainScreen>
    );
};

export default Dashboard;
