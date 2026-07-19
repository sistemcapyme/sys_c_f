import React, { useState } from 'react';
import { User, CheckCircle, Clock } from 'lucide-react';
import KanbanJCF from './KanbanJCF';
import ModalAprendiz from './ModalAprendiz';

const EncargadoDashboard = ({ user, aprendices, onActualizarEstado }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [aprendizSeleccionado, setAprendizSeleccionado] = useState(null);

  const misAprendices = aprendices.filter(a => a.encargado_id === user.id);
  const postulados = misAprendices.filter(a => a.estado_kanban === 'POSTULADO').length;
  const pendientes = misAprendices.filter(a => a.estado_kanban !== 'POSTULADO').length;

  const abrirModal = (aprendiz) => {
    setAprendizSeleccionado(aprendiz);
    setModalOpen(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '26px', fontWeight: 800, color: 'var(--gray-900)', letterSpacing: '-0.02em', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <User style={{ width: '28px', height: '28px', color: 'var(--capyme-blue-mid)' }} />
            Mi Tablero de Asignaciones
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--gray-500)', fontFamily: "'DM Sans', sans-serif" }}>
            Gestión de los aprendices que tienes a tu cargo
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '20px', boxShadow: 'var(--shadow-sm)', flex: 1, display: 'flex', alignItems: 'center', gap: '16px', borderLeft: '4px solid #D97706' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#FFFBEB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Clock style={{ width: '24px', height: '24px', color: '#D97706' }} />
          </div>
          <div>
            <h3 style={{ fontSize: '13px', color: 'var(--gray-500)', fontFamily: "'DM Sans', sans-serif", fontWeight: 600, margin: 0 }}>Mis Aprendices a Postular</h3>
            <p style={{ fontSize: '24px', fontWeight: 800, fontFamily: "'Plus Jakarta Sans', sans-serif", color: 'var(--gray-900)', margin: '2px 0 0 0' }}>
              {pendientes}
            </p>
          </div>
        </div>
        
        <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '20px', boxShadow: 'var(--shadow-sm)', flex: 1, display: 'flex', alignItems: 'center', gap: '16px', borderLeft: '4px solid #16A34A' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#F0FDF4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle style={{ width: '24px', height: '24px', color: '#16A34A' }} />
          </div>
          <div>
            <h3 style={{ fontSize: '13px', color: 'var(--gray-500)', fontFamily: "'DM Sans', sans-serif", fontWeight: 600, margin: 0 }}>Postulaciones Exitosas</h3>
            <p style={{ fontSize: '24px', fontWeight: 800, fontFamily: "'Plus Jakarta Sans', sans-serif", color: 'var(--gray-900)', margin: '2px 0 0 0' }}>
              {postulados}
            </p>
          </div>
        </div>
      </div>

      <KanbanJCF 
        aprendices={misAprendices} 
        onActualizarEstado={onActualizarEstado} 
        onVerDetalle={abrirModal} 
      />

      {modalOpen && (
        <ModalAprendiz 
          aprendiz={aprendizSeleccionado} 
          onClose={() => setModalOpen(false)} 
        />
      )}
    </div>
  );
};

export default EncargadoDashboard;