import axios from 'axios';
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
} from '../constants/flashcardConstants';

const API_URL = import.meta.env.VITE_API_URL;

// Action to generate flashcards based on study note
export const generateFlashcardsAction = (studyNoteId) => async (dispatch, getState) => {
  try {
    dispatch({ type: FLASHCARD_GENERATE_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.post(
      `${API_URL}/api/flashcards/generate`,
      { studyNoteId },
      config
    );

    console.log('Flashcards Generated:', data);

    dispatch({
      type: FLASHCARD_GENERATE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    
    const message =
      error.response?.data?.message || error.message || 'Flashcard generation failed. Please try again later.';

    dispatch({
      type: FLASHCARD_GENERATE_FAIL,
      payload: message,
    });
  }
};


// Action to get a full list of flashcards
export const listFlashcardsAction = () => async (dispatch, getState) => {
  try {
    dispatch({ type: FLASHCARD_LIST_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    // GET request to the backend API to fetch flashcards
    const { data } = await axios.get(`${API_URL}/api/flashcards`, config);

    
    dispatch({
      type: FLASHCARD_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    
    const message =
      error.response?.data?.message || error.message || 'Failed to fetch flashcards.';
    dispatch({
      type: FLASHCARD_LIST_FAIL,
      payload: message,
    });
  }
};

/*
// Action to get details of a specific flashcard
export const getFlashcardDetailsAction = (studyNoteId, flashcardId) => async (dispatch, getState) => {
  try {
    dispatch({ type: FLASHCARD_DETAILS_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    // Use both studyNoteId and flashcardId in the URL
    const { data } = await axios.get(
      `${API_URL}/api/flashcards/studynote/${studyNoteId}/flashcards/${flashcardId}`,
      config
    );

    console.log('Fetched flashcard data:', data); // Log the response data

    dispatch({
      type: FLASHCARD_DETAILS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    const message =
      error.response?.data?.message || error.message || 'Failed to fetch flashcard details.';
    dispatch({
      type: FLASHCARD_DETAILS_FAIL,
      payload: message,
    });
  }
};

*/

export const getFlashcardDetailsAction = (studyNoteId, flashcardId) => async (dispatch, getState) => {
  try {
    dispatch({ type: FLASHCARD_DETAILS_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    // Fetch a single flashcard based on the studyNoteId and flashcardId
    const { data } = await axios.get(
      `${API_URL}/api/flashcards/studynote/${studyNoteId}/flashcards/${flashcardId}`,
      config
    );

    console.log('Fetched flashcard:', data);  // Debugging

    dispatch({
      type: FLASHCARD_DETAILS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    const message =
      error.response?.data?.message || error.message || 'Failed to fetch flashcard details.';
    dispatch({
      type: FLASHCARD_DETAILS_FAIL,
      payload: message,
    });
  }
};





// Action to delete a flashcard
export const deleteFlashcardAction = (flashcardId) => async (dispatch, getState) => {
  try {
    dispatch({ type: FLASHCARD_DELETE_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    // Send a delete request to the API to remove the flashcard
    await axios.delete(`${API_URL}/api/flashcards/${flashcardId}`, config);

    dispatch({
      type: FLASHCARD_DELETE_SUCCESS,
      payload: flashcardId,
    });
  } catch (error) {
    const message =
      error.response?.data?.message || error.message || 'Failed to delete flashcard.';
    dispatch({
      type: FLASHCARD_DELETE_FAIL,
      payload: message,
    });
  }
};


export const listFlashcardsByStudyNote = (studyNoteId) => async (dispatch, getState) => {
  try {
    dispatch({ type: FLASHCARD_LIST_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.get(`${API_URL}/api/flashcards/studynote/${studyNoteId}`, config);

    dispatch({
      type: FLASHCARD_LIST_SUCCESS,
      payload: data, 
    });
  } catch (error) {
    const message =
      error.response?.data?.message || error.message || 'Failed to fetch flashcards.';
    dispatch({
      type: FLASHCARD_LIST_FAIL,
      payload: message,
    });
  }
};

