import { Form, Button, Row, Col } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import MainScreen from "../../components/MainScreen";
import "./SigninScreen.css";
import { useState } from "react";
import axios from "axios";
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage"; 

const SigninScreen = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const submitHandler = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const config = {
                headers: { "Content-type": "application/json" }
            };

            setLoading(true);
            const { data } = await axios.post('/api/users/login', { email, password }, config);
            console.log(data);

            localStorage.setItem('userInfo', JSON.stringify(data));
            setLoading(false);

            navigate("/dashboard");
        } catch (err) {
            setLoading(false);
            setError(err.response?.data?.message || "Invalid Email or Password");
        }
    };

    return (
        <MainScreen title="Login">
            <div className="loginContainer">
                {error && <ErrorMessage variant="danger">{error}</ErrorMessage>}
                {loading && <Loading />}
                
                <Form onSubmit={submitHandler}>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control
                            type="email"
                            value={email}
                            placeholder="Enter email"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            value={password}
                            placeholder="Password"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </Form.Group>

                    <Button variant="primary" type="submit" disabled={loading}>
                        {loading ? "Loading..." : "Submit"}
                    </Button>
                </Form>

                <Row className="py-3">
                    <Col>
                        Don't have an Account yet? <Link to="/register">Register Here</Link>
                    </Col>
                </Row>
            </div>
        </MainScreen>
    );
};

export default SigninScreen;
