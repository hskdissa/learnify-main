import axios from "axios";
import {
  GENERATE_QUIZ_REQUEST, GENERATE_QUIZ_SUCCESS, GENERATE_QUIZ_FAIL,
  GET_QUIZZES_REQUEST,
  GET_QUIZZES_SUCCESS,
  GET_QUIZZES_FAIL,
  SUBMIT_QUIZ_REQUEST,
  SUBMIT_QUIZ_SUCCESS,
  SUBMIT_QUIZ_FAIL,
  GET_QUIZ_RESULT_REQUEST,
  GET_QUIZ_RESULT_SUCCESS,
  GET_QUIZ_RESULT_FAIL,
} from "../constants/quizConstants";

const API_URL = import.meta.env.VITE_API_URL; // Adjust this based on your environment

// Helper function for error handling
const handleError = (error, dispatch, failType) => {
  console.error("Error:", error.response?.data || error.message);
  const message = error.response?.data?.message || error.message || "An error occurred";
  dispatch({ type: failType, payload: message });
};

// Your action code here
export const generateQuizAction = (studyNoteId) => async (dispatch, getState) => {
  try {
    dispatch({ type: GENERATE_QUIZ_REQUEST });

    const { userLogin: { userInfo } } = getState();

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.post(
      `${API_URL}/api/quizzes/generate`,
      { studyNoteId },
      config
    );

    dispatch({ type: GENERATE_QUIZ_SUCCESS, payload: data });

  } catch (error) {
    dispatch({
      type: GENERATE_QUIZ_FAIL,
      payload: error.response && error.response.data.message ? error.response.data.message : error.message,
    });
  }
};

// Action to get quizzes by study note ID
export const getQuizzesByStudyNoteIdAction = (studyNoteId) => async (dispatch, getState) => {
  try {
    dispatch({ type: GET_QUIZZES_REQUEST });

    const { userLogin: { userInfo } } = getState();

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.get(
      `${API_URL}/api/quizzes/studynote/${studyNoteId}`,
      config
    );

    dispatch({ type: GET_QUIZZES_SUCCESS, payload: data });

    return data;
  } catch (error) {
    handleError(error, dispatch, GET_QUIZZES_FAIL);
    throw error; // Ensure we throw the error for the calling component to handle
  }
};

// Action to submit quiz answers
export const submitQuizAction = (quizId, answers) => async (dispatch, getState) => {
  try {
    dispatch({ type: SUBMIT_QUIZ_REQUEST });

    const { userLogin: { userInfo } } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.post(
      `${API_URL}/api/quizzes/submit`,
      { quizId, answers },
      config
    );

    dispatch({ type: SUBMIT_QUIZ_SUCCESS, payload: data });
  } catch (error) {
    handleError(error, dispatch, SUBMIT_QUIZ_FAIL);
  }
};

// Action to get the result of a quiz
export const getQuizResultAction = (quizId) => async (dispatch) => {
  try {
    dispatch({ type: GET_QUIZ_RESULT_REQUEST });

    const { data } = await axios.get(`${API_URL}/api/quizzes/result/${quizId}`);

    dispatch({ type: GET_QUIZ_RESULT_SUCCESS, payload: data });
  } catch (error) {
    handleError(error, dispatch, GET_QUIZ_RESULT_FAIL);
  }
};
