import Axios from 'axios';

const instance = Axios.create({
    baseURL: Boolean(process.env.REACT_APP_isDebugging) ? 'http://localhost:8000' : 'https://flash-chat.azurewebsites.net'
});
export default instance;
