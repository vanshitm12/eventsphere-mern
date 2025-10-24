import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : 'https://eventsphere-mern.onrender.com'; // ✅ Ensure correct backend URL

const API = axios.create({ baseURL });

API.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // ✅ Attach token
  }
  return config;
});

export default API;