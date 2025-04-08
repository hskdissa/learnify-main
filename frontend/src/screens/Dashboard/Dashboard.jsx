import React, { useEffect } from 'react';
import MainScreen from '../../components/MainScreen';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Card, Row, Col, Badge, ProgressBar } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { listStudyNotes, deleteStudyNote } from "../../actions/studyNoteAction.jsx";
import { listFlashcardsAction } from "../../actions/flashcardActions";
import { FaBook, FaTrash, FaStar } from 'react-icons/fa';
import Loading from '../../components/Loading';
import ErrorMessage from '../../components/ErrorMessage';
import { getTotalPoints } from '../../actions/userActions';  // Import the action

const Dashboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const studyNoteList = useSelector((state) => state.studyNoteList);
    const { loading: loadingStudy, studyNotes, error: errorStudy } = studyNoteList || {};

    const flashcardList = useSelector((state) => state.flashcardList);
    const { loading: loadingFlashcards, flashcards, error: errorFlashcards } = flashcardList || {};

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin || {};

    // Fetch total points and level from Redux state
    const userTotalPoints = useSelector(state => state.userTotalPoints);
    const { totalPoints, level, loading, error } = userTotalPoints;

    useEffect(() => {
        if (!userInfo) {
            navigate("/");
        } else {
            dispatch(listStudyNotes());
            dispatch(listFlashcardsAction());
            dispatch(getTotalPoints());  // Fetch total points and level when component mounts
        }
    }, [dispatch, userInfo, navigate]);

    const deleteHandler = (id) => {
        if (window.confirm("Are you sure you want to delete this study note?")) {
            dispatch(deleteStudyNote(id));
        }
    };

    // Calculate progress percentage for the level
    const levelProgress = (totalPoints % 50) / 50 * 100;

    return (
        <MainScreen title={`Welcome Back, ${userInfo?.name}!`}>
            {/* User Progress Card */}
            <div className="mb-5">
                {loading ? (
                    <p>Loading...</p>
                ) : error ? (
                    <p className="text-danger">{error}</p>
                ) : (
                    <Card className="shadow rounded-3 border-0 p-4" style={{ background: 'linear-gradient(135deg, #00bcd4, #4caf50)' }}>
                        <Card.Body>
                            <Card.Title className="text-center mb-4" style={{ fontSize: '28px', fontWeight: 'bold', color: '#fff' }}>
                                <FaStar color="#FFD700" size={36} />
                                <strong>Your Progress</strong>
                            </Card.Title>
                            <div className="text-center mb-4">
                                <h5 style={{ fontSize: '24px', color: '#fff' }}>Points: <strong>{totalPoints}</strong></h5>
                                <h6 style={{ fontSize: '20px', color: '#fff' }}>Level: <strong>{level}</strong></h6>
                            </div>

                            <ProgressBar
                                now={levelProgress}
                                label={`${levelProgress.toFixed(0)}%`}
                                variant="info"
                                animated
                            />
                            <div className="mt-3 text-center">
                                <Badge pill bg="primary" className="me-2" style={{ fontSize: '18px' }}>
                                    Level {level}
                                </Badge>
                                <Badge pill bg="success" style={{ fontSize: '18px' }}>
                                    {totalPoints} Points
                                </Badge>
                            </div>
                        </Card.Body>
                    </Card>
                )}
            </div>

            {/* Study Notes Section */}
            <div style={styles.background}>
                <div className="d-flex justify-content-between align-items-center mb-5">
                    <div>
                        <Link to="/uploadfile">
                            <Button variant="primary" size="lg" style={{ fontSize: '18px', padding: '12px 24px' }}>Upload Notes</Button>
                        </Link>
                    </div>
                </div>

                <h3 className="text-dark" style={{ fontSize: '28px', fontWeight: 'bold', color: '#333' }}>
                    <FaBook /> My Study Notes
                </h3>
                {errorStudy && <ErrorMessage variant="danger">{errorStudy}</ErrorMessage>}
                {loadingStudy && <Loading />}
                {!loadingStudy && !errorStudy && studyNotes?.length > 0 && (
                    <Row>
                        {studyNotes.map((studyNote) => (
                            <Col key={studyNote._id} md={6} lg={4} xl={3} className="mb-4">
                                <Card className="shadow-lg rounded-3 border-0" style={{ transition: 'transform 0.3s ease', borderRadius: '10px' }} 
                                      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                                      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                                    <Card.Body>
                                        <Card.Title className="fw-bold" style={{ fontSize: '20px', color: '#333' }}>{studyNote.title}</Card.Title>
                                        <div className="border p-2 bg-light rounded">
                                            <strong>AI Response:</strong> {studyNote.aiResponse?.substring(0, 100)}...
                                        </div>
                                        <div className="d-flex justify-content-between mt-3">
                                            <Link to={`/studynote/${studyNote._id}`}>
                                                <Button variant="primary" size="sm" style={{ fontSize: '14px', padding: '6px 12px' }}>Study</Button>
                                            </Link>
                                            <Button variant="danger" size="sm" onClick={() => deleteHandler(studyNote._id)} style={{ fontSize: '14px', padding: '6px 12px' }}>
                                                <FaTrash />
                                            </Button>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                )}
            </div>
        </MainScreen>
    );
};

const styles = {
    background: {
        backgroundColor: '#f0f8ff',
        minHeight: '100vh',
        padding: '30px',
        borderRadius: '10px',
    },
};

export default Dashboard;
