import React, { useEffect } from 'react';
import MainScreen from '../../components/MainScreen';
import { Link, useNavigate } from 'react-router-dom';
import { Accordion, Badge, Button, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { listNotes } from '../../actions/noteActions';
import { listStudyNotes } from "../../actions/studyNoteAction.jsx";


import Loading from '../../components/Loading';
import ErrorMessage from '../../components/ErrorMessage'; 

const Dashboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Fetch notes from Redux store
    const noteList = useSelector((state) => state.noteList);
    const { loading, notes, error } = noteList;

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

    useEffect(() => {
        if (!userInfo) {
            navigate("/"); // redirect to home if not logged in
        } else {
            dispatch(listNotes()); // fetch notes only if user is logged in
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
        </MainScreen>
    );
};

export default Dashboard;
