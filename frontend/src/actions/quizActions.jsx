import axios from "axios";
import {
  GENERATE_QUIZ_REQUEST, GENERATE_QUIZ_SUCCESS, GENERATE_QUIZ_FAIL,
  QUIZ_LIST_REQUEST,
  QUIZ_LIST_SUCCESS,
  QUIZ_LIST_FAIL,
  SUBMIT_QUIZ_REQUEST,
  SUBMIT_QUIZ_SUCCESS,
  SUBMIT_QUIZ_FAIL,
  GET_QUIZ_RESULT_REQUEST,
  GET_QUIZ_RESULT_SUCCESS,
  GET_QUIZ_RESULT_FAIL,
  QUIZ_DISPLAY_REQUEST,
  QUIZ_DISPLAY_SUCCESS,
  QUIZ_DISPLAY_FAIL,
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

    console.log("API Response Data:", data);

    dispatch({ type: GENERATE_QUIZ_SUCCESS, payload: data });

  } catch (error) {
    console.error("Error during quiz generation:", error); // Log the error
    dispatch({
      type: GENERATE_QUIZ_FAIL,
      payload: error.response && error.response.data.message ? error.response.data.message : error.message,
    });
  }
};

// Action to get quizzes by study note ID
export const getQuizzesByStudyNoteIdAction = (studyNoteId) => async (dispatch, getState) => {
  try {
    dispatch({ type: QUIZ_LIST_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.get(`${API_URL}/api/quizzes/studynote/${studyNoteId}`, config);

    dispatch({
      type: QUIZ_LIST_SUCCESS,
      payload: data, // Assuming the data is an array of quizzes
    });
  } catch (error) {
    const message =
      error.response?.data?.message || error.message || 'Failed to fetch quizzes.';
    dispatch({
      type: QUIZ_LIST_FAIL,
      payload: message,
    });
  }
};


export const getQuizByIdAction = (studyNoteId, quizId) => async (dispatch, getState) => {
  try {
    dispatch({ type: QUIZ_DISPLAY_REQUEST });

    const { userLogin: { userInfo } } = getState();

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.get(
      `${API_URL}/api/quizzes/studynote/${studyNoteId}/quiz/${quizId}`, 
      config
    );

    dispatch({
      type: QUIZ_DISPLAY_SUCCESS,
      payload: data,
    });
  } catch (error) {
    const message = error.response?.data?.message || error.message || "Failed to fetch quiz.";
    dispatch({
      type: QUIZ_DISPLAY_FAIL,
      payload: message,
    });
  }
};




// Action to submit quiz answers
export const submitQuizAction = (studyNoteId, quizId, answers) => async (dispatch, getState) => {
  try {
    dispatch({ type: SUBMIT_QUIZ_REQUEST });

    const { userLogin: { userInfo } } = getState(); // Get user info from the store

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    // Correct API call with full URL
    const { data } = await axios.post(
      `${API_URL}/api/quizzes/studynote/${studyNoteId}/quiz/${quizId}/submit`,  // Corrected URL format
      { answers },
      config
    );

    // Dispatch success with the response data
    dispatch({
      type: SUBMIT_QUIZ_SUCCESS,
      payload: data, // Contains score, points, and feedback
    });

    return data; // Return data for use in the component (like passing score and feedback to result page)

  } catch (error) {
    handleError(error, dispatch, SUBMIT_QUIZ_FAIL);
  }
};


/*
// Action to get the result of a quiz after submission
export const getQuizResultAction = (studyNoteId, quizId) => async (dispatch, getState) => {
  try {
    dispatch({ type: GET_QUIZ_RESULT_REQUEST });

    const { userLogin: { userInfo } } = getState(); // Get user info from the store

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    // Fetching the quiz result from the backend
    const { data } = await axios.get(
      `${API_URL}/api/quizzes/${studyNoteId}/quiz/${quizId}/result`, // Adjusted API path
      config
    );

    // Dispatch success with the result data
    dispatch({
      type: GET_QUIZ_RESULT_SUCCESS,
      payload: data, // Contains the score, feedback, and possibly other quiz result data
    });


  } catch (error) {
    handleError(error, dispatch, GET_QUIZ_RESULT_FAIL);
  }
};
*/
