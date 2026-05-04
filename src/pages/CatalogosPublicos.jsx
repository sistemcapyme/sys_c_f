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
      <div className="py-8 px-4 max-w-7xl mx-auto font-sans min-h-[80vh]">
        
        {/* Cabecera */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-display font-black text-[#0F2A5A] mb-4 tracking-tight">
            Catálogo de <span className="text-[#1F4E9E]">PDFs</span>
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto font-medium">
            Adquiere material digital exclusivo y herramientas prácticas para tu negocio al instante.
          </p>
        </div>

        {/* Estado de Carga */}
        {loading ? (
           <div className="flex flex-col items-center justify-center py-20 gap-4">
             <div className="w-10 h-10 border-4 border-[#EEF4FF] border-t-[#1F4E9E] rounded-full animate-spin"></div>
             <p className="text-gray-500 font-medium">Cargando catálogos disponibles...</p>
           </div>
        ) : pdfs.length > 0 ? (
          
          /* Grid de Tarjetas */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pdfs.map((pdf) => (
              <div key={pdf.id} className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 flex flex-col justify-between group overflow-hidden">
                <div className="p-6 md:p-8 flex-grow">
                  <div className="w-12 h-12 bg-[#EEF4FF] text-[#1F4E9E] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <FileText size={24} />
                  </div>
                  <h3 className="text-xl font-display font-bold text-[#0F2A5A] mb-3 line-clamp-2 leading-tight">
                    {pdf.titulo}
                  </h3>
                  <p className="text-gray-500 mb-6 line-clamp-3 text-sm leading-relaxed">
                    {pdf.descripcion}
                  </p>
                  <div className="mt-auto">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Inversión</span>
                    <div className="text-3xl font-display font-black text-[#1F4E9E]">
                      ${Number(pdf.precio).toFixed(2)}
                    </div>
                  </div>
                </div>
                <div className="p-4 md:p-6 bg-gray-50/80 border-t border-gray-50">
                  <button 
                    onClick={() => setSelectedPdf(pdf)} 
                    className="w-full flex items-center justify-center gap-2 bg-white text-[#1F4E9E] border border-[#1F4E9E]/20 font-bold py-3 px-4 rounded-xl hover:bg-[#1F4E9E] hover:text-white transition-all shadow-sm"
                  >
                    Ver Detalles <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          
          /* Estado Vacío */
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100 max-w-3xl mx-auto">
            <BookOpen size={48} className="mx-auto text-[#EEF4FF] mb-4" />
            <h3 className="text-xl font-display font-bold text-[#0F2A5A] mb-2">Próximamente nuevos catálogos</h3>
            <p className="text-gray-500">Aún no hay catálogos públicos disponibles. Vuelve más tarde.</p>
          </div>
        )}

        {/* Modal de Detalles y Pago */}
        {selectedPdf && (
          <div className="fixed inset-0 bg-[#0F2A5A]/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 transition-opacity">
            <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
              
              <div className="p-6 md:p-8 overflow-y-auto">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-14 h-14 bg-[#EEF4FF] text-[#1F4E9E] rounded-2xl flex items-center justify-center flex-shrink-0">
                    <FileText size={28} />
                  </div>
                  <h2 className="text-2xl font-display font-extrabold text-[#0F2A5A] leading-tight pt-1">
                    {selectedPdf.titulo}
                  </h2>
                </div>
                
                <div className="bg-[#EEF4FF]/50 p-5 rounded-2xl mb-8 border border-[#EEF4FF]">
                  <h4 className="text-xs font-bold text-[#1F4E9E] uppercase tracking-wider mb-2">Acerca de este material</h4>
                  <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                    {selectedPdf.descripcion}
                  </p>
                </div>
                
                <div className="flex justify-between items-end mb-8 p-5 bg-gray-50 rounded-2xl border border-gray-100">
                  <div>
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Total a pagar</span>
                    <span className="text-4xl font-display font-black text-[#1F4E9E]">
                      ${Number(selectedPdf.precio).toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <BotonPagoMercadoPago 
                    idArticulo={selectedPdf.id} 
                    titulo={selectedPdf.titulo} 
                    precio={selectedPdf.precio} 
                  />
                  <button 
                    onClick={() => setSelectedPdf(null)} 
                    className="w-full bg-white text-gray-500 border border-gray-200 font-bold py-3.5 px-4 rounded-xl hover:bg-gray-50 hover:text-gray-700 transition-colors"
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