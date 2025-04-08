import { Button, Container, Row, Col, Card } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Typical from "react-typical"; 
import { motion, useScroll, useTransform } from "framer-motion";
import "./LandingPage.css";

const LandingPage = () => {
    const navigate = useNavigate();
    useEffect(() => {
        const userInfo = localStorage.getItem("userInfo");
        if (userInfo) {
            navigate("/dashboard");
        }
    }, [navigate]);

    const { scrollYProgress } = useScroll();

    const fadeOutHero = useTransform(scrollYProgress, [0.1, 0.5], [1, 0.3]);
    const fadeOutFeatures = useTransform(scrollYProgress, [0.5, 0.9], [1, 0.3]);
    const fadeInRegister = useTransform(scrollYProgress, [0.8, 1], [0, 1]);

    return (
        <div className="landing-page">
<motion.section 
    className="hero-section"
    style={{ opacity: fadeOutHero }}
>
    <Container className="text-center">
        <h1 className="title">Welcome to Learnify</h1>
        <p className="subtitle">
            <motion.div className="typical-container">
                <Typical
                    steps={[
                        "Simplify your notes", 3000,
                        "Create digital flashcards", 3000,
                        "Test your knowledge with tailored quizzes!", 3000
                    ]}
                    loop={Infinity} 
                    wrapper="span"
                />
            </motion.div>
        </p>
        <div className="buttonContainer">
            <Link to="/login">
                <Button size="lg" className="landingbutton">Login</Button>
            </Link>
            <Link to="/register">
                <Button size="lg" className="landingbutton" variant="outline-primary">Register</Button>
            </Link>
        </div>
    </Container>
</motion.section>


            {/* Feature Sections with Smooth Fading */}
            <motion.section 
                className="features"
                style={{ opacity: fadeOutFeatures }}
            >
                <Container>
                    <motion.div 
                        className="feature"
                        initial={{ opacity: 0, y: 50 }} 
                        whileInView={{ opacity: 1, y: 0 }} 
                        transition={{ duration: 1 }}
                        viewport={{ once: true }}
                    >
                        <h2>Create simplified notes</h2>
                        <p>Generate well-structured and simplified study notes instantly using AI.</p>
                    </motion.div>

                    <motion.div 
                        className="feature"
                        initial={{ opacity: 0, y: 50 }} 
                        whileInView={{ opacity: 1, y: 0 }} 
                        transition={{ duration: 1, delay: 0.2 }}
                        viewport={{ once: true }}
                    >
                        <h2>Generate Digital Flashcards</h2>
                        <p>Create AI-powered flashcards to reinforce learning effectively.</p>
                    </motion.div>

                    <motion.div 
                        className="feature"
                        initial={{ opacity: 0, y: 50 }} 
                        whileInView={{ opacity: 1, y: 0 }} 
                        transition={{ duration: 1, delay: 0.4 }}
                        viewport={{ once: true }}
                    >
                        <h2>Interactive quiz</h2>
                        <p>Test your knowledge with AI-generated quizzes and track progress.</p>
                    </motion.div>
                </Container>
            </motion.section>

            {/* Register Today Section with Fade-in */}
            <motion.section 
                className="register-section"
                style={{ opacity: fadeInRegister }}
            >
                <Container className="text-center">
                    <h2>Register Today to Get Started!</h2>
                    <p>Unlock personalised learning experiences with AI-powered study tools.</p>
                    <Link to="/register">
                        <Button size="lg" className="landingbutton">Register Now</Button>
                    </Link>
                </Container>
            </motion.section>

            {/* Reviews Section */}
            <section className="reviews">
                <Container>
                    <h2 className="text-center">What Our Users Say</h2>
                    <Row>
                        {[
                            { name: "Alex Johnson", review: "Learnify made studying so much easier!" },
                            { name: "Emily Carter", review: "The AI-generated quizzes are a game-changer!" },
                            { name: "Michael Lee", review: "These flashcards tailored to my study notes help me retain information quickly." }
                        ].map((review, index) => (
                            <Col md={4} key={index}>
                                <Card className="review-card shadow-sm">
                                    <Card.Body>
                                        <Card.Text>"{review.review}"</Card.Text>
                                        <h5>- {review.name}</h5>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </section>
        </div>
    );
};

export default LandingPage;
