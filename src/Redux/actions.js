import * as actionTypes from "./actionTypes";
import Axios from 'axios';
import decode from 'jwt-decode';
import {setAuthToken} from '../headers';

export const setLoggingAction = () => {
    return (dispatch) => {
        dispatch({type: actionTypes.LOGGING_ACTION});
    };
};
export const checkLogStatus = (callback) => {
    return (dispatch) => {
        dispatch({type: actionTypes.LOGGING_ACTION});
        let token = localStorage.getItem("JWToken");
        if (token) {
            const decoded = decode(token);
            if (decoded.exp >= (Date.now() / 1000)) {
                setAuthToken(token);
                callback && callback();
                return dispatch({
                    type: actionTypes.LOGGED_IN, payload: {
                        isAdmin: false,
                        loggedIn: decoded.id
                    }
                });
            }
        }
        dispatch({type: actionTypes.LOGGED_OUT});
    };
};

export const logOut = () => {
    return (dispatch) => {
        localStorage.removeItem("JWToken");
        setAuthToken(false);
        dispatch({type: actionTypes.LOGGED_OUT})
    };
};

export const signInEmail = (email, password, callback) => {
    return (dispatch) => {
        dispatch({type: actionTypes.LOGGING_ACTION})
        Axios.post("http://localhost:8000/api/users/login", {email, password})
            .then(res => {
                localStorage.setItem("JWToken", res.data.token);
                setAuthToken(res.data.token);
                const uid = decode(res.data.token).id;
                dispatch({
                    type: actionTypes.LOGGED_IN, payload: {
                        isAdmin: false,
                        loggedIn: uid
                    }
                });
                callback && callback();
            })
            .catch(e => {
                dispatch({
                    type: actionTypes.ERROR, payload: {title: e.response.statusText, text: e.response.data.error}
                })
            })
    };
};
export const signUpEmail = (email, password, name, user, callback) => {
    return (dispatch) => {
        Axios.post("http://localhost:8000/api/users/register", {email, name, password, user})
            .then(() => dispatch(signInEmail(email, password, callback)))
            .catch(e => dispatch({
                type: actionTypes.ERROR, payload: {title: e.response.statusText, text: e.response.data.error}
            }))
    };
};
export const resetErrorCode = () => {
    return (dispatch) => {
        return dispatch({
            type: actionTypes.RESET
        });
    };
};
export const getProfileInfo = (uid) => {
    return Axios.post("http://localhost:8000/api/users/getInfo", {uid})
        .then(res => res)
        .catch(er => console.log(er));
}
