import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import catalogosService from '../services/catalogosService';

const PagoExitoso = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [descargando, setDescargando] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const payment_id = params.get('payment_id');
    const external_reference = params.get('external_reference');

    if (payment_id && external_reference) {
      setDescargando(true);
      catalogosService.descargarPdf(external_reference, payment_id)
        .then((data) => {
          if (data.linkDrive) {
            window.location.href = data.linkDrive;
          }
        })
        .catch((err) => {
          setError('No se pudo procesar la descarga de tu archivo. Verifica tu pago o contacta a soporte.');
        })
        .finally(() => {
          setDescargando(false);
        });
    }
  }, [location]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg text-center border-t-4 border-blue-600">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">¡Pago Exitoso!</h2>
        
        {descargando && (
          <div className="my-6">
            <p className="text-gray-600 mb-4">Procesando tu pago y preparando la descarga...</p>
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg my-6 text-sm">
            {error}
          </div>
        )}

        {!descargando && !error && (
          <p className="text-gray-600 mb-8">
            Si tu descarga no inició automáticamente, asegúrate de que el navegador no haya bloqueado las ventanas emergentes.
          </p>
        )}

        <button onClick={() => navigate('/catalogos')} className="w-full bg-blue-700 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-800 transition-colors">
          Volver al Catálogo
        </button>
      </div>
    </div>
  );
};

export default PagoExitoso;