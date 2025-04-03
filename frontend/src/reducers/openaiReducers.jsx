import { OPENAI_GENERATE_REQUEST, OPENAI_GENERATE_SUCCESS, OPENAI_GENERATE_FAIL } from '../constants/openaiConstants';

// Initial state for OpenAI content generation
const initialState = {
  aiResponse: null,
  loading: false,
  error: null,
};

// Reducer for managing OpenAI content generation state
export const openaiGenerateReducer = (state = initialState, action) => {
  switch (action.type) {
    case OPENAI_GENERATE_REQUEST:
      return { ...state, loading: true, error: null };
    case OPENAI_GENERATE_SUCCESS:
      return { ...state, aiResponse: action.payload, loading: false, error: null };
    case OPENAI_GENERATE_FAIL:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
