import React from 'react';
import { useNavigate } from 'react-router-dom';

const PagoFallidoCatalogo = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md w-full">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Pago Incompleto</h2>
        <p className="text-gray-600 mb-6 text-lg">No pudimos procesar tu pago. Tu cuenta no ha sido cargada.</p>
        
        <button
          onClick={() => navigate('/catalogos')}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200"
        >
          Volver al Catálogo
        </button>
      </div>
    </div>
  );
};

export default PagoFallidoCatalogo;