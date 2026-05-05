import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import catalogosService from '../services/catalogosService';
import { CheckCircle, Download, Loader2, AlertCircle } from 'lucide-react';
import LogoCapyme from '../assets/LogoCapyme.png';

const PagoExitosoCatalogo = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [estado, setEstado] = useState('procesando'); 
  const [mensajeError, setMensajeError] = useState('');
  const [contador, setContador] = useState(5);
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
        linkElement.setAttribute('download', `${data.titulo || 'Catalogo_CAPYME'}.pdf`); 
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
      setContador(tiempoRestante);
      if (tiempoRestante <= 0) {
        clearInterval(intervalo);
        navigate('/catalogos');
      }
    }, 1000);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--gray-50)', fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @keyframes modalIn{from{opacity:0;transform:scale(0.96) translateY(8px);}to{opacity:1;transform:scale(1) translateY(0);}}
        @keyframes spin{to{transform:rotate(360deg);}}
        @keyframes pulseSoft{0%,100%{opacity:1;}50%{opacity:0.7;}}
      `}</style>
      
      <header style={{ background: '#fff', borderBottom: '1px solid var(--border)', padding: '16px 24px', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <img src={LogoCapyme} alt="CAPYME" style={{ height: '38px', objectFit: 'contain' }} />
        </div>
      </header>

      <div style={{ padding: '60px 20px', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 80px)' }}>
        <div style={{ background: '#fff', borderRadius: 'var(--radius-xl)', width: '100%', maxWidth: '440px', padding: '40px 32px', textAlign: 'center', boxShadow: '0 24px 64px rgba(0,0,0,0.12)', position: 'relative', overflow: 'hidden', animation: 'modalIn 0.3s ease both' }}>
          
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '6px', background: estado === 'error' ? '#EF4444' : 'linear-gradient(90deg, var(--capyme-blue-mid), var(--capyme-blue))' }}></div>

          {estado === 'procesando' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: '80px', height: '80px', background: 'var(--capyme-blue-pale)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                <Loader2 style={{ width: '36px', height: '36px', color: 'var(--capyme-blue-mid)', animation: 'spin 1s linear infinite' }} />
              </div>
              <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '24px', fontWeight: 900, color: 'var(--capyme-dark)', marginBottom: '12px' }}>Validando tu pago</h2>
              <p style={{ fontSize: '15px', color: 'var(--gray-500)', lineHeight: 1.6 }}>Estamos verificando la información de forma segura. Por favor, no cierres esta ventana.</p>
            </div>
          )}

          {estado === 'completado' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: '80px', height: '80px', background: '#ECFDF5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', boxShadow: '0 8px 24px rgba(16,185,129,0.2)' }}>
                <CheckCircle style={{ width: '40px', height: '40px', color: '#10B981' }} />
              </div>
              <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '28px', fontWeight: 900, color: 'var(--capyme-dark)', marginBottom: '16px' }}>¡Pago Exitoso!</h2>
              
              <div style={{ background: 'var(--capyme-blue-pale)', border: '1px solid rgba(43,91,166,0.1)', padding: '20px', borderRadius: 'var(--radius-lg)', width: '100%', marginBottom: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', color: 'var(--capyme-blue-mid)', fontWeight: 800, marginBottom: '8px' }}>
                  <Download style={{ width: '20px', height: '20px', animation: 'pulseSoft 2s infinite' }} />
                  <span>Descarga en curso...</span>
                </div>
                <p style={{ fontSize: '13px', color: 'var(--gray-600)', margin: 0 }}>Tu PDF se descargará automáticamente. Revisa tu carpeta de descargas.</p>
              </div>

              <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--gray-400)', marginBottom: '24px' }}>
                Regresando al catálogo en <span style={{ color: 'var(--capyme-blue-mid)', fontSize: '18px', fontWeight: 800 }}>{contador}</span>s
              </p>

              <button onClick={() => navigate('/catalogos')} style={{ width: '100%', padding: '14px', background: '#fff', border: '1px solid var(--border)', color: 'var(--gray-700)', borderRadius: 'var(--radius-md)', fontSize: '14px', fontWeight: 700, fontFamily: "'DM Sans', sans-serif", cursor: 'pointer', transition: 'all 150ms ease' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--gray-100)'} onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
                Volver al Catálogo Ahora
              </button>
            </div>
          )}

          {estado === 'error' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: '80px', height: '80px', background: '#FEF2F2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', boxShadow: '0 8px 24px rgba(239,68,68,0.2)' }}>
                <AlertCircle style={{ width: '40px', height: '40px', color: '#EF4444' }} />
              </div>
              <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '24px', fontWeight: 900, color: 'var(--gray-900)', marginBottom: '16px' }}>Algo salió mal</h2>
              
              <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', padding: '16px', borderRadius: 'var(--radius-md)', width: '100%', marginBottom: '32px', textAlign: 'left' }}>
                <p style={{ fontSize: '14px', color: '#DC2626', margin: 0, lineHeight: 1.5 }}>{mensajeError}</p>
              </div>

              <button onClick={() => navigate('/catalogos')} style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, var(--capyme-blue-mid), var(--capyme-blue))', border: 'none', color: '#fff', borderRadius: 'var(--radius-md)', fontSize: '14px', fontWeight: 700, fontFamily: "'DM Sans', sans-serif", cursor: 'pointer', boxShadow: '0 4px 12px rgba(31,78,158,0.25)', transition: 'all 150ms ease' }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                Volver a intentar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PagoExitosoCatalogo;