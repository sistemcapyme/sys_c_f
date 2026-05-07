import React, { useState } from 'react';
import { enlacesService } from '../../services/enlacesService';

const BotonPagoRecursoMP = ({ recurso, returnUrl, onSuccess, onError }) => {
  const [loading, setLoading] = useState(false);

  const handlePago = async () => {
    setLoading(true);
    try {
      const currentUrl = returnUrl || window.location.pathname;
      localStorage.setItem('recursoReturnUrl', currentUrl);

      const accesoRes = await enlacesService.solicitarAcceso(recurso.id, { urlRetorno: currentUrl });

      if (accesoRes.success) {
        if (accesoRes.requierePago && accesoRes.pagoInfo) {
          const prefRes = await enlacesService.crearPreferenciaMP({
            recursoId: recurso.id,
            referencia: accesoRes.pagoInfo.referencia,
            returnUrl: currentUrl
          });

          if (prefRes.success && prefRes.init_point) {
            window.location.href = prefRes.init_point;
          } else if (onError) {
            onError();
          }
        } else if (!accesoRes.requierePago) {
          if (onSuccess) onSuccess();
        }
      } else if (onError) {
        onError();
      }
    } catch (error) {
      if (onError) onError();
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePago}
      disabled={loading || !recurso?.activo}
      className={`w-full py-2 px-4 rounded-md font-semibold text-white transition-colors flex items-center justify-center gap-2 ${
        loading || !recurso?.activo ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
      }`}
    >
      {loading ? (
        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
      ) : (
        <>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
          </svg>
          Comprar - ${recurso?.costo || 0} MXN
        </>
      )}
    </button>
  );
};

export default BotonPagoRecursoMP;