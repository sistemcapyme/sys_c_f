import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import catalogosService from '../services/catalogosService';
import BotonPagoMercadoPago from '../components/common/BotonPagoMercadoPago';
import { BookOpen, FileText, ChevronRight, Download, CheckCircle, X, AlertCircle } from 'lucide-react';
import LogoCapyme from '../assets/LogoCapyme.png'; 

const CatalogosPublicos = () => {
  const [pdfs, setPdfs] = useState([]);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hoveredRow, setHoveredRow] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();
  const [descargaEstado, setDescargaEstado] = useState(null); // 'procesando' | 'completado' | 'error'
  const [mensajeError, setMensajeError] = useState('');
  const descargaIniciada = useRef(false);

  useEffect(() => {
    cargarPublicos();
    verificarRetornoPago();
  }, [location]);

  const cargarPublicos = async () => {
    try {
      setLoading(true);
      const data = await catalogosService.obtenerPublicos();
      setPdfs(data);
    } catch (error) {
      console.error('Error al obtener los catálogos:', error);
    } finally {
      setLoading(false);
    }
  };

  const verificarRetornoPago = () => {
    const params = new URLSearchParams(location.search);
    const payment_id = params.get('payment_id');
    const external_reference = params.get('external_reference');

    if (payment_id && external_reference && !descargaIniciada.current) {
      descargaIniciada.current = true;
      setDescargaEstado('procesando');
      procesarDescarga(external_reference, payment_id);
    }
  };

  const extraerIdDrive = (url) => {
    const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
    if (match && match[1]) return match[1];
    const urlParams = new URL(url);
    return urlParams.searchParams.get('id');
  };

  const procesarDescarga = async (external_reference, payment_id) => {
    try {
      const data = await catalogosService.descargarPdf(external_reference, payment_id);
      
      if (data && data.linkDrive) {
        setDescargaEstado('completado');
        const fileId = extraerIdDrive(data.linkDrive);
        let linkDescarga = data.linkDrive;
        if (fileId) linkDescarga = `https://drive.google.com/uc?export=download&id=${fileId}`;

        // Forzar descarga oculta
        const linkElement = document.createElement('a');
        linkElement.href = linkDescarga;
        linkElement.setAttribute('download', `${data.titulo || 'Catalogo_CAPYME'}.pdf`); 
        linkElement.style.display = 'none';
        document.body.appendChild(linkElement);
        linkElement.click();
        document.body.removeChild(linkElement);

        setTimeout(() => {
          setDescargaEstado(null);
          navigate('/catalogos', { replace: true });
          descargaIniciada.current = false;
        }, 6000);
      } else {
        throw new Error('No se recibió el enlace de descarga');
      }
    } catch (err) {
      console.error(err);
      setDescargaEstado('error');
      setMensajeError('No se pudo procesar la descarga. Verifica tu pago o contacta a soporte.');
    }
  };

  const fmt = (a) => a != null ? new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(a) : null;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--gray-50)', fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @keyframes fadeInUp{from{opacity:0;transform:translateY(12px);}to{opacity:1;transform:translateY(0);}}
        @keyframes modalIn{from{opacity:0;transform:scale(0.96) translateY(8px);}to{opacity:1;transform:scale(1) translateY(0);}}
        @keyframes spin{to{transform:rotate(360deg);}}
        @keyframes bounce{0%,100%{transform:translateY(0);}50%{transform:translateY(-25%);}}
        .catalogo-card{animation:fadeInUp 0.3s ease both;transition:box-shadow 200ms,transform 200ms;}
        .catalogo-card:hover{box-shadow:0 8px 24px rgba(31,78,158,0.10);transform:translateY(-4px);}
        .catalogo-modal{animation:modalIn 0.25s ease both;}
      `}</style>

      {/* Navbar Público Minimalista */}
      <header style={{ background: '#fff', borderBottom: '1px solid var(--border)', padding: '16px 24px', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <img src={LogoCapyme} alt="CAPYME" style={{ height: '36px', objectFit: 'contain' }} />
          <button onClick={() => navigate('/login')} style={{ padding: '8px 16px', background: 'transparent', border: '1px solid var(--capyme-blue-mid)', color: 'var(--capyme-blue-mid)', borderRadius: 'var(--radius-md)', fontWeight: 700, cursor: 'pointer', transition: 'all 150ms' }} onMouseEnter={e => {e.currentTarget.style.background = 'var(--capyme-blue-pale)'}} onMouseLeave={e => {e.currentTarget.style.background = 'transparent'}}>
            Iniciar Sesión
          </button>
        </div>
      </header>

      <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Cabecera Principal */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '38px', fontWeight: 900, color: 'var(--gray-900)', letterSpacing: '-0.02em', marginBottom: '12px' }}>
            Catálogo de <span style={{ color: 'var(--capyme-blue-mid)' }}>PDFs Exclusivos</span>
          </h1>
          <p style={{ fontSize: '16px', color: 'var(--gray-500)', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
            Adquiere material digital y herramientas prácticas para potenciar tu negocio al instante. Sin necesidad de registrarte.
          </p>
        </div>

        {/* Alerta de Retorno de Pago */}
        {descargaEstado && (
          <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '24px', marginBottom: '32px', boxShadow: '0 4px 12px rgba(15,42,90,0.06)', display: 'flex', alignItems: 'center', gap: '16px', animation: 'modalIn 0.3s ease' }}>
            {descargaEstado === 'procesando' && (
              <>
                <div style={{ width: '46px', height: '46px', background: 'var(--capyme-blue-pale)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                   <div style={{ width: '22px', height: '22px', border: '2px solid var(--capyme-blue-mid)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                </div>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--gray-900)', fontFamily: "'Plus Jakarta Sans', sans-serif", margin: '0 0 4px' }}>Verificando pago seguro...</h3>
                  <p style={{ fontSize: '13px', color: 'var(--gray-500)', margin: 0 }}>No cierres esta ventana, tu descarga iniciará en breve.</p>
                </div>
              </>
            )}
            {descargaEstado === 'completado' && (
              <>
                <div style={{ width: '46px', height: '46px', background: '#ECFDF5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                   <CheckCircle style={{ width: '24px', height: '24px', color: '#10B981' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#065F46', fontFamily: "'Plus Jakarta Sans', sans-serif", margin: '0 0 4px' }}>¡Pago Exitoso!</h3>
                  <p style={{ fontSize: '13px', color: 'var(--gray-600)', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    Tu PDF se está descargando automáticamente <Download style={{ width: '14px', height: '14px', color: 'var(--capyme-blue-mid)', animation: 'bounce 1s infinite' }} />
                  </p>
                </div>
              </>
            )}
            {descargaEstado === 'error' && (
              <>
                <div style={{ width: '46px', height: '46px', background: '#FEF2F2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                   <AlertCircle style={{ width: '24px', height: '24px', color: '#EF4444' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#B91C1C', fontFamily: "'Plus Jakarta Sans', sans-serif", margin: '0 0 4px' }}>Algo salió mal</h3>
                  <p style={{ fontSize: '13px', color: '#DC2626', margin: 0 }}>{mensajeError}</p>
                </div>
                <button onClick={() => setDescargaEstado(null)} style={{ padding: '8px 16px', background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontWeight: 600 }}>Cerrar</button>
              </>
            )}
          </div>
        )}

        {/* Estado de Carga / Grid de Tarjetas */}
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 0', gap: '16px' }}>
            <div style={{ width: '40px', height: '40px', border: '3px solid var(--gray-200)', borderTopColor: 'var(--capyme-blue-mid)', borderRadius: '50%', animation: 'spin 700ms linear infinite' }}></div>
            <p style={{ fontSize: '14px', color: 'var(--gray-500)', fontWeight: 500 }}>Cargando catálogos disponibles...</p>
          </div>
        ) : pdfs.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
            {pdfs.map((pdf, idx) => (
              <div 
                key={pdf.id} 
                className="catalogo-card" 
                style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', display: 'flex', flexDirection: 'column', animationDelay: `${idx * 40}ms` }}
              >
                <div style={{ height: '4px', background: 'linear-gradient(90deg, var(--capyme-blue-mid), var(--capyme-blue))' }} />
                <div style={{ padding: '24px', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ width: '48px', height: '48px', background: 'var(--capyme-blue-pale)', color: 'var(--capyme-blue-mid)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                    <FileText style={{ width: '24px', height: '24px' }} />
                  </div>
                  <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '18px', fontWeight: 800, color: 'var(--gray-900)', marginBottom: '10px', lineHeight: 1.3 }}>
                    {pdf.titulo}
                  </h3>
                  <p style={{ fontSize: '14px', color: 'var(--gray-500)', lineHeight: 1.6, marginBottom: '24px', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {pdf.descripcion}
                  </p>
                  <div style={{ marginTop: 'auto' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '4px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Pago Único</span>
                    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '26px', fontWeight: 900, color: 'var(--capyme-blue-mid)' }}>
                      {fmt(pdf.precio)}
                    </div>
                  </div>
                </div>
                <div style={{ padding: '16px 24px', background: 'var(--gray-50)', borderTop: '1px solid var(--border)' }}>
                  <button 
                    onClick={() => setSelectedPdf(pdf)} 
                    onMouseEnter={e => { e.currentTarget.style.background = 'linear-gradient(135deg, var(--capyme-blue-mid), var(--capyme-blue))'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.border='1px solid transparent'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = 'var(--gray-900)'; e.currentTarget.style.border='1px solid var(--border)'; }}
                    style={{ width: '100%', padding: '12px', background: '#fff', border: '1px solid var(--border)', color: 'var(--gray-900)', borderRadius: 'var(--radius-md)', fontSize: '14px', fontWeight: 700, fontFamily: "'Plus Jakarta Sans', sans-serif", cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 200ms ease' }}
                  >
                    Adquirir Ahora <ChevronRight style={{ width: '18px', height: '18px' }} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '60px 20px', background: '#fff', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)', maxWidth: '600px', margin: '0 auto' }}>
            <BookOpen style={{ width: '48px', height: '48px', color: 'var(--gray-300)', margin: '0 auto 16px', display: 'block' }} />
            <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '20px', fontWeight: 800, color: 'var(--gray-900)', marginBottom: '8px' }}>Próximamente nuevos catálogos</h3>
            <p style={{ fontSize: '14px', color: 'var(--gray-500)' }}>Aún no hay catálogos públicos disponibles. Vuelve más tarde.</p>
          </div>
        )}

        {/* Modal de Detalles y Pago */}
        {selectedPdf && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,42,90,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1200, padding: '20px' }}>
            <div className="catalogo-modal" onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 'var(--radius-lg)', width: '100%', maxWidth: '500px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', overflow: 'hidden' }}>
              
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '24px', background: 'var(--gray-50)', borderBottom: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <div style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg, var(--capyme-blue-mid), var(--capyme-blue))', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 4px 12px rgba(31,78,158,0.25)' }}>
                    <FileText style={{ width: '24px', height: '24px', color: '#fff' }} />
                  </div>
                  <div>
                    <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--gray-900)', fontFamily: "'Plus Jakarta Sans', sans-serif", margin: '0 0 4px', lineHeight: 1.2 }}>
                      {selectedPdf.titulo}
                    </h2>
                  </div>
                </div>
                <button onClick={() => setSelectedPdf(null)} style={{ width: '32px', height: '32px', border: 'none', borderRadius: 'var(--radius-sm)', background: 'transparent', cursor: 'pointer', color: 'var(--gray-400)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--gray-200)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <X style={{ width: '18px', height: '18px' }} />
                </button>
              </div>
              
              <div style={{ overflowY: 'auto', flex: 1, padding: '24px' }}>
                <div style={{ background: 'var(--capyme-blue-pale)', padding: '16px', borderRadius: 'var(--radius-md)', marginBottom: '24px', border: '1px solid rgba(43,91,166,0.1)' }}>
                  <h4 style={{ fontSize: '11px', fontWeight: 800, color: 'var(--capyme-blue-mid)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    Resumen del contenido
                  </h4>
                  <p style={{ fontSize: '14px', color: 'var(--gray-700)', lineHeight: 1.6, whiteSpace: 'pre-wrap', margin: 0 }}>
                    {selectedPdf.descripcion}
                  </p>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px', padding: '16px', background: '#fff', borderRadius: 'var(--radius-md)', border: '1px solid var(--capyme-blue-mid)', boxShadow: '0 2px 8px rgba(31,78,158,0.08)' }}>
                  <div>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '4px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      Total a pagar
                    </span>
                    <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '32px', fontWeight: 900, color: 'var(--gray-900)', lineHeight: 1 }}>
                      {fmt(selectedPdf.precio)}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <BotonPagoMercadoPago 
                    idArticulo={selectedPdf.id} 
                    titulo={selectedPdf.titulo} 
                    precio={selectedPdf.precio} 
                  />
                  <button 
                    onClick={() => setSelectedPdf(null)} 
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--gray-100)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#fff'; }}
                    style={{ width: '100%', padding: '14px', background: '#fff', border: '1px solid var(--border)', color: 'var(--gray-600)', borderRadius: 'var(--radius-md)', fontSize: '14px', fontWeight: 700, cursor: 'pointer', transition: 'all 150ms ease' }}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CatalogosPublicos;