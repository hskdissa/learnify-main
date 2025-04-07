import axios from "axios";
import {
  GENERATE_QUIZ_REQUEST,
  GENERATE_QUIZ_SUCCESS,
  GENERATE_QUIZ_FAIL,
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


// Action to generate quiz based on study note
export const generateQuizAction = (studyNoteId) => async (dispatch, getState) => {
  try {
    dispatch({ type: GENERATE_QUIZ_REQUEST });

    // Log the studyNoteId to make sure it's correctly passed
    console.log('Generating quiz for study note ID:', studyNoteId);

    // Get user info from Redux state to retrieve the auth token
    const {
      userLogin: { userInfo },
    } = getState();

    // Check if user info is available and log it
    if (!userInfo) {
      throw new Error("User is not logged in");
    }

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`, // Attach token in header
      },
    };

    // Make the API call to generate the quiz
    const { data } = await axios.post(
      `${API_URL}/api/quizzes/generate`,
      { studyNoteId },
      config
    );

    // Log the data returned from the API to check if it's correct
    console.log('Quiz Generated:', data);

    // Dispatch success action with the generated quiz data
    dispatch({
      type: GENERATE_QUIZ_SUCCESS,
      payload: data, // This is the generated quiz
    });
  } catch (error) {
    // Log the error response to debug
    console.error('Error generating quiz:', error.response?.data || error.message);

    // Create a custom error message
    const message =
      error.response?.data?.message || error.message || 'Quiz generation failed. Please try again later.';

    // Dispatch failure action with the error message
    dispatch({
      type: GENERATE_QUIZ_FAIL,
      payload: message,
    });
  }
};






// Action to submit quiz answers
export const submitQuizAction = (quizId, answers) => async (dispatch, getState) => {
  try {
    dispatch({ type: SUBMIT_QUIZ_REQUEST });
    const { userLogin: { userInfo } } = getState(); // Ensure this matches the shape of your state

    const { data } = await axios.post(`${API_URL}/api/quizzes/submit`, { quizId, answers }, {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,  // Use the token from userInfo
      },
    });

    dispatch({ type: SUBMIT_QUIZ_SUCCESS, payload: data });
  } catch (error) {
    handleError(error, dispatch, SUBMIT_QUIZ_FAIL); // Using the helper function
  }
};

// Action to get quizzes by study note ID
export const getQuizzesByStudyNoteIdAction = (studyNoteId) => async (dispatch, getState) => {
  try {
    dispatch({ type: GET_QUIZZES_REQUEST });

    const { userLogin: { userInfo } } = getState();

    const { data } = await axios.get(
      `${API_URL}/api/quizzes/studynote/${studyNoteId}`,
      { headers: { Authorization: `Bearer ${userInfo.token}` } }
    );

    dispatch({ type: GET_QUIZZES_SUCCESS, payload: data });
  } catch (error) {
    console.error("Error fetching quizzes:", error.response?.data || error.message);
    dispatch({ type: GET_QUIZZES_FAIL, payload: "No quizzes found for this study note." });
  }
};


// Action to get the quiz result
export const getQuizResultAction = (quizId) => async (dispatch) => {
  try {
    dispatch({ type: GET_QUIZ_RESULT_REQUEST });

    const { data } = await axios.get(`${API_URL}/api/quizzes/result/${quizId}`);

    dispatch({ type: GET_QUIZ_RESULT_SUCCESS, payload: data });
  } catch (error) {
    handleError(error, dispatch, GET_QUIZ_RESULT_FAIL); // Using the helper function
  }
};
