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


const initialState = {
  quiz: null,
  loading: false,
  error: null,
};

export const quizGenerateReducer = (state = initialState, action) => {
  switch (action.type) {
    case GENERATE_QUIZ_REQUEST:
      return { ...state, loading: true };
    case GENERATE_QUIZ_SUCCESS:
      return { ...state, loading: false, quiz: action.payload };
    case GENERATE_QUIZ_FAIL:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

// Reducer for getting quizzes by study note ID
export const quizListReducer = (state = { quizzes: [] }, action) => {
  switch (action.type) {
    case GET_QUIZZES_REQUEST:
      return { loading: true };
    case GET_QUIZZES_SUCCESS:
      return { loading: false, quizzes: action.payload };
    case GET_QUIZZES_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

// Reducer for submitting quiz answers
export const quizSubmitReducer = (state = {}, action) => {
  switch (action.type) {
    case SUBMIT_QUIZ_REQUEST:
      return { loading: true };
    case SUBMIT_QUIZ_SUCCESS:
      return { loading: false, result: action.payload };
    case SUBMIT_QUIZ_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

// Reducer for getting quiz results
export const quizResultReducer = (state = {}, action) => {
  switch (action.type) {
    case GET_QUIZ_RESULT_REQUEST:
      return { loading: true };
    case GET_QUIZ_RESULT_SUCCESS:
      return { loading: false, result: action.payload };
    case GET_QUIZ_RESULT_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
