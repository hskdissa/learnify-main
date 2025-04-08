import axios from "axios";
import { USER_CHANGE_FAIL, USER_CHANGE_REQUEST, USER_CHANGE_SUCCESS, USER_LOGIN_FAIL, USER_LOGIN_REQUEST, USER_LOGIN_SUCCESS, USER_LOGOUT, USER_REGISTER_FAIL, USER_REGISTER_REQUEST, USER_REGISTER_SUCCESS, USER_TOTAL_POINTS_FAIL, USER_TOTAL_POINTS_REQUEST, USER_TOTAL_POINTS_SUCCESS } from "../constants/userConstants";

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


export const changeUser = (user) => async (dispatch, getState) => {
    try {
        dispatch({ type: USER_CHANGE_REQUEST });
        const {userLogin: {userInfo}} = getState();
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`,
        },
    };
    const {data} = await axios.post(`${API_URL}/api/users/my-profile`, user, config);
    dispatch({ type: USER_CHANGE_SUCCESS, payload: data });
    dispatch({ type: USER_LOGIN_SUCCESS, payload: data });

    localStorage.setItem("userInfo", JSON.stringify(data));
    
    } catch (error) {
        dispatch({ type: USER_CHANGE_FAIL, payload: error.response.data.message ? error.response.data.message : error.message });
    }
};


// Action to get total points and level
export const getTotalPoints = () => async (dispatch, getState) => {
    try {
        dispatch({ type: USER_TOTAL_POINTS_REQUEST });

        const { userLogin: { userInfo } } = getState();

        const config = {
            headers: {
                'Authorization': `Bearer ${userInfo.token}`, // Send the token in headers
            },
        };

        const { data } = await axios.get(`${API_URL}/api/users/total-points`, config);

        dispatch({ type: USER_TOTAL_POINTS_SUCCESS, payload: data });
    } catch (error) {
        dispatch({
            type: USER_TOTAL_POINTS_FAIL,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message,
        });
    }
};