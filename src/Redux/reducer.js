import * as actionTypes from "./actionTypes";

const messageState = {
    loggedIn: false,
    isAdmin: false,
    loggingAction: false,
    error: null
};
const mainReducer = (state = messageState, action) => {
    switch (action.type) {
        case actionTypes.LOGGING_ACTION: {
            return {
                ...state,
                loggingAction: true
            };
        }
        case actionTypes.LOGGED_IN:
            return {
                ...state,
                loggedIn: true,
                loggingAction: false,
                isAdmin: action.payload
            };
        case actionTypes.LOGGED_OUT:
            return {
                ...state,
                loggedIn: false,
                loggingAction: false,
                isAdmin: false
            };
        case actionTypes.ERROR:
            return {
                ...state,
                error: {title: action.payload.title, text: action.payload.text}
            };
        case actionTypes.RESET:
            return {...state, error: null};
        default:
            return state;
    }
};
export default mainReducer;