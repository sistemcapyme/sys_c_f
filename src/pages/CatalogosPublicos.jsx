import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { catalogosService } from '../services/catalogosService';
import BotonPagoPdf from '../components/common/BotonPagoPdf';
import { toast } from 'react-hot-toast';

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

  if (loading || procesandoDescarga) return <div className="flex justify-center items-center h-screen">Cargando...</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Catálogo de PDFs</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pdfs.map((pdf) => (
          <div key={pdf.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-2 truncate">{pdf.titulo}</h2>
              <p className="text-gray-600 line-clamp-3 mb-4">{pdf.descripcion}</p>
              <div className="flex justify-between items-center mt-4">
                <span className="text-2xl font-black text-blue-600">${pdf.precio}</span>
                <button
                  onClick={() => setPdfSeleccionado(pdf)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-semibold transition"
                >
                  Ver Detalles
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {pdfSeleccionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 relative">
            <button 
              onClick={() => setPdfSeleccionado(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 pr-6">{pdfSeleccionado.titulo}</h2>
            <div className="bg-gray-50 p-4 rounded-lg mb-6 max-h-60 overflow-y-auto">
              <p className="text-gray-700 whitespace-pre-wrap">{pdfSeleccionado.descripcion}</p>
            </div>
            <div className="border-t pt-4">
              <BotonPagoPdf 
                titulo={pdfSeleccionado.titulo} 
                precio={pdfSeleccionado.precio} 
                pdfId={pdfSeleccionado.id} 
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CatalogosPublicos;