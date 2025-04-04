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
  
  // Reducer for listing all study notes
  export const studyNoteListReducer = (state = { studyNotes: [] }, action) => {
    switch (action.type) {
      case STUDY_NOTE_LIST_REQUEST:
        return { loading: true, studyNotes: [] };
      case STUDY_NOTE_LIST_SUCCESS:
        return { loading: false, studyNotes: action.payload };
      case STUDY_NOTE_LIST_FAIL:
        return { loading: false, error: action.payload };
      default:
        return state;
    }
  };
  
  // Reducer for getting a single study note
  export const studyNoteDetailsReducer = (state = { studyNote: {} }, action) => {
    switch (action.type) {
      case STUDY_NOTE_DETAILS_REQUEST:
        return { loading: true, ...state };
      case STUDY_NOTE_DETAILS_SUCCESS:
        return { loading: false, studyNote: action.payload };
      case STUDY_NOTE_DETAILS_FAIL:
        return { loading: false, error: action.payload };
      default:
        return state;
    }
  };
  
  // Reducer for deleting a study note
  export const studyNoteDeleteReducer = (state = {}, action) => {
    switch (action.type) {
      case STUDY_NOTE_DELETE_REQUEST:
        return { loading: true };
      case STUDY_NOTE_DELETE_SUCCESS:
        return { loading: false, success: true };
      case STUDY_NOTE_DELETE_FAIL:
        return { loading: false, error: action.payload };
      default:
        return state;
    }
  };
  