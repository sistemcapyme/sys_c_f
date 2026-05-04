import React, { useState, useEffect } from 'react';
import catalogosService from '../services/catalogosService';
import BotonPagoMercadoPago from '../components/common/BotonPagoMercadoPago';
import Layout from '../components/common/Layout';
import { BookOpen, FileText, ChevronRight } from 'lucide-react';

const CatalogosPublicos = () => {
  const [pdfs, setPdfs] = useState([]);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPublicos = async () => {
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
    fetchPublicos();
  }, []);

  return (
    <Layout>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes modalIn { from { opacity:0; transform:scale(0.96) translateY(8px); } to { opacity:1; transform:scale(1) translateY(0); } }
      `}</style>

      <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto', minHeight: '80vh' }}>
        
        
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '38px', fontWeight: 900, color: 'var(--capyme-dark)', letterSpacing: '-0.02em', marginBottom: '12px' }}>
            Catálogo de <span style={{ color: 'var(--capyme-blue-mid)' }}>PDFs</span>
          </h1>
          <p style={{ fontSize: '16px', color: 'var(--gray-500)', fontFamily: "'DM Sans', sans-serif", maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
            Adquiere material digital exclusivo y herramientas prácticas para tu negocio al instante.
          </p>
        </div>

        
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 0', gap: '16px' }}>
            <div style={{ width: '40px', height: '40px', border: '4px solid var(--capyme-blue-pale)', borderTopColor: 'var(--capyme-blue-mid)', borderRadius: '50%', animation: 'spin 700ms linear infinite' }}></div>
            <p style={{ fontSize: '14px', color: 'var(--gray-500)', fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}>Cargando catálogos disponibles...</p>
          </div>
        ) : pdfs.length > 0 ? (
          
          /* Grid de Tarjetas */
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '32px' }}>
            {pdfs.map((pdf) => (
              <div 
                key={pdf.id} 
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 12px 24px rgba(15,42,90,0.1)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(15,42,90,0.06)'; }}
                style={{ background: '#fff', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)', boxShadow: '0 4px 12px rgba(15,42,90,0.06)', overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'all 250ms ease' }}
              >
                <div style={{ padding: '28px', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ width: '52px', height: '52px', background: 'var(--capyme-blue-pale)', color: 'var(--capyme-blue-mid)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                    <FileText style="{{" width: '26px', height: '26px' }}/>
                  </div>
                  <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '20px', fontWeight: 800, color: 'var(--capyme-dark)', marginBottom: '12px', lineHeight: 1.3 }}>
                    {pdf.titulo}
                  </h3>
                  <p style={{ fontSize: '14px', color: 'var(--gray-500)', fontFamily: "'DM Sans', sans-serif", lineHeight: 1.6, marginBottom: '24px', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {pdf.descripcion}
                  </p>
                  <div style={{ marginTop: 'auto' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px', display: 'block', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      Inversión
                    </span>
                    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '28px', fontWeight: 900, color: 'var(--capyme-blue-mid)' }}>
                      ${Number(pdf.precio).toFixed(2)}
                    </div>
                  </div>
                </div>
                <div style={{ padding: '20px 24px', background: 'var(--gray-50)', borderTop: '1px solid var(--border)' }}>
                  <button 
                    onClick={() => setSelectedPdf(pdf)} 
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--capyme-blue-mid)'; e.currentTarget.style.color = '#fff'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = 'var(--capyme-blue-mid)'; }}
                    style={{ width: '100%', padding: '14px', background: '#fff', border: '1px solid var(--capyme-blue-mid)', color: 'var(--capyme-blue-mid)', borderRadius: 'var(--radius-md)', fontSize: '14px', fontWeight: 700, fontFamily: "'DM Sans', sans-serif", cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 200ms ease' }}
                  >
                    Ver Detalles <ChevronRight style="{{" width: '18px', height: '18px' }}/>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          
          /* Estado Vacío */
          <div style={{ textAlign: 'center', padding: '60px 20px', background: '#fff', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)', maxWidth: '600px', margin: '0 auto' }}>
            <BookOpen style="{{" width: '48px', height: color: 'var(--gray-300)', margin: '0 auto 16px' }}/>
            <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '20px', fontWeight: 800, color: 'var(--capyme-dark)', marginBottom: '8px' }}>
              Próximamente nuevos catálogos
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--gray-500)', fontFamily: "'DM Sans', sans-serif" }}>
              Aún no hay catálogos públicos disponibles. Vuelve más tarde.
            </p>
          </div>
        )}

        
        {selectedPdf && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,42,90,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
            <div style={{ background: '#fff', borderRadius: 'var(--radius-xl)', width: '100%', maxWidth: '520px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', overflow: 'hidden', animation: 'modalIn 0.25s ease both' }}>
              
              <div style={{ padding: '32px', overflowY: 'auto' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '24px' }}>
                  <div style={{ width: '56px', height: '56px', background: 'var(--capyme-blue-pale)', color: 'var(--capyme-blue-mid)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <FileText style="{{" width: '28px', height: '28px' }}/>
                  </div>
                  <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '24px', fontWeight: 800, color: 'var(--capyme-dark)', margin: 0, lineHeight: 1.2, paddingTop: '4px' }}>
                    {selectedPdf.titulo}
                  </h2>
                </div>
                
                <div style={{ background: 'var(--capyme-blue-pale)', padding: '20px', borderRadius: 'var(--radius-md)', marginBottom: '32px', border: '1px solid rgba(43,91,166,0.1)' }}>
                  <h4 style={{ fontSize: '11px', fontWeight: 800, color: 'var(--capyme-blue-mid)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    Acerca de este material
                  </h4>
                  <p style={{ fontSize: '14px', color: 'var(--gray-700)', fontFamily: "'DM Sans', sans-serif", lineHeight: 1.6, whiteSpace: 'pre-wrap', margin: 0 }}>
                    {selectedPdf.descripcion}
                  </p>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px', padding: '20px', background: 'var(--gray-50)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                  <div>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '4px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      Total a pagar
                    </span>
                    <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '36px', fontWeight: 900, color: 'var(--capyme-blue-mid)' }}>
                      ${Number(selectedPdf.precio).toFixed(2)}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <BotonPagoMercadoPago idArticulo="{selectedPdf.id}" titulo="{selectedPdf.titulo}" precio="{selectedPdf.precio}"/>
                  <button 
                    onClick={() => setSelectedPdf(null)} 
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--gray-100)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#fff'; }}
                    style={{ width: '100%', padding: '14px', background: '#fff', border: '1px solid var(--border)', color: 'var(--gray-600)', borderRadius: 'var(--radius-md)', fontSize: '14px', fontWeight: 700, fontFamily: "'DM Sans', sans-serif", cursor: 'pointer', transition: 'all 150ms ease' }}
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