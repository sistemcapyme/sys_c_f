import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { catalogosService } from '../services/catalogosService';
import BotonPagoPdf from '../components/common/BotonPagoPdf';
import { toast } from 'react-hot-toast';
import { FileText, X } from 'lucide-react';

const CatalogosPublicos = () => {
  const [pdfs, setPdfs] = useState([]);
  const [pdfSeleccionado, setPdfSeleccionado] = useState(null);
  const [loading, setLoading] = useState(true);
  const [procesandoDescarga, setProcesandoDescarga] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    cargarPdfs();
    verificarDescarga();
  }, [location]);

  const cargarPdfs = async () => {
    try {
      const data = await catalogosService.obtenerPublicos();
      setPdfs(data);
    } catch (error) {
      toast.error('Error al cargar el catálogo');
    } finally {
      setLoading(false);
    }
  };

  const verificarDescarga = async () => {
    const searchParams = new URLSearchParams(location.search);
    const descargarId = searchParams.get('descargar');
    const paymentId = searchParams.get('payment_id');
    const status = searchParams.get('status');

    if (descargarId && paymentId && status === 'approved') {
      setProcesandoDescarga(true);
      toast.loading('Verificando pago y preparando descarga...', { id: 'descarga' });
      try {
        const data = await catalogosService.descargarPdf(descargarId, paymentId);
        toast.success('¡Descarga iniciada!', { id: 'descarga' });
        window.open(data.linkDrive, '_blank');
        navigate('/catalogos', { replace: true });
      } catch (error) {
        toast.error('No se pudo validar la descarga o el pago', { id: 'descarga' });
        navigate('/catalogos', { replace: true });
      } finally {
        setProcesandoDescarga(false);
      }
    }
  };

  if (loading || procesandoDescarga) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--bg-body)' }}>
        <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600, color: 'var(--gray-600)' }}>Cargando catálogo...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '2.5rem', fontWeight: 800, color: 'var(--gray-900)', marginBottom: '10px' }}>
          Catálogo de PDFs
        </h1>
        <p style={{ color: 'var(--gray-500)', fontSize: '1.1rem' }}>Adquiere material digital exclusivo al instante.</p>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
        {pdfs.map((pdf) => (
          <div key={pdf.id} style={{
            background: 'var(--surface)', borderRadius: 'var(--radius-xl)', padding: '24px',
            border: '1px solid var(--border)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
            display: 'flex', flexDirection: 'column', transition: 'transform 0.2s, box-shadow 0.2s',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.05)'; }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ background: 'var(--capyme-blue-pale)', padding: '12px', borderRadius: 'var(--radius-lg)', color: 'var(--capyme-blue)' }}>
                <FileText size={24} />
              </div>
              <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '1.1rem', fontWeight: 700, color: 'var(--gray-800)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                {pdf.titulo}
              </h2>
            </div>
            
            <p style={{ color: 'var(--gray-500)', fontSize: '0.95rem', lineHeight: 1.5, flexGrow: 1, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', marginBottom: '24px' }}>
              {pdf.descripcion}
            </p>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid var(--gray-100)' }}>
              <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--capyme-blue)' }}>
                ${pdf.precio} <span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--gray-400)' }}>MXN</span>
              </span>
              <button
                onClick={() => setPdfSeleccionado(pdf)}
                style={{
                  padding: '8px 16px', background: 'var(--gray-100)', color: 'var(--gray-700)',
                  border: 'none', borderRadius: 'var(--radius-md)', fontWeight: 600, cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--gray-200)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'var(--gray-100)'}
              >
                Detalles
              </button>
            </div>
          </div>
        ))}
      </div>

      {pdfSeleccionado && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '20px'
        }}>
          <div style={{
            background: 'var(--surface)', borderRadius: 'var(--radius-xl)', width: '100%', maxWidth: '500px',
            position: 'relative', display: 'flex', flexDirection: 'column', maxHeight: '90vh', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }}>
            <button 
              onClick={() => setPdfSeleccionado(null)}
              style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray-400)', padding: '4px' }}
            >
              <X size={24} />
            </button>
            
            <div style={{ padding: '32px 32px 0 32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                <div style={{ background: 'var(--capyme-blue-pale)', padding: '16px', borderRadius: 'var(--radius-lg)', color: 'var(--capyme-blue)' }}>
                  <FileText size={32} />
                </div>
                <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '1.5rem', fontWeight: 800, color: 'var(--gray-900)', margin: 0, paddingRight: '20px' }}>
                  {pdfSeleccionado.titulo}
                </h2>
              </div>
            </div>

            <div style={{ padding: '0 32px 24px 32px', overflowY: 'auto', flexGrow: 1 }}>
              <h3 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700, color: 'var(--gray-400)', marginBottom: '8px' }}>Descripción del contenido</h3>
              <p style={{ color: 'var(--gray-600)', fontSize: '1rem', lineHeight: 1.6, whiteSpace: 'pre-wrap', background: 'var(--gray-50)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--gray-100)' }}>
                {pdfSeleccionado.descripcion}
              </p>
            </div>

            <div style={{ padding: '24px 32px', borderTop: '1px solid var(--border)', background: 'var(--gray-50)', borderBottomLeftRadius: 'var(--radius-xl)', borderBottomRightRadius: 'var(--radius-xl)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <span style={{ color: 'var(--gray-500)', fontWeight: 500 }}>Total a pagar</span>
                <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--capyme-blue)' }}>${pdfSeleccionado.precio} <span style={{ fontSize: '1rem', color: 'var(--gray-500)' }}>MXN</span></span>
              </div>
              <BotonPagoPdf 
                titulo={pdfSeleccionado.titulo} 
                precio={pdfSeleccionado.precio} 
                pdfId={pdfSeleccionado.id} 
              />
              <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--gray-400)', marginTop: '12px' }}>
                Al pagar, la descarga comenzará automáticamente.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CatalogosPublicos;