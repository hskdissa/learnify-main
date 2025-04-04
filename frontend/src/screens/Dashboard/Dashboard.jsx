import React, { useEffect } from 'react';
import MainScreen from '../../components/MainScreen';
import { Link, useNavigate } from 'react-router-dom';
import { Carousel, Accordion, Badge, Button, Card, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { listNotes } from '../../actions/noteActions';
import { listStudyNotes, deleteStudyNote } from "../../actions/studyNoteAction.jsx";




import Loading from '../../components/Loading';
import ErrorMessage from '../../components/ErrorMessage'; 

const Dashboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Fetch notes from Redux store
    const noteList = useSelector((state) => state.noteList);
    const { loading, notes, error } = noteList;


    // Fetch study notes from Redux store
    const studyNoteList = useSelector((state) => state.studyNoteList);
    const { loading: loadingStudy, studyNotes, error: errorStudy } = studyNoteList;

    const studyNoteDelete = useSelector((state) => state.studyNoteDelete);
    const { success: successDelete } = studyNoteDelete;


    // Fetch user login info from Redux store
    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    // Get the note creation state from Redux
    const noteCreate = useSelector((state) => state.noteCreate);
    const { success: successCreate } = noteCreate;

    const deleteHandler = (id) => {
        if (window.confirm('Are you sure?')) {
            // Add delete logic here
        }
    };

    console.log(notes);
    console.log(studyNotes);


    useEffect(() => {
        if (!userInfo) {
            navigate("/"); // redirect to home if not logged in
        } else {
            dispatch(listNotes()); // fetch notes only if user is logged in
            dispatch(listStudyNotes()); // Fetch study notes
        }
    }, [dispatch, userInfo, navigate, successCreate]); // add userInfo & navigate as dependencies

    // Add a check for userInfo before trying to access userInfo.name
    if (!userInfo) {
        return <div>Loading...</div>; // or redirect to login page
    }


    
    return (
        <MainScreen title={`Welcome Back ${userInfo.name}..`}>
            <Link to="/uploadfile">
                <Button style={{ marginLeft: 10, marginBottom: 6 }} size="lg">
                    Upload Notes
                </Button>
            </Link>

            <Link to="/createnote">
                <Button style={{ marginLeft: 10, marginBottom: 6 }} size="lg">
                    Add Reminder
                </Button>
            </Link>

            {error && <ErrorMessage variant='danger'>{error}</ErrorMessage>}
            {loading && <Loading />} 

            {/* Display Notes */}
            <h3>My Notes</h3>
            {!loading && !error && (
                <Accordion defaultActiveKey="0">
                    {[...notes].reverse().map((note) => (
                        <Accordion.Item key={note._id} eventKey={note._id}>
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
                                        <Accordion.Button as="div">{note.title}</Accordion.Button>
                                    </span>
                                    <div>
                                    <Link to={`/note/${note._id}`}>
                                        <Button>Edit</Button>
                                    </Link>

                                        <Button
                                            variant="danger"
                                            className="mx-2"
                                            onClick={() => deleteHandler(note._id)}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </Card.Header>
                                <Accordion.Body>
                                    <Card.Body>
                                        <h4>
                                            <Badge bg="success">Category - {note.category}</Badge>
                                        </h4>
                                        <blockquote className="blockquote mb-0">
                                            <p>{note.content}</p>
                                            <footer className="blockquote-footer">
                                                Created On{" "}
                                                <cite title="Source Title">
                                                    {note.createdAt.substring(0, 10)}
                                                </cite>
                                            </footer>
                                        </blockquote>
                                    </Card.Body>
                                </Accordion.Body>
                            </Card>
                        </Accordion.Item>
                    ))}
                </Accordion>
            )}


            {/* Display Study Notes */}
            <h3>My Study Notes</h3>
            {!loadingStudy && !errorStudy && studyNotes?.length > 0 && (
                <Carousel fade interval={5000} controls>
                    {/* Add each slide with two cards */}
                    {studyNotes.map((studyNote, index) => (
                        index % 2 === 0 && (
                            <Carousel.Item key={studyNote._id}>
                                <Row className="justify-content-center">
                                    {/* Display two cards per slide */}
                                    <Col md={6} lg={5} xl={4} style={{ marginBottom: '20px' }}>
                                        <Card style={{ width: '100%', height: '100%' }}>
                                            <Card.Body>
                                                <Card.Title>{studyNote.title}</Card.Title>

                                                {/* AI Response Preview */}
                                                <div
                                                    style={{
                                                        maxHeight: '150px',
                                                        overflow: 'auto',
                                                        border: '1px solid #ddd',
                                                        padding: '10px',
                                                        borderRadius: '5px',
                                                        background: '#f8f9fa',
                                                        fontSize: '14px',
                                                        whiteSpace: 'pre-line'
                                                    }}
                                                >
                                                    <strong>AI Response:</strong>
                                                    {studyNote.aiResponse
                                                        ? studyNote.aiResponse.substring(0, 150) + "..."
                                                        : "No AI-generated response available."}
                                                </div>

                                                <div className="d-flex justify-content-between mt-2">
                                                    <Link to={`/studynote/${studyNote._id}`}>
                                                        <Button variant="primary" size="sm">
                                                            Study
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        variant="danger"
                                                        size="sm"
                                                        onClick={() => deleteHandler(studyNote._id)}
                                                    >
                                                        Delete
                                                    </Button>
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    </Col>

                                    {/* Check for next card to display in the same slide */}
                                    {studyNotes[index + 1] && (
                                        <Col md={6} lg={5} xl={4} style={{ marginBottom: '20px' }}>
                                            <Card style={{ width: '100%', height: '100%' }}>
                                                <Card.Body>
                                                    <Card.Title>{studyNotes[index + 1].title}</Card.Title>

                                                    {/* AI Response Preview */}
                                                    <div
                                                        style={{
                                                            maxHeight: '150px',
                                                            overflow: 'auto',
                                                            border: '1px solid #ddd',
                                                            padding: '10px',
                                                            borderRadius: '5px',
                                                            background: '#f8f9fa',
                                                            fontSize: '14px',
                                                            whiteSpace: 'pre-line'
                                                        }}
                                                    >
                                                        <strong>AI Response:</strong>
                                                        {studyNotes[index + 1].aiResponse
                                                            ? studyNotes[index + 1].aiResponse.substring(0, 150) + "..."
                                                            : "No AI-generated response available."}
                                                    </div>

                                                    <div className="d-flex justify-content-between mt-2">
                                                        <Link to={`/studynote/${studyNotes[index + 1]._id}`}>
                                                            <Button variant="primary" size="sm">
                                                                Study
                                                            </Button>
                                                        </Link>
                                                        <Button
                                                            variant="danger"
                                                            size="sm"
                                                            onClick={() => deleteHandler(studyNotes[index + 1]._id)}
                                                        >
                                                            Delete
                                                        </Button>
                                                    </div>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    )}
                                </Row>
                            </Carousel.Item>
                        )
                    ))}
                </Carousel>
            )}


        </MainScreen>
    );
};

export default Dashboard;
