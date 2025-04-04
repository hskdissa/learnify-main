import axios from 'axios';
import { OPENAI_GENERATE_REQUEST, OPENAI_GENERATE_SUCCESS, OPENAI_GENERATE_FAIL } from '../constants/openaiConstants';

const API_URL = import.meta.env.VITE_API_URL;

// Action to generate AI content
export const generateAIContentAction = (extractedText, title) => async (dispatch, getState) => {
  try {
    dispatch({ type: OPENAI_GENERATE_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    // Make the API request to the backend for AI content generation
    const { data } = await axios.post(
      `${API_URL}/api/openai/generate`,
      { extractedText, title },  // Pass title along with extractedText
      config
    );

    console.log('AI Response:', data);

    // Dispatch success action with AI response
    dispatch({
      type: OPENAI_GENERATE_SUCCESS,
      payload: data.aiResponse,
    });
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      'AI content generation failed. Please try again later.';

    dispatch({
      type: OPENAI_GENERATE_FAIL,
      payload: message,
    });
  }
};
