import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";

import  thunk  from "redux-thunk"; // Weird, keeps changing


import { composeWithDevTools } from "redux-devtools-extension";
import { userChangeReducer, userLoginReducer, userRegisterReducer, userTotalPointsReducer } from "./reducers/userReducers";
import { uploadFileReducer } from "./reducers/uploadReducers";
import { openaiGenerateReducer } from './reducers/openaiReducers';
import { studyNoteListReducer, studyNoteDetailsReducer, studyNoteDeleteReducer } from "./reducers/studyNoteReducers";


import { flashcardDeleteReducer, flashcardDetailsReducer, flashcardGenerateReducer, flashcardListReducer, singleflashcardReducer } from './reducers/flashcardReducers';

import { quizGenerateReducer, quizListReducer, quizSubmitReducer, quizResultReducer, quizDisplayReducer } from "./reducers/quizReducers";


// Combine your reducers
const rootReducer = combineReducers({
  // Add reducers here, for example:
  userLogin: userLoginReducer,
  userRegister: userRegisterReducer,
  userChange: userChangeReducer,

  
  uploadFile: uploadFileReducer,

  openaiGenerate: openaiGenerateReducer,
  studyNoteList: studyNoteListReducer,
  studyNoteDetails: studyNoteDetailsReducer,
  studyNoteDelete: studyNoteDeleteReducer,

  flashcardList: flashcardListReducer,
  flashcardDetails: flashcardDetailsReducer,
  flashcardDelete: flashcardDeleteReducer,
  flashcardGenerate: flashcardGenerateReducer,
  ingleflashcard: singleflashcardReducer, 

  quizGenerateReducer: quizGenerateReducer,
  quizList: quizListReducer,
  quizDisplay: quizDisplayReducer,
  quizSubmitReducer: quizSubmitReducer,
  
  quizResultReducer: quizResultReducer,

  userTotalPoints: userTotalPointsReducer,  
  







});

const userInfoFromStorage = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null

const initialState = {
  // Fetch user state from local storage (whenever user comes back, fetch user state from local storage)
  userLogin: { userInfo: userInfoFromStorage },
};

const store = configureStore({
  reducer: rootReducer,
  preloadedState: initialState,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(thunk), // Adding thunk to the middleware
  devTools: composeWithDevTools(),
});

export default store;
