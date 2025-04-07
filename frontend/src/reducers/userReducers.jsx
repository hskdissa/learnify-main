import { USER_LOGIN_FAIL, USER_LOGIN_REQUEST, USER_LOGIN_SUCCESS, USER_LOGOUT, USER_REGISTER_REQUEST, USER_REGISTER_SUCCESS, USER_REGISTER_FAIL, USER_CHANGE_REQUEST, USER_CHANGE_SUCCESS, USER_CHANGE_FAIL} from "../constants/userConstants";


//SIGNIN REDUCERS
export const userLoginReducer = (state = {}, action) => {
    switch (action.type) {
        case USER_LOGIN_REQUEST:
            return { loading: true};
        case USER_LOGIN_SUCCESS:
            return { loading: true, userInfo: action.payload };
        case USER_LOGIN_FAIL:
            return { loading: false, error: action.payload };
        case USER_LOGOUT:
            return {};
        default:
            return state;
    }
};

// REGISTER REDUCERS
export const userRegisterReducer = (state = {}, action) => {
    switch (action.type) {
        case USER_REGISTER_REQUEST:
            return { loading: true};
        case USER_REGISTER_SUCCESS:
            return { loading: false, userInfo: action.payload };
        case USER_REGISTER_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};

export const userChangeReducer = (state = {}, action) => {
    switch (action.type) {
        case USER_CHANGE_REQUEST:
            return { loading: true};
        case USER_CHANGE_SUCCESS:
            return { loading: false, userInfo: action.payload, success: true };
        case USER_CHANGE_FAIL:
            return { loading: false, error: action.payload, success: false };
        default:
            return state;
    }
};