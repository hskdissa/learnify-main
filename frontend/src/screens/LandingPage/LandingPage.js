import { Button, Container, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import "./LandingPage.css";

const LandingPage = () => {

    /*
    const navigate = useNavigate();

    useEffect(() => {
        const userInfo = localStorage.getItem("userInfo");

        if (userInfo) {
            navigate("/dashboard"); 
        }
    }, [navigate]);
    */
   
    return (
        <div className="main">
            <Container className="d-flex justify-content-center align-items-center text-center">
                <Row>
                    <div className="intro-text">
                        <div>
                            <h1 className="title">Welcome to Learnify</h1>
                            <p className="subtitle">Create Notes, Flashcards, and Practice Quizzes!</p>
                        </div>
                        <div className="buttonContainer">
                            {/* Link for client-side routing */}
                            <Link to="/login">
                                <Button size="lg" className="landingbutton">Login</Button>
                            </Link>
                            <Link to="/register">
                                <Button size="lg" className="landingbutton" variant="outline-primary">Register</Button>
                            </Link>
                        </div>
                    </div>
                </Row>
            </Container>
        </div>
    );
};

export default LandingPage;
