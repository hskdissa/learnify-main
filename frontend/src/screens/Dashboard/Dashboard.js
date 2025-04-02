import React, { useEffect, useState } from 'react';
import MainScreen from '../../components/MainScreen';
import { Link } from 'react-router-dom';
import { Accordion, Badge, Button, Card } from 'react-bootstrap';
import axios from 'axios';

const Dashboard = () => {

    
    const [notes, setNotes] = useState([]);

    // Fetch notes from API
    const fetchNotes = async () => {
        try {
            const { data } = await axios.get('/api/notes');
            console.log("Fetched Notes:", data); // Check if the notes are fetched
            setNotes(data); // Set the notes correctly in the state
        } catch (error) {
            console.error("Error fetching notes:", error);
        }
    };

    console.log(notes);

    useEffect(() => {
        fetchNotes();
    }, []);

    const deleteHandler = (id) => {
        if (window.confirm("Are you sure?")) {
            // Add delete logic here (optional)
        }
    };

    return (
        <MainScreen title="Welcome Keshika Dissanayaka..">
            <Link to="/uploadfile">
                <Button style={{ marginLeft: 10, marginBottom: 6 }} size="lg">
                    Create Notes
                </Button>
            </Link>

            <Accordion defaultActiveKey="0">
                {notes.map((note) => (
                    <Accordion.Item key={note._id} eventKey={note._id}>
                        <Card style={{ margin: 10 }}>
                            <Card.Header style={{ display: "flex" }}>
                                <span
                                    style={{
                                        color: "black",
                                        textDecoration: "none",
                                        flex: 1,
                                        cursor: "pointer",
                                        alignSelf: "center",
                                        fontSize: 18,
                                    }}
                                >
                                    <Accordion.Button as="div">
                                        {note.title}
                                    </Accordion.Button>
                                </span>

                                <div>
                                    <Button href="/study">Study</Button>
                                    <Button variant="danger" className="mx-2" onClick={() => deleteHandler(note._id)}>
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
                                        <footer className="blockquote-footer">Created On - date</footer>
                                    </blockquote>
                                </Card.Body>
                            </Accordion.Body>
                        </Card>
                    </Accordion.Item>
                ))}
            </Accordion>
        </MainScreen>
    );
};

export default Dashboard;
