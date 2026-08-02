import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const api = axios.create({
  baseURL: (import.meta.env.VITE_API_URL?.endsWith('/api') 
            ? import.meta.env.VITE_API_URL 
            : `${import.meta.env.VITE_API_URL}/api`),
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const state = useAuthStore.getState();
    const token = state.token || localStorage.getItem('token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const message = error.response?.data?.message || '';
      const esInactivo = message.toLowerCase().includes('inactivo') || 
                         message.toLowerCase().includes('no válido o inactivo');

      if (esInactivo) {
        let contacto = null;
        try {
          const resp = await axios.get(`${api.defaults.baseURL}/contacto`);
          if (resp.data?.success && resp.data?.data) {
            contacto = {
              email:    resp.data.data.email    || null,
              whatsapp: resp.data.data.whatsapp || null,
            };
          }
        } catch {
        }

        useAuthStore.getState().mostrarInactivoModal(contacto);
        return Promise.reject(error);
      }

      const authStore = useAuthStore.getState();
      authStore.logout();
      localStorage.clear();
      
      window.location.href = '/login';
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export default api;