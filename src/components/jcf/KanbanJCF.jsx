import React, { useState } from 'react';
import { User, Briefcase } from 'lucide-react';

const KanbanJCF = ({ aprendices, onActualizarEstado, onVerDetalle }) => {
  const [hoveredCard, setHoveredCard] = useState(null);

  const columnas = [
    { id: 'INICIADO', titulo: 'Iniciado', headerBg: '#FEF2F2', headerColor: '#DC2626', borderColor: '#FECACA' },
    { id: 'PROCESO', titulo: 'Proceso', headerBg: '#FFFBEB', headerColor: '#D97706', borderColor: '#FDE68A' },
    { id: 'POSTULADO', titulo: 'Postulado', headerBg: '#F0FDF4', headerColor: '#16A34A', borderColor: '#BBF7D0' }
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
    <div style={{ display: 'flex', gap: '20px', minHeight: '600px', overflowX: 'auto', paddingBottom: '10px' }}>
      {columnas.map(col => (
        <div 
          key={col.id}
          onDrop={(e) => handleDrop(e, col.id)}
          onDragOver={handleDragOver}
          style={{ 
            flex: '1', minWidth: '300px', background: 'var(--gray-50)', 
            border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', 
            display: 'flex', flexDirection: 'column', overflow: 'hidden'
          }}
        >
          <div style={{ background: col.headerBg, borderBottom: `1px solid ${col.borderColor}`, padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '14px', fontWeight: 800, color: col.headerColor, margin: 0 }}>
              {col.titulo}
            </h3>
            <span style={{ background: '#fff', color: col.headerColor, fontSize: '12px', fontWeight: 700, padding: '2px 8px', borderRadius: '12px', border: `1px solid ${col.borderColor}` }}>
              {aprendices.filter(a => a.estadoKanban === col.id || a.estado_kanban === col.id).length}
            </span>
          </div>

          <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', flex: 1, overflowY: 'auto' }}>
            {aprendices.filter(a => a.estadoKanban === col.id || a.estado_kanban === col.id).map(aprendiz => (
              <div
                key={aprendiz.id}
                draggable
                onDragStart={(e) => handleDragStart(e, aprendiz.id)}
                onClick={() => onVerDetalle(aprendiz)}
                onMouseEnter={() => setHoveredCard(aprendiz.id)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{ 
                  background: '#fff', border: '1px solid', 
                  borderColor: hoveredCard === aprendiz.id ? 'var(--capyme-blue-mid)' : 'var(--border)', 
                  borderRadius: 'var(--radius-md)', padding: '16px', 
                  boxShadow: hoveredCard === aprendiz.id ? '0 4px 12px rgba(0,0,0,0.08)' : 'var(--shadow-sm)', 
                  cursor: 'grab', transition: 'all 150ms ease', transform: hoveredCard === aprendiz.id ? 'translateY(-2px)' : 'translateY(0)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <User style={{ width: '14px', height: '14px', color: 'var(--capyme-blue-mid)' }} />
                  <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '14px', fontWeight: 700, color: 'var(--gray-900)', margin: 0 }}>
                    {aprendiz.nombre} {aprendiz.apellido}
                  </p>
                </div>
                {aprendiz.negocio && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Briefcase style={{ width: '13px', height: '13px', color: 'var(--gray-400)' }} />
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', color: 'var(--gray-500)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {aprendiz.negocio.nombreNegocio}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default KanbanJCF;