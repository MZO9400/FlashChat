import * as actionTypes from "./actionTypes";

export const setLoggingAction = dispatch => {
    return (dispatch, getState) => {
        dispatch({ type: actionTypes.LOGGING_ACTION });
    };
};
export const checkLogStatus = dispatch => {
    return (dispatch, getState) => {
        /*firebase.auth().onAuthStateChanged(user => {
            if (user) {
                firebase
                    .database()
                    .ref(`users/${user.uid}`)
                    .on("value", snap => {
                        dispatch({
                            type: actionTypes.LOGGED_IN,
                            payload: snap.val() ? snap.val().isAdmin : false
                        });
                    });
            } else {
                dispatch({ type: actionTypes.LOGGED_OUT });
            }
        });*/
    };
};

export const logOut = dispatch => {
    return (dispatch, getState) => {
        /*firebase
            .auth()
            .signOut()
            .then(response => dispatch({ type: actionTypes.LOGGED_OUT }))
            .catch(error => {});*/
    };
};

export const signInEmail = (email, password) => {
    return (dispatch, getState) => {
        /*firebase
            .auth()
            .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
            .then(() => {
                firebase
                    .auth()
                    .signInWithEmailAndPassword(email, password)
                    .then(result => {
                        return dispatch({
                            type: actionTypes.LOGGED_IN
                        });
                    })
                    .catch(function(error) {
                        var errorCode = error.code;
                        var errorMessage = error.message;
                        return dispatch({
                            type: actionTypes.ERROR,
                            payload: { title: errorCode, text: errorMessage }
                        });
                    });
            });*/
    };
};
export const signUpEmail = (email, password, name) => {
    return (dispatch, getState) => {
        /*firebase
            .auth()
            .createUserWithEmailAndPassword(email, password)
            .then(result => {
                result.user.updateProfile({
                    displayName: name
                });
            })
            .catch(function(error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                return dispatch({
                    type: actionTypes.ERROR,
                    payload: { title: errorCode, text: errorMessage }
                });
            });
        return dispatch({ type: actionTypes.LOGGED_IN });*/
    };
};
export const resetErrorCode = () => {
    return (dispatch, getState) => {
        return dispatch({
            type: actionTypes.RESET
        });
    };
};