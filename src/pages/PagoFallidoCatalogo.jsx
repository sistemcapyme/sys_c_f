import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import LogoCapyme from '../assets/LogoCapyme.png';

const PagoFallidoCatalogo = () => {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', background: 'var(--gray-50)', fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @keyframes modalIn{from{opacity:0;transform:scale(0.96) translateY(8px);}to{opacity:1;transform:scale(1) translateY(0);}}
      `}</style>
      
      <header style={{ background: '#fff', borderBottom: '1px solid var(--border)', padding: '16px 24px', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <img src={LogoCapyme} alt="CAPYME" style={{ height: '38px', objectFit: 'contain' }} />
        </div>
      </header>

      <div style={{ padding: '60px 20px', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 80px)' }}>
        <div style={{ background: '#fff', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)', width: '100%', maxWidth: '440px', padding: '40px 32px', textAlign: 'center', boxShadow: '0 24px 64px rgba(0,0,0,0.12)', position: 'relative', overflow: 'hidden', animation: 'modalIn 0.3s ease both' }}>
          
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '6px', background: '#EF4444' }}></div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: '80px', height: '80px', background: '#FEF2F2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', boxShadow: '0 8px 24px rgba(239,68,68,0.2)' }}>
              <AlertTriangle style={{ width: '36px', height: '36px', color: '#EF4444' }} />
            </div>
            
            <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '26px', fontWeight: 900, color: 'var(--gray-900)', marginBottom: '16px' }}>
              Pago Incompleto
            </h2>
            
            <p style={{ fontSize: '15px', color: 'var(--gray-600)', lineHeight: 1.6, marginBottom: '32px' }}>
              No pudimos procesar tu pago. Puede que hayas cancelado la operación o hubo un problema con tu método de pago. Tu cuenta no ha sido cargada.
            </p>

            <button 
              onClick={() => navigate('/catalogos')} 
              style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, var(--capyme-blue-mid), var(--capyme-blue))', border: 'none', color: '#fff', borderRadius: 'var(--radius-md)', fontSize: '14px', fontWeight: 700, fontFamily: "'DM Sans', sans-serif", cursor: 'pointer', boxShadow: '0 4px 12px rgba(31,78,158,0.25)', transition: 'all 150ms ease' }} 
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'} 
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              Volver al Catálogo
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PagoFallidoCatalogo;