import { Container, Form, FormControl, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { getTotalPoints, logout } from "../../actions/userActions";
import { useEffect } from 'react';

const Header = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const userLogin = useSelector(state => state.userLogin);
  const { userInfo } = userLogin;

  const logoutHandler = () => {
    dispatch(logout());
    //navigate('/');
  }

    // Fetch total points and level after the user logs in
    useEffect(() => {
      if (userInfo) {
        dispatch(getTotalPoints());
      }
    }, [dispatch, userInfo]);

  return (
    <Navbar bg="primary" expand="lg" variant="dark">
      <Container>
        <Navbar.Brand as={Link} to="/">
          Learnify
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          {/* Center the search bar */}
          <Nav className="m-auto">
            <Form className="d-flex">
              <FormControl type="text" placeholder="Search" className="me-2" />
            </Form>
          </Nav>

          {/* Right-side navigation */}
          {userInfo ? <Nav>
            <Nav.Link as={Link} to="/dashboard">
              Dashboard
            </Nav.Link>


            

            

            {/* Changed title to be Variable depending on the user thats logged in*/}
            <NavDropdown title={userInfo?.name || "Profile"} id="basic-nav-dropdown">
              <NavDropdown.Item as={Link} to="/my-profile">
                My Profile
              </NavDropdown.Item>

              <NavDropdown.Divider />
              <NavDropdown.Item
                onClick={logoutHandler}
              >
                Logout
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>:<Nav>

          <Nav.Link as={Link} to="/login">
              Login
            </Nav.Link>
            
            </Nav>}
        </Navbar.Collapse>
      </Container>
    </Navbar >
  );
};

export default Header;
