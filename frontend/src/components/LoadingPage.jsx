import React from "react";
import { ProgressBar, Container } from "react-bootstrap";

const LoadingPage = () => {
  return (
    <Container className="text-center" style={{ marginTop: "50px" }}>
      <h2>Generating Flashcards...</h2>
      <ProgressBar animated now={75} />
    </Container>
  );
};

export default LoadingPage;
