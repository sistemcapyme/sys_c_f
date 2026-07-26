import React, { useState, useEffect } from 'react';
import { jcfService } from '../../services/jcfService';
import ModalAprendiz from './ModalAprendiz';

const COLUMNAS = [
  { id: 'PENDIENTE', titulo: 'Pendiente' },
  { id: 'APROBADO', titulo: 'Aprobado' },
  { id: 'RECHAZADO', titulo: 'Rechazado' }
];

export default function KanbanJCF() {
  const [aprendices, setAprendices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aprendizSeleccionado, setAprendizSeleccionado] = useState(null);

  useEffect(() => {
    cargarAprendices();
  }, []);

  const cargarAprendices = async () => {
    try {
      setLoading(true);
      const data = await jcfService.obtenerAprendices();
      setAprendices(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCambiarEstado = async (id, nuevoEstado) => {
    try {
      await jcfService.actualizarEstado(id, nuevoEstado);
      setAprendices(prev =>
        prev.map(a => (a.id === id ? { ...a, estado_kanban: nuevoEstado } : a))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleAsignarEncargado = async (id, encargadoId) => {
    try {
      await jcfService.asignarEncargado(id, encargadoId);
      cargarAprendices();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="p-6 text-center">Cargando tablero...</div>;

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {COLUMNAS.map(col => (
          <div key={col.id} className="bg-gray-100 rounded-lg p-4 min-h-[500px]">
            <h3 className="font-bold text-gray-700 mb-4 text-center border-b border-gray-300 pb-2">
              {col.titulo} ({aprendices.filter(a => a.estado_kanban === col.id).length})
            </h3>
            
            <div className="space-y-4">
              {aprendices
                .filter(a => a.estado_kanban === col.id)
                .map(item => (
                  <div
                    key={item.id}
                    className="bg-white p-4 rounded shadow hover:shadow-md transition cursor-pointer border-l-4 border-blue-600"
                  >
                    <div onClick={() => setAprendizSeleccionado(item)}>
                      <p className="font-semibold text-gray-800">{item.nombre} {item.apellido}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        📍 Negocio: {item.negocio?.nombre_negocio || 'Sin asignar'}
                      </p>
                      <p className="text-xs text-blue-600 mt-1">
                        👤 Encargado ID: {item.encargado_id || 'Pendiente'}
                      </p>
                    </div>
                    <div className="mt-3 flex justify-between gap-2 border-t pt-2">
                      {COLUMNAS.filter(c => c.id !== col.id).map(btnCol => (
                        <button
                          key={btnCol.id}
                          onClick={(e) => { e.stopPropagation(); handleCambiarEstado(item.id, btnCol.id); }}
                          className="text-xs px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded text-gray-700 w-full"
                        >
                          Mover a {btnCol.titulo}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>

      {aprendizSeleccionado && (
        <ModalAprendiz
          aprendiz={aprendizSeleccionado}
          onClose={() => setAprendizSeleccionado(null)}
          onActualizarEstado={handleCambiarEstado}
          onAsignarEncargado={handleAsignarEncargado}
        />
      )}
    </div>
  );
}