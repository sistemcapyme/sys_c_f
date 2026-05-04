import React, { useState, useEffect } from 'react';
import catalogosService from '../services/catalogosService';
import BotonPagoMercadoPago from '../components/common/BotonPagoMercadoPago';

const CatalogosPublicos = () => {
  const [pdfs, setPdfs] = useState([]);
  const [selectedPdf, setSelectedPdf] = useState(null);

  useEffect(() => {
    const fetchPublicos = async () => {
      try {
        const data = await catalogosService.obtenerPublicos();
        setPdfs(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchPublicos();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-7xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-extrabold text-blue-900 mb-4">Catálogo de PDFs</h1>
        <p className="text-lg text-gray-600">Adquiere material digital exclusivo al instante.</p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {pdfs.map((pdf) => (
          <div key={pdf.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-100 flex flex-col justify-between">
            <div className="p-6 flex-grow">
              <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">{pdf.titulo}</h3>
              <p className="text-gray-500 mb-4 line-clamp-3">{pdf.descripcion}</p>
              <div className="text-2xl font-black text-blue-700">${pdf.precio}</div>
            </div>
            <div className="p-6 bg-gray-50 border-t border-gray-100">
              <button onClick={() => setSelectedPdf(pdf)} className="w-full bg-blue-700 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-800 transition-colors">
                Ver Detalles
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedPdf && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="p-8">
              <h2 className="text-2xl font-extrabold text-gray-900 mb-4">{selectedPdf.titulo}</h2>
              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">{selectedPdf.descripcion}</p>
              </div>
              <div className="flex justify-between items-center mb-8">
                <span className="text-gray-500 font-medium">Inversión:</span>
                <span className="text-3xl font-black text-blue-800">${selectedPdf.precio}</span>
              </div>
              <div className="flex flex-col gap-3">
                <BotonPagoMercadoPago idArticulo={selectedPdf.id} titulo={selectedPdf.titulo} precio={selectedPdf.precio} />
                <button onClick={() => setSelectedPdf(null)} className="w-full bg-white text-gray-600 border border-gray-300 font-bold py-3 px-4 rounded-lg hover:bg-gray-100 transition-colors">
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CatalogosPublicos;