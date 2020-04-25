import * as actionTypes from "./actionTypes";
import Axios from 'axios';
import decode from 'jwt-decode';
import {setAuthToken} from '../headers';
export const setLoggingAction = () => {
    return (dispatch) => {
        dispatch({ type: actionTypes.LOGGING_ACTION });
    };
};
export const checkLogStatus = () => {
    return (dispatch) => {
        dispatch({type: actionTypes.LOGGING_ACTION});
        let token = localStorage.getItem("JWToken");
        if (token) {
            const decoded = decode(token);
            if (decoded.exp >= (Date.now() / 1000)) {
                setAuthToken(token);
                dispatch({type: actionTypes.LOGGED_IN, payload: false});
            }
        }
        else {
            dispatch({type: actionTypes.LOGGED_OUT});
        }
    };
};

export const logOut = () => {
    return (dispatch) => {
        localStorage.removeItem("JWToken");
        setAuthToken(false);
        dispatch({type: actionTypes.LOGGED_OUT})
    };
};

export const signInEmail = (email, password) => {
    return (dispatch) => {
        dispatch({type: actionTypes.LOGGING_ACTION})
        Axios.post("http://localhost:8000/api/users/login", {email, password})
            .then(res => {
                localStorage.setItem("JWToken", res.data.token);
                setAuthToken(res.data.token);
                dispatch({type: actionTypes.LOGGED_IN, payload: false});
            })
            .catch(e => dispatch({type: actionTypes.ERROR, payload: {
                    title: "Error",
                    text: e.toString()
                }}))
    };
};
export const signUpEmail = (email, password, name) => {
    return (dispatch) => {
        Axios.post("http://localhost:8000/api/users/register", {email, name, password})
            .then(() => dispatch(signInEmail(email, password)))
            .catch(e => dispatch({type: actionTypes.ERROR, payload: {
                title: "Error",
                text: e.toString()
                }}))
    };
};
export const resetErrorCode = () => {
    return (dispatch) => {
        return dispatch({
            type: actionTypes.RESET
        });
    };
};