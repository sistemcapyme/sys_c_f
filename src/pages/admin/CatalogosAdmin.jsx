import { useState, useEffect } from 'react';
import { catalogosService } from '../../services/catalogosService';
import { toast } from 'react-hot-toast';

const CatalogosAdmin = () => {
  const [pdfs, setPdfs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ id: null, titulo: '', descripcion: '', precio: '', linkDrive: '' });

  useEffect(() => {
    cargarPdfs();
  }, []);

  const cargarPdfs = async () => {
    try {
      const data = await catalogosService.obtenerTodosAdmin();
      setPdfs(data);
    } catch (error) {
      toast.error('Error al cargar PDFs');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.id) {
        await catalogosService.actualizarPdf(formData.id, formData);
        toast.success('PDF actualizado');
      } else {
        await catalogosService.crearPdf(formData);
        toast.success('PDF creado');
      }
      setModalOpen(false);
      cargarPdfs();
    } catch (error) {
      toast.error('Error al guardar');
    }
  };

  const handleEliminar = async (id) => {
    if (window.confirm('¿Seguro que deseas eliminar este PDF?')) {
      try {
        await catalogosService.eliminarPdf(id);
        toast.success('PDF eliminado');
        cargarPdfs();
      } catch (error) {
        toast.error('Error al eliminar');
      }
    }
  };

  const abrirModal = (pdf = null) => {
    if (pdf) {
      setFormData(pdf);
    } else {
      setFormData({ id: null, titulo: '', descripcion: '', precio: '', linkDrive: '' });
    }
    setModalOpen(true);
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Administración de Catálogo PDF</h1>
        <button onClick={() => abrirModal()} className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700">
          Nuevo PDF
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enlace Drive</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {pdfs.map(pdf => (
              <tr key={pdf.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{pdf.titulo}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${pdf.precio}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-500 truncate max-w-xs">
                  <a href={pdf.linkDrive} target="_blank" rel="noreferrer">Ver Link</a>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => abrirModal(pdf)} className="text-indigo-600 hover:text-indigo-900 mr-4">Editar</button>
                  <button onClick={() => handleEliminar(pdf.id)} className="text-red-600 hover:text-red-900">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">{formData.id ? 'Editar PDF' : 'Nuevo PDF'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Título</label>
                <input required type="text" value={formData.titulo} onChange={e => setFormData({...formData, titulo: e.target.value})} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Descripción</label>
                <textarea required rows="3" value={formData.descripcion} onChange={e => setFormData({...formData, descripcion: e.target.value})} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Precio</label>
                <input required type="number" step="0.01" value={formData.precio} onChange={e => setFormData({...formData, precio: e.target.value})} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Link de Drive</label>
                <input required type="url" value={formData.linkDrive} onChange={e => setFormData({...formData, linkDrive: e.target.value})} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CatalogosAdmin;