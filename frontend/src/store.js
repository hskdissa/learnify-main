import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import { thunk } from "redux-thunk"; // Weird, keeps changing
import { composeWithDevTools } from "redux-devtools-extension";
import { userLoginReducer, userRegisterReducer } from "./reducers/userReducers";
import { noteCreateReducer, noteDeleteReducer, noteListReducer, noteUpdateReducer } from "./reducers/noteReducers";
import { uploadFileReducer } from "./reducers/uploadReducers";
import { openaiGenerateReducer } from './reducers/openaiReducers';

// Combine your reducers
const rootReducer = combineReducers({
  // Add reducers here, for example:
  userLogin: userLoginReducer,
  userRegister: userRegisterReducer,
  noteList: noteListReducer,
  noteCreate: noteCreateReducer,
  noteUpdate: noteUpdateReducer,
  noteDelete: noteDeleteReducer,
  uploadFile: uploadFileReducer,
  openaiGenerate: openaiGenerateReducer,

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
