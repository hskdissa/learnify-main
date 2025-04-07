import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getQuizzesByStudyNoteIdAction } from "../../actions/quizActions"; // Assuming you have the action for quizzes
import { Accordion, Card, Button, Container, Badge } from "react-bootstrap";
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";
import MainScreen from "../../components/MainScreen";

const QuizDisplay = () => {
  const { studyNoteId, quizId } = useParams();
  console.log("studyNoteId:", studyNoteId);
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
    // Logic to delete quiz (integrate actual delete logic here)
    console.log(`Deleting quiz with ID: ${quizId}`);
  };

  return (
    <MainScreen title={`Quizzes for Study Note ${studyNoteId}`}>
      <Container style={{ maxWidth: "900px", margin: "auto", padding: "20px" }}>
        <Button 
          onClick={() => navigate(`/studynote/${studyNoteId}`)} // Navigate back to the study note page
          variant="secondary" 
          className="mb-4"
        >
          Back
        </Button>

        {loading ? (
          <Loading />
        ) : error ? (
          <ErrorMessage variant="danger">{error}</ErrorMessage>
        ) : (
          quizzes && quizzes.length > 0 && (
            <div>



              <h3>Quiz for Study Note: {studyNoteId}</h3>

              <Accordion defaultActiveKey="0">
                {/* Loop through each quiz */}
                {[...quizzes].reverse().map((quiz) => (
                  <Accordion.Item key={quiz._id} eventKey={quiz._id}>
                    <Card style={{ margin: 10 }}>
                      <Card.Header style={{ display: "flex" }}>
                        <span
                          style={{
                            color: "black",
                            textDecoration: "none",
                            flex: 1,
                            cursor: "pointer",
                            alignSelf: "center",
                            fontSize: 18,
                          }}
                        >
                          <Accordion.Button as="div">{quiz.title}</Accordion.Button>
                        </span>
                        <div>
                        {console.log("Quiz ID in Link:", quiz._id)}


                        <Link to={`/quizzes/studynote/${studyNoteId}/quiz/${quiz._id}`}>
                          <Button>Start Quiz</Button>
                        </Link>




                          {/* Optional Delete Button */}
                          <Button
                            variant="danger"
                            className="mx-2"
                            onClick={() => deleteHandler(quiz._id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </Card.Header>

                      <Accordion.Body>
                        <Card.Body>
                          {/* Display quiz details */}
                          <h4>
                            <Badge bg="success">Category - {quiz.category}</Badge>
                          </h4>

                          {quiz.questions.map((question, index) => (
                            <div key={question._id} className="mb-3">
                              <strong>Q{index + 1}: </strong>{question.text}
                              {/* Display question options */}
                              {question.options && question.options.map((option, i) => (
                                <div key={i}>
                                  <input type="radio" name={`question-${index}`} id={`option-${i}`} />
                                  <label htmlFor={`option-${i}`}>{option}</label>
                                </div>
                              ))}
                            </div>
                          ))}
                        </Card.Body>
                      </Accordion.Body>
                    </Card>
                  </Accordion.Item>
                ))}
              </Accordion>
            </div>
          )
        )}
      </Container>
    </MainScreen>
  );

};

export default QuizDisplay;
