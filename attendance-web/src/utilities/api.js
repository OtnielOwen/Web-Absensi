import axios from 'axios';

// const API_URL = 'http://localhost:5000/api/v1/';

const api = axios.create({
  baseURL: "http://localhost:5000/api/v1",
});

export default api;
