import { Form, Button, Row, Col } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import MainScreen from "../../components/MainScreen";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";  
import { login } from "../../actions/userActions";
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";
import "./SigninScreen.css";

const SigninScreen = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();  // Use dispatch from react-redux
    const navigate = useNavigate();

    const userLogin = useSelector((state) => state.userLogin);
    const { loading, error: loginError, userInfo } = userLogin;

    useEffect(() => {
        if (userInfo) {
            navigate("/dashboard");
        }
    }, [navigate, userInfo]);

    const submitHandler = async (e) => {
        e.preventDefault();
        dispatch(login(email, password)); // Dispatch the login action
    };

    return (
        <MainScreen title="Login">
            <div className="loginContainer">
                {loginError && <ErrorMessage variant="danger">{loginError}</ErrorMessage>} {/* Display the login error */}
                {loading && <Loading />} {/* Display loading indicator */}

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
