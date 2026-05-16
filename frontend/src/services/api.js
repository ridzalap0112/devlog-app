import axios from 'axios';

// Base URL backend kita
const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Interceptor — otomatis tambahkan token di setiap request
// Ini seperti "pelayan" yang selalu bawa kartu identitas setiap kali keluar
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('devlog_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth endpoints
export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  getProfile: () => API.get('/auth/profile'),
};

// Logs endpoints
export const logsAPI = {
  getAll: () => API.get('/logs'),
  getById: (id) => API.get(`/logs/${id}`),
  create: (data) => API.post('/logs', data),
  update: (id, data) => API.put(`/logs/${id}`, data),
  delete: (id) => API.delete(`/logs/${id}`),
};

export default API;
