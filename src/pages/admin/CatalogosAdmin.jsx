import React, { useState, useEffect } from 'react';
import catalogosService from '../../services/catalogosService';

const CatalogosAdmin = () => {
  const [pdfs, setPdfs] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ id: null, titulo: '', descripcion: '', precio: '', linkDrive: '' });

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
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.id) {
        await catalogosService.actualizarPdf(formData.id, formData);
      } else {
        await catalogosService.crearPdf(formData);
      }
      setModalOpen(false);
      setFormData({ id: null, titulo: '', descripcion: '', precio: '', linkDrive: '' });
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
    try {
      await catalogosService.eliminarPdf(id);
      fetchPdfs();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gestión de Catálogos</h1>
        <button onClick={() => setModalOpen(true)} className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors">
          Agregar PDF
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {pdfs.map((pdf) => (
              <tr key={pdf.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{pdf.titulo}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${pdf.precio}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${pdf.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {pdf.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => handleEdit(pdf)} className="text-blue-600 hover:text-blue-900 mr-4">Editar</button>
                  <button onClick={() => handleDelete(pdf.id)} className="text-red-600 hover:text-red-900">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">{formData.id ? 'Editar PDF' : 'Nuevo PDF'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Título</label>
                <input type="text" name="titulo" value={formData.titulo} onChange={handleChange} className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" required />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Descripción</label>
                <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" required />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Precio</label>
                <input type="number" step="0.01" name="precio" value={formData.precio} onChange={handleChange} className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" required />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">Link Drive</label>
                <input type="url" name="linkDrive" value={formData.linkDrive} onChange={handleChange} className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" required />
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setModalOpen(false)} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors">Cancelar</button>
                <button type="submit" className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800 transition-colors">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CatalogosAdmin;