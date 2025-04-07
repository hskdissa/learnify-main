import React, { useState, useEffect } from 'react';
import MainScreen from '../../components/MainScreen';
import { Col, Row, Button, Form, Alert } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { changeUser } from '../../actions/userActions'; // Action to update the profile
import Loading from '../../components/Loading';
import ErrorMessage from '../../components/ErrorMessage';
import { useNavigate } from 'react-router-dom';

const MyProfileScreen = () => {
  // State for form inputs
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate(); // For redirecting user if not logged in

  // Getting user data from Redux store
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  // Getting profile update status from Redux store
  const userChange = useSelector((state) => state.userChange);
  const { loading, error, success } = userChange;

  // If no user info is available, redirect to login screen
  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    } else {
      setName(userInfo.name);
      setEmail(userInfo.email);
    }
  }, [userInfo, navigate]);

  // Form submission handler
  const submitHandler = (e) => {
    e.preventDefault();

    if (password === confirmPassword) 
    dispatch(changeUser({name, email, password}));
  };

  return (
    <MainScreen title="Update Profile">
      <div className="profile-container">
        <Row className="justify-content-center">
          <Col md={6}>


            <Form onSubmit={submitHandler}>
            {loading && <Loading />}  
            {success && (<ErrorMessage variant="success">Updated Successfully!</ErrorMessage>)} 
            {error && <ErrorMessage variant='danger'>{error}</ErrorMessage>} 

              <Form.Group controlId="name">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                ></Form.Control>
              </Form.Group>

              <Form.Group controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter E-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                ></Form.Control>
              </Form.Group>

              <Form.Group controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter Password (Leave empty to keep current password)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                ></Form.Control>
              </Form.Group>

              <Form.Group controlId="confirmPassword">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                ></Form.Control>
              </Form.Group>

              <Button
                type="submit"
                variant="primary"
                className="mt-3"
                style={{ width: "100%" }}
                disabled={loading}
              >
                {loading ? "Updating..." : "Update Profile"}
              </Button>
            </Form>
          </Col>
        </Row>
      </div>
    </MainScreen>
  );
};

export default MyProfileScreen;
