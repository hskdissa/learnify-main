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


const initialState = {
  loading: false,
  error: null,
  quiz: null,
};

export const quizGenerateReducer = (state = { quiz: null }, action) => {
  switch (action.type) {
    case GENERATE_QUIZ_REQUEST:
      return { loading: true };
    case GENERATE_QUIZ_SUCCESS:
      return { loading: false, quiz: action.payload };
    case GENERATE_QUIZ_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};



export const quizListReducer = (state = { quizzes: [] }, action) => {
  switch (action.type) {
    case QUIZ_LIST_REQUEST:
      return { loading: true, quizzes: [] };
    case QUIZ_LIST_SUCCESS:
      return { loading: false, quizzes: action.payload };
    case QUIZ_LIST_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};


export const quizDisplayReducer = (state = { quiz: {} }, action) => {
  switch (action.type) {
    case QUIZ_DISPLAY_REQUEST:
      return { loading: true, quiz: {} };
    case QUIZ_DISPLAY_SUCCESS:
      return { loading: false, quiz: action.payload };
    case QUIZ_DISPLAY_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};


// Reducer for submitting quiz answers
export const quizSubmitReducer = (state = {}, action) => {
  switch (action.type) {
    case SUBMIT_QUIZ_REQUEST:
      return { loading: true };  // When the request is in progress

    case SUBMIT_QUIZ_SUCCESS:
      return { 
        loading: false, 
        score: action.payload.score,    // Storing score separately
        points: action.payload.points,  // Storing points separately
        feedback: action.payload.feedback, // Storing feedback separately
      };

    case SUBMIT_QUIZ_FAIL:
      return { 
        loading: false, 
        error: action.payload,  // Store error message if request fails
      };

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
