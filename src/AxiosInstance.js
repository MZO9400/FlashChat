import axios from 'axios';

const backend = axios.create({
    baseURL: 'http://localhost:8000/',
    transformRequest: [(data) => JSON.stringify(data.data)],
    headers: {
        'Accept': '*/*',
        'Content-Type': 'application/x-www-form-urlencoded'
    }
});

export default backend;