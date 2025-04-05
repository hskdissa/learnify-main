import { OPENAI_GENERATE_REQUEST, OPENAI_GENERATE_SUCCESS, OPENAI_GENERATE_FAIL } from '../constants/openaiConstants';

// Initial state for OpenAI content generation
const initialState = {
  aiResponse: null,
  aiResponses: JSON.parse(localStorage.getItem("aiResponses")) || [], // Load from localStorage
  loading: false,
  error: null,
};

// Reducer for managing OpenAI content generation state
export const openaiGenerateReducer = (state = initialState, action) => {
  switch (action.type) {
    case OPENAI_GENERATE_REQUEST:
      return { ...state, loading: true, error: null };
    case OPENAI_GENERATE_SUCCESS:
      const newAiResponse = {
        response: action.payload,
        title: action.title, // Save the title along with the AI response
      };
      const newAiResponses = [...state.aiResponses, newAiResponse]; // Append new AI response with title
      localStorage.setItem("aiResponses", JSON.stringify(newAiResponses)); // Persist to localStorage
      return { ...state, aiResponse: action.payload, aiResponses: newAiResponses, loading: false, error: null };
    case OPENAI_GENERATE_FAIL:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
c