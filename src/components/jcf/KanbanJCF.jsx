import React from 'react';

const KanbanJCF = ({ aprendices, onActualizarEstado, onVerDetalle }) => {
  const columnas = [
    { id: 'PENDIENTE', titulo: 'Por Postular', bgHeader: 'bg-gray-50', textHeader: 'text-gray-600' },
    { id: 'EN_PROCESO', titulo: 'En Proceso', bgHeader: 'bg-blue-50', textHeader: 'text-blue-800' },
    { id: 'POSTULADO', titulo: 'Postulado', bgHeader: 'bg-green-50', textHeader: 'text-green-800' }
  ];

  const handleDragStart = (e, id) => {
    e.dataTransfer.setData('aprendizId', id);
  };

  const handleDrop = (e, estadoDestino) => {
    e.preventDefault();
    const aprendizId = e.dataTransfer.getData('aprendizId');
    if (aprendizId) {
      onActualizarEstado(parseInt(aprendizId), estadoDestino);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div className="flex gap-4 p-4 min-h-[500px] overflow-x-auto">
      {columnas.map(col => (
        <div 
          key={col.id}
          className="flex-1 min-w-[300px] bg-gray-50/50 border border-gray-100 rounded-lg flex flex-col"
          onDrop={(e) => handleDrop(e, col.id)}
          onDragOver={handleDragOver}
        >
          <div className={`p-3 border-b border-gray-200 rounded-t-lg ${col.bgHeader}`}>
            <h3 className={`font-semibold text-sm uppercase tracking-wider ${col.textHeader}`}>
              {col.titulo} ({aprendices.filter(a => a.estado_kanban === col.id).length})
            </h3>
          </div>
          <div className="p-3 flex flex-col gap-3 flex-1 overflow-y-auto">
            {aprendices.filter(a => a.estado_kanban === col.id).map(aprendiz => (
              <div
                key={aprendiz.id}
                draggable
                onDragStart={(e) => handleDragStart(e, aprendiz.id)}
                onClick={() => onVerDetalle(aprendiz)}
                className="bg-white p-4 rounded shadow-sm border border-gray-200 cursor-pointer hover:border-blue-400 hover:shadow transition-all"
              >
                <div className="flex justify-between items-start mb-2">
                  <p className="font-semibold text-gray-800 text-sm">
                    {aprendiz.nombre} {aprendiz.apellido}
                  </p>
                  <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                    {aprendiz.curp?.substring(0, 4)}...
                  </span>
                </div>
                <p className="text-xs text-gray-500 mb-2 truncate">
                  Negocio: {aprendiz.negocio?.nombreNegocio || 'Sin asignar'}
                </p>
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                  <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 text-xs font-bold">
                    {aprendiz.encargado?.nombre?.charAt(0) || '?'}
                  </div>
                  <p className="text-xs text-gray-600 truncate">
                    {aprendiz.encargado ? `${aprendiz.encargado.nombre}` : 'Sin encargado'}
                  </p>
                </div>
              </div>
            ))}
            
            {aprendices.filter(a => a.estado_kanban === col.id).length === 0 && (
              <div className="flex flex-col items-center justify-center h-32 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <span className="text-xs">No hay tarjetas</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default KanbanJCF;