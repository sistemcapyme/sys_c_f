import React, { useState, useEffect, useRef } from 'react';
import catalogosService from '../services/catalogosService';
import BotonPagoMercadoPago from '../components/common/BotonPagoMercadoPago';
import Layout from '../components/common/Layout';
import { BookOpen, FileText, ChevronRight, Download, CheckCircle, X, AlertCircle } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const CatalogosPublicos = () => {
  const [pdfs, setPdfs] = useState([]);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [loading, setLoading] = useState(true);

  // Estados para cuando retorna de pago exitoso (sin salir de la página)
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
      console.error('Error al obtener los catálogos públicos:', error);
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

  if (loading) {
    return (
      <Layout>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '320px', flexDirection: 'column', gap: '16px' }}>
          <div style={{ width: '40px', height: '40px', border: '3px solid var(--gray-200)', borderTopColor: 'var(--capyme-blue-mid)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          <style>{`@keyframes spin{to{transform:rotate(360deg);}}`}</style>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <style>{`
        @keyframes fadeInUp{from{opacity:0;transform:translateY(12px);}to{opacity:1;transform:translateY(0);}}
        @keyframes modalIn{from{opacity:0;transform:scale(0.96) translateY(8px);}to{opacity:1;transform:scale(1) translateY(0);}}
        @keyframes spin{to{transform:rotate(360deg);}}
        @keyframes bounce{0%,100%{transform:translateY(0);}50%{transform:translateY(-25%);}}
        .catalogo-card{animation:fadeInUp 0.3s ease both;transition:box-shadow 200ms,transform 200ms;}
        .catalogo-card:hover{box-shadow:0 8px 24px rgba(31,78,158,0.10);transform:translateY(-2px);}
        .catalogo-modal{animation:modalIn 0.25s ease both;}
      `}</style>

      <div style={{ padding: '0 0 40px', maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header (Mismo estilo que Cursos) */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '32px', flexWrap: 'wrap', gap: '16px', textAlign: 'center', width: '100%' }}>
          <div style={{ margin: '0 auto' }}>
            <h1 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--gray-900)', fontFamily: "'Plus Jakarta Sans', sans-serif", margin: '0 0 8px', letterSpacing: '-0.02em' }}>
              Catálogo de <span style={{ color: 'var(--capyme-blue-mid)' }}>PDFs</span>
            </h1>
            <p style={{ fontSize: '15px', color: 'var(--gray-500)', margin: '0 auto', fontFamily: "'DM Sans', sans-serif", maxWidth: '600px' }}>
              Adquiere material digital exclusivo y herramientas prácticas para tu negocio al instante.
            </p>
          </div>
        </div>

        {/* Modal/Alerta de Descarga Automática */}
        {descargaEstado && (
          <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '24px', marginBottom: '32px', boxShadow: '0 4px 12px rgba(15,42,90,0.06)', display: 'flex', alignItems: 'center', gap: '16px', animation: 'modalIn 0.3s ease' }}>
            {descargaEstado === 'procesando' && (
              <>
                <div style={{ width: '46px', height: '46px', background: 'var(--capyme-blue-pale)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                   <div style={{ width: '22px', height: '22px', border: '2px solid var(--capyme-blue-mid)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                </div>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--gray-900)', fontFamily: "'Plus Jakarta Sans', sans-serif", margin: '0 0 4px' }}>Validando pago...</h3>
                  <p style={{ fontSize: '13px', color: 'var(--gray-500)', margin: 0, fontFamily: "'DM Sans', sans-serif" }}>No cierres esta ventana, estamos preparando tu descarga.</p>
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
                  <p style={{ fontSize: '13px', color: 'var(--gray-600)', margin: 0, fontFamily: "'DM Sans', sans-serif", display: 'flex', alignItems: 'center', gap: '6px' }}>
                    Tu PDF se está descargando automáticamente. <Download style={{ width: '14px', height: '14px', color: 'var(--capyme-blue-mid)', animation: 'bounce 1s infinite' }} />
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
                  <p style={{ fontSize: '13px', color: '#DC2626', margin: 0, fontFamily: "'DM Sans', sans-serif" }}>{mensajeError}</p>
                </div>
                <button onClick={() => setDescargaEstado(null)} style={{ padding: '8px 16px', background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>Cerrar</button>
              </>
            )}
          </div>
        )}

        {pdfs.length === 0 ? (
          <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '60px 20px', textAlign: 'center', boxShadow: 'var(--shadow-sm)' }}>
            <BookOpen style={{ width: '40px', height: '40px', color: 'var(--gray-300)', margin: '0 auto 16px', display: 'block' }} />
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--gray-900)', margin: '0 0 6px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Próximamente nuevos catálogos</h3>
            <p style={{ fontSize: '14px', color: 'var(--gray-500)', fontFamily: "'DM Sans', sans-serif" }}>Aún no hay catálogos públicos disponibles. Vuelve más tarde.</p>
          </div>
        ) : (
          /* Grid Estilo Tarjetas (Similar a Cursos) */
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
            {pdfs.map((pdf, idx) => (
              <div key={pdf.id} className="catalogo-card" style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', animationDelay: `${idx * 40}ms`, display: 'flex', flexDirection: 'column' }}>
                <div style={{ height: '4px', background: 'linear-gradient(90deg, var(--capyme-blue-mid), var(--capyme-blue))' }} />
                
                <div style={{ padding: '24px', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ width: '42px', height: '42px', background: 'var(--capyme-blue-pale)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                    <FileText style={{ width: '20px', height: '20px', color: 'var(--capyme-blue-mid)' }} />
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--gray-900)', fontFamily: "'Plus Jakarta Sans', sans-serif", margin: '0 0 10px', lineHeight: 1.3 }}>
                    {pdf.titulo}
                  </h3>
                  <p style={{ fontSize: '13px', color: 'var(--gray-500)', margin: '0 0 20px', fontFamily: "'DM Sans', sans-serif", lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {pdf.descripcion}
                  </p>
                  <div style={{ marginTop: 'auto' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '4px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Inversión</span>
                    <span style={{ fontSize: '26px', fontWeight: 900, color: 'var(--capyme-blue-mid)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      {fmt(pdf.precio)}
                    </span>
                  </div>
                </div>

                <div style={{ padding: '16px 24px', background: 'var(--gray-50)', borderTop: '1px solid var(--gray-100)' }}>
                  <button 
                    onClick={() => setSelectedPdf(pdf)} 
                    style={{ width: '100%', padding: '10px 16px', background: '#fff', border: '1px solid var(--capyme-blue-mid)', color: 'var(--capyme-blue-mid)', borderRadius: 'var(--radius-md)', fontSize: '14px', fontWeight: 700, fontFamily: "'DM Sans', sans-serif", cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 150ms' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--capyme-blue-mid)'; e.currentTarget.style.color = '#fff'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = 'var(--capyme-blue-mid)'; }}
                  >
                    Ver Detalles <ChevronRight style={{ width: '16px', height: '16px' }} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal de Detalles y Pago (Estilo Similar a Cursos) */}
        {selectedPdf && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1200, padding: '20px' }}>
            <div className="catalogo-modal" onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 'var(--radius-lg)', width: '100%', maxWidth: '480px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', boxShadow: '0 24px 64px rgba(0,0,0,0.22)', overflow: 'hidden' }}>
              
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
                <div style={{ background: 'var(--capyme-blue-pale)', padding: '16px', borderRadius: 'var(--radius-md)', marginBottom: '24px' }}>
                  <h4 style={{ fontSize: '11px', fontWeight: 800, color: 'var(--capyme-blue-mid)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    Acerca de este material
                  </h4>
                  <p style={{ fontSize: '13px', color: 'var(--gray-700)', fontFamily: "'DM Sans', sans-serif", lineHeight: 1.6, whiteSpace: 'pre-wrap', margin: 0 }}>
                    {selectedPdf.descripcion}
                  </p>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px', padding: '16px', background: 'var(--gray-50)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                  <div>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '2px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      Total a pagar
                    </span>
                    <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '32px', fontWeight: 900, color: 'var(--capyme-blue-mid)', lineHeight: 1 }}>
                      {fmt(selectedPdf.precio)}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {/* Este botón ya viene del componente BotonPagoMercadoPago que no te pedirá login si el endpoint está bien configurado */}
                  <BotonPagoMercadoPago 
                    idArticulo={selectedPdf.id} 
                    titulo={selectedPdf.titulo} 
                    precio={selectedPdf.precio} 
                  />
                  <button 
                    onClick={() => setSelectedPdf(null)} 
                    style={{ padding: '12px 18px', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', background: '#fff', color: 'var(--gray-700)', fontSize: '14px', fontWeight: 700, fontFamily: "'DM Sans', sans-serif", cursor: 'pointer', transition: 'all 150ms' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--gray-100)'} 
                    onMouseLeave={e => e.currentTarget.style.background = '#fff'}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CatalogosPublicos;