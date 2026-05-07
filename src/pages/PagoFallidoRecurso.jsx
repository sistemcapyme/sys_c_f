import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const PagoFallidoRecurso = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const handleReturn = () => {
    const urlGuardada = localStorage.getItem('recursoReturnUrl');
    localStorage.removeItem('recursoReturnUrl');

    if (urlGuardada && urlGuardada !== '/login' && urlGuardada !== '/') {
      navigate(urlGuardada);
      return;
    }

    if (user?.rol === 'admin' || user?.rol === 'colaborador') {
      navigate('/admin/enlaces');
    } else {
      navigate('/cliente/recursos');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Pago No Realizado</h2>
        <p className="text-gray-600 mb-6">
          Tu pago no pudo ser procesado o fue cancelado. No se han realizado cargos a tu cuenta.
        </p>
        <button
          onClick={handleReturn}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors w-full font-semibold"
        >
          Intentar de nuevo
        </button>
      </div>
    </div>
  );
};

export default PagoFallidoRecurso;