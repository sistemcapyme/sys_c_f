import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from '../services/axios';

const PagoExitosoRecurso = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [estado, setEstado] = useState('procesando');
  const [mensaje, setMensaje] = useState('Validando tu pago y preparando la descarga...');

  useEffect(() => {
    const validarPago = async () => {
      try {
        const referencia = searchParams.get('external_reference');
        const preferenceId = searchParams.get('preference_id');

        if (!referencia) {
          setEstado('error');
          setMensaje('No se encontró la referencia del pago.');
          return;
        }

        const res = await axios.post('/api/enlaces/confirmar', { referencia });
        
        if (res.data.success) {
          setEstado('exito');
          setMensaje('¡Pago validado! Iniciando descarga...');
          
          if (res.data.urlDrive) {
            iniciarDescargaDrive(res.data.urlDrive);
          }

          setTimeout(() => {
            const urlRetorno = localStorage.getItem('recursoReturnUrl') || '/cliente/recursos';
            localStorage.removeItem('recursoReturnUrl');
            navigate(urlRetorno);
          }, 3000);
        } else {
          setEstado('error');
          setMensaje('No se pudo validar el pago en nuestro sistema.');
        }
      } catch (error) {
        setEstado('error');
        setMensaje('Ocurrió un error al procesar la confirmación del pago.');
      }
    };

    validarPago();
  }, [searchParams, navigate]);

  const iniciarDescargaDrive = (url) => {
    try {
      const idMatch = url.match(/[-\w]{25,}/);
      if (idMatch && idMatch[0]) {
        const fileId = idMatch[0];
        const downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.target = '_blank';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } else {
        window.open(url, '_blank');
      }
    } catch (e) {
      window.open(url, '_blank');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {estado === 'procesando' && (
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
        )}
        {estado === 'exito' && (
          <svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        )}
        {estado === 'error' && (
          <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        )}
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {estado === 'procesando' ? 'Procesando pago' : estado === 'exito' ? '¡Pago Exitoso!' : 'Error en el pago'}
        </h2>
        <p className="text-gray-600 mb-6">{mensaje}</p>
        {estado === 'error' && (
          <button
            onClick={() => navigate('/cliente/recursos')}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Volver a Recursos
          </button>
        )}
      </div>
    </div>
  );
};

export default PagoExitosoRecurso;