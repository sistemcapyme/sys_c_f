import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { authService } from '../services/authService';
import { toast } from 'react-hot-toast';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  const { login: setAuth, logout: clearAuth, user, isAuthenticated } = useAuthStore();

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authService.login(email, password);
      
      if (response.success && response.data?.token && response.data?.usuario) {
        setAuth(response.data.usuario, response.data.token);

        await new Promise(resolve => setTimeout(resolve, 100));
        
        const rol = response.data.usuario.rol;
        
        if (rol === 'admin' || rol === 'colaborador') {
          navigate('/dashboard', { replace: true });
        } else if (rol === 'lider_jcf') {
          navigate('/jcf', { replace: true });
        } else if (rol === 'encargado_jcf') {
          navigate('/kanban', { replace: true });
        } else {
          navigate('/cliente/dashboard', { replace: true });
        }
        
        toast.success('¡Bienvenido!');
        return true;
      } else {
        throw new Error('Respuesta inválida del servidor');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Error al iniciar sesión';
      setError(errorMsg);
      toast.error(errorMsg);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authService.register(userData);
      
      if (response.success && response.data?.token && response.data?.usuario) {
        setAuth(response.data.usuario, response.data.token);

        await new Promise(resolve => setTimeout(resolve, 100));
        
        toast.success('¡Registro exitoso!');
        navigate('/cliente/dashboard', { replace: true });
        return true;
      } else {
        throw new Error('Respuesta inválida del servidor');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Error al registrarse';
      setError(errorMsg);
      toast.error(errorMsg);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    clearAuth();
    localStorage.clear();
    toast.success('Sesión cerrada');
    navigate('/login', { replace: true });
  };

  return {
    login,
    register,
    logout,
    loading,
    error,
    user,
    isAuthenticated
  };
};