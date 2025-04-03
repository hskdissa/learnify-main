import axios from 'axios';
import { 
  STUDY_NOTE_LIST_REQUEST, 
  STUDY_NOTE_LIST_SUCCESS, 
  STUDY_NOTE_LIST_FAIL, 
  STUDY_NOTE_DELETE_REQUEST, 
  STUDY_NOTE_DELETE_SUCCESS, 
  STUDY_NOTE_DELETE_FAIL 
} from '../constants/studyNoteConstants';

const API_URL = import.meta.env.VITE_API_URL;

// Action to list study notes
export const listStudyNotes = () => async (dispatch, getState) => {
  try {
    dispatch({ type: STUDY_NOTE_LIST_REQUEST });

    const { userLogin: { userInfo } } = getState();
    
    const config = {
      headers: {
        'Authorization': `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.get(`${API_URL}/api/studynotes`, config);

    dispatch({
      type: STUDY_NOTE_LIST_SUCCESS,
      payload: data.studyNotes,
    });
  } catch (error) {
    const message = 
      error.response?.data?.message || 
      error.message || 
      'Failed to fetch study notes. Please try again later.';

    dispatch({
      type: STUDY_NOTE_LIST_FAIL,
      payload: message,
    });
  }
};

// Action to delete a study note
export const deleteStudyNote = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: STUDY_NOTE_DELETE_REQUEST });

    const { userLogin: { userInfo } } = getState();

    const config = {
      headers: {
        'Authorization': `Bearer ${userInfo.token}`,
      },
    };

    await axios.delete(`${API_URL}/api/studynotes/${id}`, config);

    dispatch({
      type: STUDY_NOTE_DELETE_SUCCESS,
    });

    // Optionally, you can dispatch listStudyNotes to refresh the list after deletion
    dispatch(listStudyNotes());

  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      'Failed to delete study note. Please try again later.';

    dispatch({
      type: STUDY_NOTE_DELETE_FAIL,
      payload: message,
    });
  }
};
