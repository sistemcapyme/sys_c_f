import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import catalogosService from '../services/catalogosService';

const PagoExitosoCatalogo = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [estado, setEstado] = useState('procesando');
  const [mensajeError, setMensajeError] = useState('');
  const [countdown, setCountdown] = useState(5);
  const descargaIniciada = useRef(false);

  const extraerIdDrive = (url) => {
    const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
    if (match && match[1]) return match[1];
    const urlParams = new URL(url);
    return urlParams.searchParams.get('id');
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const payment_id = params.get('payment_id');
    const external_reference = params.get('external_reference');

    if (payment_id && external_reference && !descargaIniciada.current) {
      descargaIniciada.current = true;
      procesarDescarga(external_reference, payment_id);
    } else if (!payment_id || !external_reference) {
      setEstado('error');
      setMensajeError('Información de pago incompleta. Si realizaste el pago, contacta a soporte.');
    }
  }, [location]);

  const procesarDescarga = async (external_reference, payment_id) => {
    try {
      const data = await catalogosService.descargarPdf(external_reference, payment_id);
      
      if (data && data.linkDrive) {
        setEstado('completado');
        const fileId = extraerIdDrive(data.linkDrive);
        let linkDescarga = data.linkDrive;

        if (fileId) linkDescarga = `https://drive.google.com/uc?export=download&id=${fileId}`;

        const linkElement = document.createElement('a');
        linkElement.href = linkDescarga;
        linkElement.setAttribute('download', `${data.titulo || 'Catalogo'}.pdf`); 
        linkElement.style.display = 'none';
        document.body.appendChild(linkElement);
        linkElement.click();
        document.body.removeChild(linkElement);

        iniciarRedireccion();
      } else {
        throw new Error('No se recibió el enlace de descarga');
      }
    } catch (err) {
      console.error(err);
      setEstado('error');
      setMensajeError('No se pudo procesar la descarga de tu archivo. Verifica tu pago o contacta a soporte.');
    }
  };

  const iniciarRedireccion = () => {
    let tiempoRestante = 5;
    const intervalo = setInterval(() => {
      tiempoRestante -= 1;
      setCountdown(tiempoRestante);
      if (tiempoRestante <= 0) {
        clearInterval(intervalo);
        navigate('/catalogos');
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md w-full">
        
        {estado === 'procesando' && (
          <>
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-blue-600 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Validando pago</h2>
            <p className="text-gray-600 mb-6 text-lg">Estamos preparando tu descarga...</p>
          </>
        )}

        {estado === 'completado' && (
          <>
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">¡Pago Exitoso!</h2>
            <p className="text-gray-600 mb-6 text-lg">Tu PDF se está descargando automáticamente.</p>
            
            <p className="text-sm text-gray-500 mb-8 font-medium">
              Regresando al catálogo en <span className="text-blue-600 text-lg">{countdown}</span> segundos...
            </p>

            <button
              onClick={() => navigate('/catalogos')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200"
            >
              Regresar ahora
            </button>
          </>
        )}

        {estado === 'error' && (
          <>
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Algo salió mal</h2>
            <p className="text-gray-600 mb-6 text-lg">{mensajeError}</p>
            
            <button
              onClick={() => navigate('/catalogos')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200"
            >
              Volver al Catálogo
            </button>
          </>
        )}

      </div>
    </div>
  );
};

export default PagoExitosoCatalogo;