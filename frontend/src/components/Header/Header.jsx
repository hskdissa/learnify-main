import { Container, Form, FormControl, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { getTotalPoints, logout } from "../../actions/userActions";
import { useEffect, useContext } from 'react';
import { DarkModeContext } from '../context/DarkModeContext'; // Corrected path
import { FaMoon, FaSun } from "react-icons/fa"; // Import Icons

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userLogin = useSelector(state => state.userLogin);
  const { userInfo } = userLogin;
  const { darkMode, setDarkMode } = useContext(DarkModeContext);

  const logoutHandler = () => {
    dispatch(logout());
  };

  useEffect(() => {
    if (userInfo) {
      dispatch(getTotalPoints());
    }
  }, [dispatch, userInfo]);

  return (
    <Navbar bg={darkMode ? "dark" : "primary"} expand="lg" variant={darkMode ? "dark" : "light"}>
      <Container>
        <Navbar.Brand as={Link} to="/">
          Learnify
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="m-auto">
            <Form className="d-flex">
              <FormControl type="text" placeholder="Search" className="me-2" />
            </Form>
          </Nav>

          {userInfo ? (
            <Nav>
              <Nav.Link as={Link} to="/dashboard">
                Dashboard
              </Nav.Link>
              <NavDropdown title={userInfo?.name || "Profile"} id="basic-nav-dropdown">
                <NavDropdown.Item as={Link} to="/my-profile">
                  My Profile
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={logoutHandler}>Logout</NavDropdown.Item>
              </NavDropdown>
            </Nav>
          ) : (
            <Nav>
              <Nav.Link as={Link} to="/login">Login</Nav.Link>
            </Nav>
          )}

          {/* Dark Mode Toggle Button */}
          <button 
            onClick={() => setDarkMode(prev => !prev)} 
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "1.5rem",
              color: darkMode ? "#FFD700" : "#333",
              marginLeft: "10px",
              transition: "color 0.3s ease-in-out"
            }}
          >
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
