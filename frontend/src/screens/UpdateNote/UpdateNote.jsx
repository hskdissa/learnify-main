import React, { useEffect, useState } from "react";
import MainScreen from "../../components/MainScreen";
import axios from "axios";
import { Button, Card, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { deleteNoteAction, updateNoteAction } from "../../actions/noteActions";
import ErrorMessage from "../../components/ErrorMessage";
import Loading from "../../components/Loading";
import ReactMarkdown from "react-markdown";
import { useParams, useNavigate } from "react-router-dom";

const UpdateNote = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [category, setCategory] = useState("");
    const [date, setDate] = useState("");

    const noteUpdate = useSelector((state) => state.noteUpdate);
    const { loading, error } = noteUpdate;

    const noteDelete = useSelector((state) => state.noteDelete);
    const { loading: loadingDelete, error: errorDelete } = noteDelete;

    // Fetch note using the authorization token
    useEffect(() => {
        const fetchNote = async () => {
            const token = localStorage.getItem("authToken");
            if (!token) {
                console.error("No authorization token found");
                return;
            }
            try {
                const { data } = await axios.get(`/api/notes/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setTitle(data.title);
                setContent(data.content);
                setCategory(data.category);
                setDate(data.updatedAt);
            } catch (error) {
                console.error("Error fetching note:", error);
            }
        };

        fetchNote();
    }, [id]);

    const resetHandler = () => {
        setTitle("");
        setCategory("");
        setContent("");
    };

    const updateHandler = (e) => {
        e.preventDefault();

        const token = localStorage.getItem("authToken");
        if (!token) {
            console.error("No authorization token found");
            return;
        }

        if (!title || !content || !category) return;

        dispatch(updateNoteAction(id, title, content, category, token)); // Pass the token here
        resetHandler();
        navigate("/dashboard"); // Redirect after updating
    };

    const deleteHandler = () => {
        if (window.confirm("Are you sure?")) {
            const token = localStorage.getItem("authToken");
            if (!token) {
                console.error("No authorization token found");
                return;
            }

            dispatch(deleteNoteAction(id, token)); // Pass the token here
            navigate("/dashboard"); // Redirect after deleting
        }
    };

    return (
        <MainScreen title="Edit Note">
            <Card>
                <Card.Header>Edit your Note</Card.Header>
                <Card.Body>
                    <Form onSubmit={updateHandler}>
                        {loadingDelete && <Loading />}
                        {error && <ErrorMessage variant="danger">{error}</ErrorMessage>}
                        {errorDelete && <ErrorMessage variant="danger">{errorDelete}</ErrorMessage>}

                        <Form.Group controlId="title">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter the title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group controlId="content">
                            <Form.Label>Content</Form.Label>
                            <Form.Control
                                as="textarea"
                                placeholder="Enter the content"
                                rows={4}
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                            />
                        </Form.Group>

                        {content && (
                            <Card className="mt-3">
                                <Card.Header>Note Preview</Card.Header>
                                <Card.Body>
                                    <ReactMarkdown>{content}</ReactMarkdown>
                                </Card.Body>
                            </Card>
                        )}

                        <Form.Group controlId="category">
                            <Form.Label>Category</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter the Category"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            />
                        </Form.Group>

                        {loading && <Loading size={50} />}
                        <Button variant="primary" type="submit" className="mt-3">
                            Update Note
                        </Button>
                        <Button className="mx-2 mt-3" variant="danger" onClick={deleteHandler}>
                            Delete Note
                        </Button>
                    </Form>
                </Card.Body>

                <Card.Footer className="text-muted">
                    Updated on - {date ? date.substring(0, 10) : "N/A"}
                </Card.Footer>
            </Card>
        </MainScreen>
    );
};

export default UpdateNote;
