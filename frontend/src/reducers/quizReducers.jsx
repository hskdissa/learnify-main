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


// ✅ Initial state for quiz details (retrieving quizzes by study note)
const initialQuizDetailsState = {
  loading: false,
  quizzes: [],
  error: null,
};

// ✅ Reducer for retrieving quizzes by study note ID
export const quizDetailsReducer = (state = initialQuizDetailsState, action) => {
  switch (action.type) {
    case GET_QUIZZES_REQUEST:
      return { ...state, loading: true, error: null }; // Clear error when making a new request
    case GET_QUIZZES_SUCCESS:
      return {
        ...state,
        loading: false,
        quizzes: Array.isArray(action.payload) ? action.payload : state.quizzes, // Store fetched quizzes
        error: null,
      };
    case GET_QUIZZES_FAIL:
      return { ...state, loading: false, error: action.payload || "Error fetching quizzes." };
    default:
      return state;
  }
};

// ✅ Initial state for submitting a quiz
const initialSubmitState = {
  loading: false,
  result: null,
  error: null,
};

// ✅ Reducer for submitting quiz answers
export const quizSubmitReducer = (state = initialSubmitState, action) => {
  switch (action.type) {
    case SUBMIT_QUIZ_REQUEST:
      return { ...state, loading: true, error: null }; // Reset error on new request
    case SUBMIT_QUIZ_SUCCESS:
      return { ...state, loading: false, result: action.payload, error: null }; // Store result
    case SUBMIT_QUIZ_FAIL:
      return { ...state, loading: false, error: action.payload || "Error submitting quiz." };
    default:
      return state;
  }
};

// ✅ Initial state for quiz results
const initialQuizResultState = {
  loading: false,
  result: null,
  error: null,
};

// ✅ Reducer for retrieving quiz results
export const quizResultReducer = (state = initialQuizResultState, action) => {
  switch (action.type) {
    case GET_QUIZ_RESULT_REQUEST:
      return { ...state, loading: true, error: null }; // Reset error on new request
    case GET_QUIZ_RESULT_SUCCESS:
      return { ...state, loading: false, result: action.payload, error: null }; // Store quiz result
    case GET_QUIZ_RESULT_FAIL:
      return { ...state, loading: false, error: action.payload || "Error fetching quiz results." };
    default:
      return state;
  }
};
