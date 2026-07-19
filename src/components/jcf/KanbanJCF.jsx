import React from 'react';

const KanbanJCF = ({ aprendices, onActualizarEstado, onVerDetalle }) => {
  const columnas = [
    { id: 'PENDIENTE', titulo: 'Por Postular', color: 'bg-red-50' },
    { id: 'EN_PROCESO', titulo: 'En Proceso', color: 'bg-yellow-50' },
    { id: 'POSTULADO', titulo: 'Postulado', color: 'bg-green-50' }
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
    <div className="flex gap-4 min-h-[500px]">
      {columnas.map(col => (
        <div 
          key={col.id}
          className={`flex-1 rounded shadow p-4 ${col.color}`}
          onDrop={(e) => handleDrop(e, col.id)}
          onDragOver={handleDragOver}
        >
          <h3 className="font-bold text-center mb-4 text-gray-700">{col.titulo}</h3>
          <div className="flex flex-col gap-3">
            {aprendices.filter(a => a.estado === col.id).map(aprendiz => (
              <div
                key={aprendiz.id}
                draggable
                onDragStart={(e) => handleDragStart(e, aprendiz.id)}
                onClick={() => onVerDetalle(aprendiz)}
                className="bg-white p-3 rounded shadow cursor-pointer border border-gray-200 hover:border-primary transition-colors"
              >
                <p className="font-semibold">{aprendiz.nombre}</p>
                <p className="text-sm text-gray-600">{aprendiz.negocio_asignado}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default KanbanJCF;