import axios from 'axios';
import { OPENAI_GENERATE_REQUEST, OPENAI_GENERATE_SUCCESS, OPENAI_GENERATE_FAIL } from '../constants/openaiConstants';

// Action to generate AI content
export const generateAIContentAction = (extractedText) => async (dispatch, getState) => {
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
      'http://localhost:5001/api/openai/generate',
      { extractedText },
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
