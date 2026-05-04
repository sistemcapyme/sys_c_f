import React, { useState, useEffect } from 'react';
import catalogosService from '../../services/catalogosService';
import { Plus, Edit2, Trash2, X, ExternalLink, FileText } from 'lucide-react';

const CatalogosAdmin = () => {
  const [pdfs, setPdfs] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ 
    id: null, 
    titulo: '', 
    descripcion: '', 
    precio: '', 
    linkDrive: '',
    activo: true 
  });

  const fetchPdfs = async () => {
    try {
      const data = await catalogosService.obtenerTodosAdmin();
      setPdfs(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchPdfs();
  }, []);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.id) {
        await catalogosService.actualizarPdf(formData.id, formData);
      } else {
        await catalogosService.crearPdf(formData);
      }
      cerrarModal();
      fetchPdfs();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (pdf) => {
    setFormData(pdf);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if(window.confirm('¿Estás seguro de que deseas desactivar este catálogo?')) {
      try {
        await catalogosService.eliminarPdf(id);
        fetchPdfs();
      } catch (error) {
        console.error(error);
      }
    }
  };

  const cerrarModal = () => {
    setModalOpen(false);
    setFormData({ id: null, titulo: '', descripcion: '', precio: '', linkDrive: '', activo: true });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto min-h-screen bg-gray-50/30">
      
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-100 text-blue-700 rounded-lg">
            <FileText size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Gestión de Catálogos</h1>
            <p className="text-sm text-gray-500 mt-1">Administra los archivos PDF públicos, precios y disponibilidad.</p>
          </div>
        </div>
        <button 
          onClick={() => setModalOpen(true)} 
          className="flex items-center gap-2 bg-blue-700 text-white px-5 py-2.5 rounded-lg hover:bg-blue-800 transition-all font-medium shadow-sm hover:shadow-md active:scale-95"
        >
          <Plus size={18} />
          <span>Agregar PDF</span>
        </button>
      </div>

      {/* Tabla de Datos */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50/80">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Título</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Precio</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Enlace</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Estado</th>
                <th scope="col" className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {pdfs.length > 0 ? (
                pdfs.map((pdf) => (
                  <tr key={pdf.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-gray-900">{pdf.titulo}</div>
                      <div className="text-sm text-gray-500 line-clamp-1 mt-0.5 max-w-xs">{pdf.descripcion}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-black text-blue-700">${pdf.precio}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <a href={pdf.linkDrive} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 flex items-center gap-1.5 text-sm font-medium transition-colors">
                        Drive <ExternalLink size={14} />
                      </a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${pdf.activo ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'}`}>
                        {pdf.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleEdit(pdf)} className="text-gray-500 hover:text-blue-700 transition-colors bg-gray-50 hover:bg-blue-50 p-2 rounded-lg border border-transparent hover:border-blue-200" title="Editar">
                          <Edit2 size={18} />
                        </button>
                        <button onClick={() => handleDelete(pdf.id)} className="text-gray-500 hover:text-red-700 transition-colors bg-gray-50 hover:bg-red-50 p-2 rounded-lg border border-transparent hover:border-red-200" title="Desactivar">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <FileText size={48} className="mb-4 opacity-50" />
                      <p className="text-lg font-medium text-gray-600">No hay catálogos registrados</p>
                      <p className="text-sm mt-1">Haz clic en "Agregar PDF" para crear el primero.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Crear/Editar */}
      {modalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                {formData.id ? <Edit2 size={20} className="text-blue-600" /> : <Plus size={20} className="text-blue-600" />}
                {formData.id ? 'Editar Catálogo PDF' : 'Agregar Nuevo PDF'}
              </h2>
              <button onClick={cerrarModal} className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Título del PDF</label>
                  <input 
                    type="text" 
                    name="titulo" 
                    value={formData.titulo} 
                    onChange={handleChange} 
                    className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all text-sm text-gray-800" 
                    placeholder="Ej. Curso de Emprendimiento"
                    required 
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Descripción</label>
                  <textarea 
                    name="descripcion" 
                    value={formData.descripcion} 
                    onChange={handleChange} 
                    rows="3"
                    className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all text-sm resize-none text-gray-800" 
                    placeholder="Detalles sobre el contenido del PDF..."
                    required 
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Precio (MXN)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">$</span>
                    <input 
                      type="number" 
                      step="0.01" 
                      name="precio" 
                      value={formData.precio} 
                      onChange={handleChange} 
                      className="w-full border border-gray-300 pl-8 pr-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all text-sm text-gray-800 font-medium" 
                      placeholder="0.00"
                      required 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Enlace de Google Drive</label>
                  <input 
                    type="url" 
                    name="linkDrive" 
                    value={formData.linkDrive} 
                    onChange={handleChange} 
                    className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all text-sm text-blue-600" 
                    placeholder="https://drive.google.com/..."
                    required 
                  />
                </div>

                {formData.id && (
                  <div className="flex items-center gap-3 mt-2 p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <input 
                      type="checkbox" 
                      id="activo" 
                      name="activo" 
                      checked={formData.activo} 
                      onChange={handleChange}
                      className="w-4 h-4 text-blue-700 border-gray-300 rounded focus:ring-blue-600 cursor-pointer"
                    />
                    <label htmlFor="activo" className="text-sm font-bold text-gray-700 cursor-pointer select-none">
                      Hacer este catálogo visible al público
                    </label>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 mt-8 pt-5 border-t border-gray-100">
                <button 
                  type="button" 
                  onClick={cerrarModal} 
                  className="px-5 py-2.5 text-sm font-bold text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2.5 text-sm font-bold text-white bg-blue-700 rounded-lg hover:bg-blue-800 shadow-sm hover:shadow transition-all"
                >
                  {formData.id ? 'Guardar Cambios' : 'Crear Catálogo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CatalogosAdmin;