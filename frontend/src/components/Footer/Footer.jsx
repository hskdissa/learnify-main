import { Col, Row, Container } from "react-bootstrap";

const Footer = () => {
  return (
    <footer
      style={{
        width: "100%",
        position: "relative",
        bottom: 0,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Container>
        <Row>
          <Col className="text-center py-3">
            Copyright &copy; Elernify
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
