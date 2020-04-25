import * as actionTypes from "./actionTypes";

const messageState = {
    loggedIn: "",
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
                loggingAction: false,
                loggedIn: action.payload.loggedIn,
                isAdmin: action.payload.isAdmin
            };
        case actionTypes.LOGGED_OUT:
            return {
                ...state,
                loggedIn: "",
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