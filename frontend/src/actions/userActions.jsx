import axios from "axios";
import { USER_LOGIN_FAIL, USER_LOGIN_REQUEST, USER_LOGIN_SUCCESS, USER_LOGOUT, USER_REGISTER_FAIL, USER_REGISTER_REQUEST, USER_REGISTER_SUCCESS } from "../constants/userConstants";

const API_URL = import.meta.env.VITE_API_URL;

//SIGNIN ACTIONS
export const login = (email, password) => async (dispatch) => {
    try {
        dispatch({ type: USER_LOGIN_REQUEST });

        const config = {
            headers: { "Content-type": "application/json" }
        };


        const { data } = await axios.post(`${API_URL}/api/users/login`, { email, password }, config);
        
        // Dispatch success action with user data
        dispatch({ type: USER_LOGIN_SUCCESS, payload: data });
        
        // Store user info in localStorage
        localStorage.setItem('userInfo', JSON.stringify(data));

    } catch (err) {
        // Dispatch failure action with error message
        dispatch({ type: USER_LOGIN_FAIL, payload: err.response && err.response.data.message ? err.response.data.message : err.message });
    }
};

//LOGOUT ACTIONS
export const logout = () => async (dispatch) => {
    localStorage.removeItem('userInfo');
    dispatch({ type: USER_LOGOUT });
    };


// REGISTER ACTIONS
export const register = (name, email, password) => async (dispatch) => {
    try {
        dispatch({ type: USER_REGISTER_REQUEST });
        
        const config = {
            headers: { "Content-type": "application/json" },
        };
        
        const { data } = await axios.post(`${API_URL}/api/users`, { name, email, password }, config);


        dispatch({ type: USER_REGISTER_SUCCESS, payload: data });

        dispatch({ type: USER_LOGIN_SUCCESS, payload: data });

        localStorage.setItem("userInfo", JSON.stringify(data));
    } catch (error) {
        dispatch({ type: USER_REGISTER_FAIL, payload: error.response.data.message ? error.response.data.message : error.message });
    }
};