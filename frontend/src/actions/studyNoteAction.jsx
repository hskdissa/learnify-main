import axios from "axios";
import {
  STUDY_NOTE_LIST_REQUEST,
  STUDY_NOTE_LIST_SUCCESS,
  STUDY_NOTE_LIST_FAIL,
  STUDY_NOTE_DETAILS_REQUEST,
  STUDY_NOTE_DETAILS_SUCCESS,
  STUDY_NOTE_DETAILS_FAIL,
  STUDY_NOTE_DELETE_REQUEST,
  STUDY_NOTE_DELETE_SUCCESS,
  STUDY_NOTE_DELETE_FAIL,
} from "../constants/studyNoteConstants";

const API_URL = import.meta.env.VITE_API_URL; // Ensure your API_URL is correctly set

// Fetch all study notes
export const listStudyNotes = () => async (dispatch, getState) => {
  try {
    dispatch({ type: STUDY_NOTE_LIST_REQUEST });

    const { userLogin: { userInfo } } = getState();
    const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };

    const { data } = await axios.get(`${API_URL}/api/studynotes`, config);  // Updated URL with API_URL
    dispatch({ type: STUDY_NOTE_LIST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: STUDY_NOTE_LIST_FAIL,
      payload: error.response && error.response.data.message
        ? error.response.data.message
        : error.message,
    });
  }
};

// Fetch a single study note by ID
export const getStudyNoteById = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: STUDY_NOTE_DETAILS_REQUEST });

    const { userLogin: { userInfo } } = getState();
    const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };

    const { data } = await axios.get(`${API_URL}/api/studynotes/${id}`, config);  // Updated URL with API_URL
    dispatch({ type: STUDY_NOTE_DETAILS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: STUDY_NOTE_DETAILS_FAIL,
      payload: error.response && error.response.data.message
        ? error.response.data.message
        : error.message,
    });
  }
};

// Delete a study note


export const deleteStudyNote = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: STUDY_NOTE_DELETE_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    if (!userInfo || !userInfo.token) {
      console.error("No user token found");
      throw new Error("User not authenticated");
    }

    console.log("Deleting study note:", id);
    console.log("User Token:", userInfo.token);  // Log the token

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    await axios.delete(`${API_URL}/api/studynotes/${id}`, config);

    dispatch({ type: STUDY_NOTE_DELETE_SUCCESS });
  } catch (error) {
    console.error("Error deleting study note:", error.response?.data?.message || error.message);

    dispatch({
      type: STUDY_NOTE_DELETE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};



