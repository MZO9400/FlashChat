import * as actionTypes from "./actionTypes";
import Axios from 'axios';
import decode from 'jwt-decode';
import {setAuthToken} from '../headers';
export const setLoggingAction = dispatch => {
    return (dispatch, getState) => {
        dispatch({ type: actionTypes.LOGGING_ACTION });
    };
};
export const checkLogStatus = dispatch => {
    return (dispatch, getState) => {
        dispatch({type: actionTypes.LOGGING_ACTION});
        let token = localStorage.getItem("JWToken");
        if (token) {
            const decoded = decode(token);
            if (decoded.exp >= (Date.now() / 1000)) {
                dispatch({type: actionTypes.LOGGED_IN, payload: false});
            }
        }
        else {
            dispatch({type: actionTypes.LOGGED_OUT});
        }
    };
};

export const logOut = dispatch => {
    return (dispatch, getState) => {
        localStorage.removeItem("JWToken");
        dispatch({type: actionTypes.LOGGED_OUT})
    };
};

export const signInEmail = (email, password) => {
    return (dispatch, getState) => {
        dispatch({type: actionTypes.LOGGING_ACTION})
        Axios.post("http://localhost:8000/api/users/login", {email, password})
            .then(res => {
                localStorage.setItem("JWToken", res.data.token);
                dispatch({type: actionTypes.LOGGED_IN, payload: false});
            })
            .catch(e => dispatch({type: actionTypes.ERROR, payload: {
                    title: "Error",
                    text: e.toString()
                }}))
    };
};
export const signUpEmail = (email, password, name) => {
    return (dispatch, getState) => {
        Axios.post("http://localhost:8000/api/users/register", {email, name, password})
            .then(res => {
                dispatch(signInEmail(email, password))
            })
            .catch(e => dispatch({type: actionTypes.ERROR, payload: {
                title: "Error",
                text: e.toString()
                }}))
    };
};
export const resetErrorCode = () => {
    return (dispatch, getState) => {
        return dispatch({
            type: actionTypes.RESET
        });
    };
};