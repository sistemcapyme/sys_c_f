import React, { useState } from 'react';

const ModalAprendiz = ({ aprendiz, onClose }) => {
  const [encargado, setEncargado] = useState(aprendiz?.encargado_id || '');

  if (!aprendiz) return null;

  const guardarCambios = (e) => {
    e.preventDefault();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl overflow-hidden">
        <div className="bg-primary text-white p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">Detalle de Postulación</h2>
          <button onClick={onClose} className="text-white hover:text-gray-200 font-bold text-xl">&times;</button>
        </div>
        
        <form onSubmit={guardarCambios} className="p-6">
          <div className="grid grid-cols-2 gap-6">
            
            <div className="border p-4 rounded bg-gray-50">
              <h3 className="font-bold text-lg mb-3 border-b pb-2">Datos del Negocio JCF</h3>
              <p><strong>Sucursal:</strong> {aprendiz.negocio?.sucursal}</p>
              <p><strong>Razón Social:</strong> {aprendiz.negocio?.nombre}</p>
              <p><strong>Representante:</strong> {aprendiz.negocio?.representante}</p>
              <p><strong>Dirección:</strong> {aprendiz.negocio?.direccion}</p>
            </div>

            <div className="border p-4 rounded bg-gray-50">
              <h3 className="font-bold text-lg mb-3 border-b pb-2">Datos del Aprendiz</h3>
              <p><strong>Nombre:</strong> {aprendiz.nombre}</p>
              <p><strong>Categoría:</strong> {aprendiz.categoria}</p>
              <p>
                <strong>Documentos:</strong> 
                <a href={aprendiz.drive_link} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline ml-2">
                  Ver en Drive
                </a>
              </p>
              
              <div className="mt-4">
                <label className="block text-sm font-bold mb-2">Asignar Encargado:</label>
                <select 
                  className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  value={encargado}
                  onChange={(e) => setEncargado(e.target.value)}
                >
                  <option value="">Seleccione un encargado...</option>
                  <option value="1">Admin / Líder (Autoasignación)</option>
                  <option value="2">Carlos (Colaborador)</option>
                  <option value="3">María (Colaborador)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3 border-t pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded hover:bg-gray-100">
              Cancelar
            </button>
            <button type="submit" className="px-4 py-2 bg-primary text-white rounded hover:bg-opacity-90">
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalAprendiz;