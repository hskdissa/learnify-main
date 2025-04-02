import { Container, Form, FormControl, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();  // Use the useNavigate hook to get the navigate function

  return (
    <Navbar bg="primary" expand="lg" variant="dark">
      <Container>
        <Navbar.Brand as={Link} to="/">
          Lernify
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
          <Nav>
            <Nav.Link as={Link} to="/dashboard">
              Dashboard
            </Nav.Link>

            <NavDropdown title="Keshika Dissanayaka" id="basic-nav-dropdown">
              <NavDropdown.Item as={Link} to="/profile">
                My Profile
              </NavDropdown.Item>

              <NavDropdown.Divider />
              <NavDropdown.Item
                onClick={() => {
                  localStorage.removeItem("userInfo");
                  navigate("/");  // Use navigate to redirect after logout
                }}
              >
                Logout
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
