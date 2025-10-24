import axios from 'axios';

// Determine base URL based on environment
const baseURL = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/api`
  : 'https://eventsphere-mern.onrender.com/api';

// Create axios instance with configuration
const API = axios.create({ 
  baseURL,
  timeout: 10000, // 10 second timeout
  withCredentials: true, // Important for CORS with credentials
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Request interceptor - Add token to all requests
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log request for debugging (remove in production)
    console.log(`API Request: ${config.method.toUpperCase()} ${config.url}`);
    
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
API.interceptors.response.use(
  (response) => {
    // Log successful response (remove in production)
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.status, error.message);
    
    // Handle specific error cases
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          console.log('Unauthorized - clearing token');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
          break;
          
        case 403:
          // Forbidden - user doesn't have permission
          console.error('Access forbidden:', data.message);
          break;
          
        case 404:
          // Not found
          console.error('Resource not found:', error.config.url);
          break;
          
        case 500:
          // Server error
          console.error('Server error:', data.message);
          break;
      }
    } else if (error.request) {
      // Request made but no response received
      console.error('No response from server. Check if backend is running.');
      console.error('Request URL:', error.config?.url);
    } else {
      // Error in request configuration
      console.error('Request configuration error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default API;