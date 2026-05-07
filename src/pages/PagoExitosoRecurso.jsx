import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from '../services/axios';

const PagoExitosoRecurso = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [estado, setEstado] = useState('procesando');
  const [mensaje, setMensaje] = useState('Validando tu pago y preparando la descarga...');
  const [downloadUrl, setDownloadUrl] = useState('');

  useEffect(() => {
    const validarPago = async () => {
      try {
        const referencia = searchParams.get('external_reference');
        if (!referencia) {
          setEstado('error');
          setMensaje('No se encontró la referencia del pago.');
          return;
        }

        const res = await axios.post('/api/enlaces/confirmar', { referencia });
        
        if (res.data.success) {
          setEstado('exito');
          setMensaje('¡Pago validado! Iniciando descarga automática...');
          
          if (res.data.urlDrive) {
            setDownloadUrl(res.data.urlDrive);
            ejecutarDescarga(res.data.urlDrive);
          }

          setTimeout(() => {
            handleRedireccion();
          }, 5000);
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
  }, [searchParams]);

  const ejecutarDescarga = (url) => {
    let finalUrl = url;
    
    const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/) || url.match(/id=([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      finalUrl = `https://drive.google.com/uc?export=download&id=${match[1]}`;
    }

    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = finalUrl;
    document.body.appendChild(iframe);

    setTimeout(() => {
      if (document.body.contains(iframe)) {
        document.body.removeChild(iframe);
      }
    }, 10000);
  };

  const handleRedireccion = () => {
    const authStorage = JSON.parse(localStorage.getItem('auth-storage') || '{}');
    const userRol = authStorage?.state?.user?.rol;

    const urlGuardada = localStorage.getItem('recursoReturnUrl');
    localStorage.removeItem('recursoReturnUrl');

    if (urlGuardada && !urlGuardada.includes('/login') && urlGuardada !== '/') {
      navigate(urlGuardada);
      return;
    }

    if (userRol === 'admin' || userRol === 'colaborador') {
      navigate('/admin/enlaces');
    } else {
      navigate('/cliente/recursos');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {estado === 'procesando' && (
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
        )}
        {estado === 'exito' && (
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">¡Pago Exitoso!</h2>
            <p className="text-gray-600 mb-4">{mensaje}</p>
            {downloadUrl && (
              <div className="bg-blue-50 p-4 rounded-md mb-6 w-full">
                <p className="text-xs text-blue-700 mb-2">Si la descarga no inició automáticamente:</p>
                <button 
                  onClick={() => ejecutarDescarga(downloadUrl)}
                  className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-semibold inline-block hover:bg-blue-700 transition-colors"
                >
                  Forzar Descarga Manualmente
                </button>
              </div>
            )}
            <button
              onClick={handleRedireccion}
              className="text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors"
            >
              Regresar a mis recursos
            </button>
          </div>
        )}
        {estado === 'error' && (
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Error en la validación</h2>
            <p className="text-gray-600 mb-6">{mensaje}</p>
            <button
              onClick={handleRedireccion}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Volver a Recursos
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PagoExitosoRecurso;