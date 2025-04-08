import React, { useEffect } from 'react';
import MainScreen from '../../components/MainScreen';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Card, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { listStudyNotes, deleteStudyNote } from "../../actions/studyNoteAction.jsx";
import { listFlashcardsAction } from "../../actions/flashcardActions";
import { FaBook, FaLayerGroup, FaTrash } from 'react-icons/fa';
import Loading from '../../components/Loading';
import ErrorMessage from '../../components/ErrorMessage';

const Dashboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

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
            </div>

            <h3><FaBook /> My Study Notes</h3>
            {errorStudy && <ErrorMessage variant="danger">{errorStudy}</ErrorMessage>}
            {loadingStudy && <Loading />}
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
            {errorFlashcards && <ErrorMessage variant="danger">{errorFlashcards}</ErrorMessage>}
            {loadingFlashcards && <Loading />}
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
