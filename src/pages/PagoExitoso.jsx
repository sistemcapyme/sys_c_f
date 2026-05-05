import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import LogoCapyme from '../assets/LogoCapyme.png';

const PagoExitoso = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [countdown, setCountdown] = useState(5);
  
  const searchParams = new URLSearchParams(location.search);
  const returnUrl = searchParams.get('return_url') || '/';

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate(returnUrl);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate, returnUrl]);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--gray-50)', fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @keyframes modalIn{from{opacity:0;transform:scale(0.96) translateY(8px);}to{opacity:1;transform:scale(1) translateY(0);}}
      `}</style>
      
      {/* Header Minimalista */}
      <header style={{ background: '#fff', borderBottom: '1px solid var(--border)', padding: '16px 24px', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <img src={LogoCapyme} alt="CAPYME" style={{ height: '38px', objectFit: 'contain' }} />
        </div>
      </header>

      {/* Contenedor del Modal */}
      <div style={{ padding: '60px 20px', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 80px)' }}>
        <div style={{ background: '#fff', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)', width: '100%', maxWidth: '440px', padding: '40px 32px', textAlign: 'center', boxShadow: '0 24px 64px rgba(0,0,0,0.12)', position: 'relative', overflow: 'hidden', animation: 'modalIn 0.3s ease both' }}>
          
          {/* Línea Superior Decorativa */}
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '6px', background: 'linear-gradient(90deg, var(--capyme-blue-mid), var(--capyme-blue))' }}></div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            
            {/* Ícono de Éxito */}
            <div style={{ width: '80px', height: '80px', background: '#ECFDF5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', boxShadow: '0 8px 24px rgba(16,185,129,0.2)' }}>
              <CheckCircle style={{ width: '40px', height: '40px', color: '#10B981' }} />
            </div>
            
            <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '28px', fontWeight: 900, color: 'var(--capyme-dark)', marginBottom: '16px' }}>
              ¡Pago Exitoso!
            </h2>
            
            <p style={{ fontSize: '15px', color: 'var(--gray-600)', lineHeight: 1.6, marginBottom: '32px' }}>
              Tu transacción se ha procesado correctamente. Gracias por confiar en nosotros.
            </p>

            <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--gray-400)', marginBottom: '24px' }}>
              Regresando a tu página en <span style={{ color: 'var(--capyme-blue-mid)', fontSize: '18px', fontWeight: 800 }}>{countdown}</span>s
            </p>

            {/* Botón de Acción */}
            <button 
              onClick={() => navigate(returnUrl)} 
              style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, var(--capyme-blue-mid), var(--capyme-blue))', border: 'none', color: '#fff', borderRadius: 'var(--radius-md)', fontSize: '14px', fontWeight: 700, fontFamily: "'DM Sans', sans-serif", cursor: 'pointer', transition: 'all 150ms ease', boxShadow: '0 4px 12px rgba(31,78,158,0.25)' }} 
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'} 
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              Regresar ahora
            </button>

          </div>
        </div>
      </div>
    </div>
  );
};

export default PagoExitoso;