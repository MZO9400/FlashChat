import axios from './axiosInstance';

export const setAuthToken = token => {
    if (token) {
        axios.defaults.headers.common["Authorization"] = token;
    } else {
        delete axios.defaults.headers.common["Authorization"];
    }
};