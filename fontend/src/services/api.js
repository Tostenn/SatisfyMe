import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Configuration axios par défaut
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token d'authentification
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les réponses et erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API Functions
export const apiService = {
  // Authentification
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),

  // Réponses publiques
  submitResponse: (responseData) => api.post('/responses', responseData),

  // Admin - Réponses
  getResponses: (page = 1, limit = 10) => 
    api.get(`/admin/responses?page=${page}&limit=${limit}`),
  
  // Admin - Statistiques
  getStatistics: () => api.get('/admin/statistics'),

  // Admin - Export
  exportData: (format = 'csv') => 
    api.get(`/admin/export?format=${format}`, { responseType: 'blob' }),
};

export default api;