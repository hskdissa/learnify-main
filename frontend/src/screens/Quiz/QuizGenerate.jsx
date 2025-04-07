import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { generateQuizAction } from "../../actions/quizActions"; // Ensure the correct import
import Loading from "../../components/Loading";

const QuizGenerate = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Access the quizGenerate state
  const quizGenerate = useSelector((state) => state.quizGenerate);
  const { loading, error, quiz } = quizGenerate;

  useEffect(() => {
    const quizId = new URLSearchParams(window.location.search).get("quizId");

    if (quiz && quiz._id) {
      navigate(`/quiz/display/${quiz._id}`);
    }

    if (!quiz && !loading && !error) {
      dispatch(generateQuizAction(quizId));
    }
  }, [dispatch, quiz, loading, error, navigate]);

  return (
    <div className="text-center">
      {loading ? (
        <Loading />
      ) : error ? (
        <div>Error: {error}</div>
      ) : (
        <div>Your quiz is being generated...</div>
      )}
    </div>
  );
};

export default QuizGenerate;
