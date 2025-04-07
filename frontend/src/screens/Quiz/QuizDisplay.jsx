import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getQuizzesByStudyNoteIdAction } from "../../actions/quizActions";
import { Card, Button, Container } from "react-bootstrap";
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";
import MainScreen from "../../components/MainScreen";

const QuizDisplay = () => {
  const { studyNoteId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const quizList = useSelector((state) => state.quizList);
  const { loading, error, quizzes } = quizList;

  useEffect(() => {
    if (studyNoteId) {
      dispatch(getQuizzesByStudyNoteIdAction(studyNoteId));
    }
  }, [dispatch, studyNoteId]);

  // Delete Handler (if you have delete functionality for quizzes)
  const deleteHandler = (quizId) => {
    console.log(`Deleting quiz with ID: ${quizId}`);
  };

  return (
    <MainScreen title={`Test your Knowledge`}>
      <Container
        style={{
          maxWidth: "800px",
          margin: "auto",
          padding: "30px 20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >


        {loading ? (
          <Loading />
        ) : error ? (
          <ErrorMessage variant="danger">{error}</ErrorMessage>
        ) : (
          quizzes && quizzes.length > 0 && (
            <div style={{ width: "100%" }}>
              {/* Centered Card with Start Quiz and Delete Button */}
              {[...quizzes].reverse().map((quiz) => (
                <Card
                  key={quiz._id}
                  style={{
                    width: "100%",
                    marginBottom: "20px",
                    borderRadius: "10px",
                    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.15)",
                    padding: "25px",
                    backgroundColor: "#f9f9f9",
                    textAlign: "center",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  }}
                  className="hover-shadow"
                >
                  <Card.Body>
                    <h5
                      style={{
                        fontSize: "24px",
                        fontWeight: "bold",
                        color: "#333",
                        marginBottom: "15px",
                      }}
                    >
                      {quiz.title}
                    </h5>

                    <div style={{ marginTop: "20px" }}>
                      <Link
                        to={`/quizzes/studynote/${studyNoteId}/quiz/${quiz._id}`}
                      >
                        <Button
                          variant="primary"
                          style={{
                            padding: "12px 25px",
                            fontSize: "18px",
                            width: "100%",
                            maxWidth: "300px",
                            marginBottom: "15px",
                          }}
                        >
                          Start Quiz
                        </Button>
                      </Link>
                    </div>

                    <Button
                      variant="info"
                      onClick={() => navigate(`/studynote/${studyNoteId}`)}
                      style={{
                        padding: "12px 25px",
                        fontSize: "18px",
                        width: "100%",
                        maxWidth: "300px",
                      }}
                    >
                      Back to Study Note
                    </Button>
                  </Card.Body>
                </Card>
              ))}
            </div>
          )
        )}
      </Container>
    </MainScreen>
  );
};

export default QuizDisplay;
