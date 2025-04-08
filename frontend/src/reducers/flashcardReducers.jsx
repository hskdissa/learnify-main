import {
  FLASHCARD_GENERATE_REQUEST,
  FLASHCARD_GENERATE_SUCCESS,
  FLASHCARD_GENERATE_FAIL,
  FLASHCARD_LIST_REQUEST,
  FLASHCARD_LIST_SUCCESS,
  FLASHCARD_LIST_FAIL,
  FLASHCARD_DETAILS_REQUEST,
  FLASHCARD_DETAILS_SUCCESS,
  FLASHCARD_DETAILS_FAIL,
  FLASHCARD_DELETE_REQUEST,
  FLASHCARD_DELETE_SUCCESS,
  FLASHCARD_DELETE_FAIL,
  GET_SINGLE_FLASHCARD_REQUEST,
  GET_SINGLE_FLASHCARD_SUCCESS,
  GET_SINGLE_FLASHCARD_FAIL,
} from '../constants/flashcardConstants';

const initialState = {
  loading: false,
  error: null,
  flashcards: null,
};

export const flashcardGenerateReducer = (state = initialState, action) => {
  switch (action.type) {
    case FLASHCARD_GENERATE_REQUEST:
      return { ...state, loading: true };
    case FLASHCARD_GENERATE_SUCCESS:
      return { loading: false, flashcards: action.payload, error: null };
    case FLASHCARD_GENERATE_FAIL:
      return { loading: false, error: action.payload, flashcards: null };
    default:
      return state;
  }
};



// Reducer for listing all flashcards
export const flashcardListReducer = (state = { flashcards: [] }, action) => {
  switch (action.type) {
    case FLASHCARD_LIST_REQUEST:
      return { loading: true, flashcards: [] };
    case FLASHCARD_LIST_SUCCESS:
      return { loading: false, flashcards: action.payload };
    case FLASHCARD_LIST_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};


export const flashcardDetailsReducer = (state = { flashcard: {} }, action) => {
  switch (action.type) {
    case FLASHCARD_DETAILS_REQUEST:
      return { loading: true };
    case FLASHCARD_DETAILS_SUCCESS:
      return { loading: false, flashcard: action.payload };
    case FLASHCARD_DETAILS_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};





// Reducer for deleting a flashcard
export const flashcardDeleteReducer = (state = {}, action) => {
  switch (action.type) {
    case FLASHCARD_DELETE_REQUEST:
      return { loading: true };
    case FLASHCARD_DELETE_SUCCESS:
      return { loading: false, success: true };
    case FLASHCARD_DELETE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};


export const singleflashcardReducer = (state = { loading: false, error: null, flashcard: {} }, action) => {
  switch (action.type) {
    case GET_SINGLE_FLASHCARD_REQUEST:
      return { ...state, loading: true };
    case GET_SINGLE_FLASHCARD_SUCCESS:
      return { loading: false, flashcard: action.payload, error: null };
    case GET_SINGLE_FLASHCARD_FAIL:
      return { loading: false, error: action.payload, flashcard: {} };
    default:
      return state;
  }
};

