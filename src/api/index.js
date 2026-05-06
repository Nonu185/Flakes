import axios from 'axios';

let API_URL = import.meta.env.VITE_API_URL;

// Fallback for development (proxy) or production
if (!API_URL) {
  API_URL = import.meta.env.MODE === 'production' 
    ? 'https://flakes.onrender.com/api'
    : '/api';
}

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;
