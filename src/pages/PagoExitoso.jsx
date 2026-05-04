import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import catalogosService from '../services/catalogosService';
import { CheckCircle, Download, Loader2 } from 'lucide-react';

const PagoExitoso = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [estado, setEstado] = useState('procesando'); // procesando | completado | error
  const [mensajeError, setMensajeError] = useState('');
  const [contador, setContador] = useState(5);
  const descargaIniciada = useRef(false);

  // Función para extraer el ID de un enlace de Google Drive
  const extraerIdDrive = (url) => {
    const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
    if (match && match[1]) {
      return match[1];
    }
    // Para URLs de formato antiguo (id=...)
    const urlParams = new URL(url);
    return urlParams.searchParams.get('id');
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const payment_id = params.get('payment_id');
    const external_reference = params.get('external_reference');

    // Solo iniciar el proceso una vez
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
        
        // Convertir link de Drive a link de descarga directa
        const fileId = extraerIdDrive(data.linkDrive);
        let linkDescarga = data.linkDrive; // Por defecto usamos el original por si falla la extracción

        if (fileId) {
          linkDescarga = `https://drive.google.com/uc?export=download&id=${fileId}`;
        }

        // Forzar la descarga invisible usando un elemento <a>
        const linkElement = document.createElement('a');
        linkElement.href = linkDescarga;
        // Nombre sugerido (Drive a veces lo ignora, pero es buena práctica)
        linkElement.setAttribute('download', `${data.titulo || 'Catalogo_CAPYME'}.pdf`); 
        linkElement.style.display = 'none';
        document.body.appendChild(linkElement);
        linkElement.click();
        document.body.removeChild(linkElement);

        // Iniciar el temporizador para redirigir
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
      setContador(tiempoRestante);
      
      if (tiempoRestante <= 0) {
        clearInterval(intervalo);
        navigate('/catalogos');
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#EEF4FF]/30 font-sans px-4">
      <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-3xl shadow-xl border border-gray-100 text-center relative overflow-hidden">
        
        {/* Decoración superior */}
        <div className={`absolute top-0 left-0 w-full h-2 ${estado === 'error' ? 'bg-red-500' : 'bg-[#1F4E9E]'}`}></div>

        {estado === 'procesando' && (
          <div className="flex flex-col items-center animate-in fade-in zoom-in duration-500">
            <div className="w-20 h-20 bg-[#EEF4FF] rounded-full flex items-center justify-center mb-6">
              <Loader2 className="w-10 h-10 text-[#1F4E9E] animate-spin" />
            </div>
            <h2 className="text-2xl font-display font-bold text-[#0F2A5A] mb-3">Validando tu pago</h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              Estamos verificando la información con Mercado Pago de forma segura. Por favor, no cierres esta ventana.
            </p>
          </div>
        )}

        {estado === 'completado' && (
          <div className="flex flex-col items-center animate-in slide-in-from-bottom-4 fade-in duration-500">
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-20"></div>
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center relative z-10">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
            </div>
            <h2 className="text-3xl font-display font-black text-[#0F2A5A] mb-4">¡Pago Exitoso!</h2>
            
            <div className="bg-[#EEF4FF]/50 p-5 rounded-2xl mb-8 w-full border border-[#EEF4FF]">
              <div className="flex items-center justify-center gap-3 text-[#1F4E9E] font-bold mb-2">
                <Download size={20} className="animate-bounce" />
                <span>Descarga en curso...</span>
              </div>
              <p className="text-xs text-gray-500">
                Tu PDF debería comenzar a descargarse automáticamente. Revisa tu carpeta de descargas.
              </p>
            </div>

            <p className="text-sm font-medium text-gray-400 mb-6">
              Serás redirigido al catálogo en <span className="font-bold text-[#1F4E9E] text-lg mx-1">{contador}</span> segundos
            </p>

            <button 
              onClick={() => navigate('/catalogos')} 
              className="w-full bg-white border border-gray-200 text-gray-600 font-bold py-3 px-4 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Volver al Catálogo Ahora
            </button>
          </div>
        )}

        {estado === 'error' && (
          <div className="flex flex-col items-center animate-in slide-in-from-bottom-4 fade-in duration-500">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
              <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-display font-bold text-gray-900 mb-4">Algo salió mal</h2>
            
            <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-8 text-sm text-left w-full border border-red-100">
              {mensajeError}
            </div>

            <button 
              onClick={() => navigate('/catalogos')} 
              className="w-full bg-[#1F4E9E] text-white font-bold py-3 px-4 rounded-xl hover:bg-[#0F2A5A] transition-all shadow-md active:scale-95"
            >
              Volver a intentar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PagoExitoso;