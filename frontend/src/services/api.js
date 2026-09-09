import axios from 'axios';

const api = axios.create({
  baseURL: 'https://task-tracker-backend-i8ew.onrender.com',
});

export default api;