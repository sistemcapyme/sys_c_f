import React, { useState } from 'react';
import catalogosService from '../../services/catalogosService';

const BotonPagoCatalogoMP = ({ idArticulo, titulo, precio }) => {
  const [loading, setLoading] = useState(false);

  const handlePago = async () => {
    try {
      setLoading(true);
      const data = await catalogosService.crearPreferencia({ idArticulo, titulo, precio });
      
      if (data && data.init_point) {
        window.location.href = data.init_point;
      }
    } catch (error) {
      console.error('Error al iniciar el pago:', error);
      alert('Hubo un error al conectar con Mercado Pago. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handlePago} 
      disabled={loading}
      onMouseEnter={e => { if(!loading) e.currentTarget.style.background = '#008CDB'; }}
      onMouseLeave={e => { if(!loading) e.currentTarget.style.background = '#009EE3'; }}
      style={{ 
        width: '100%', 
        padding: '14px', 
        background: '#009EE3', 
        color: '#fff', 
        borderRadius: 'var(--radius-md)', 
        fontSize: '14px', 
        fontWeight: 700, 
        fontFamily: "'DM Sans', sans-serif", 
        border: 'none', 
        cursor: loading ? 'not-allowed' : 'pointer', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        gap: '8px', 
        transition: 'all 150ms ease',
        opacity: loading ? 0.7 : 1
      }}
    >
      {loading ? (
        <>
          <div style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          Procesando...
        </>
      ) : 'Pagar con Mercado Pago'}
    </button>
  );
};

export default BotonPagoCatalogoMP;