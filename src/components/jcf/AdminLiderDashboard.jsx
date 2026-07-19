import React, { useState } from 'react';
import { Briefcase, Plus, Users, CheckCircle, Clock } from 'lucide-react';
import KanbanJCF from './KanbanJCF';
import ModalAprendiz from './ModalAprendiz';

const AdminLiderDashboard = ({ user, aprendices, onActualizarEstado }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [aprendizSeleccionado, setAprendizSeleccionado] = useState(null);

  const abrirModal = (aprendiz) => {
    setAprendizSeleccionado(aprendiz);
    setModalOpen(true);
  };

  const btnStyle = {
    display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', 
    background: 'linear-gradient(135deg, var(--capyme-blue-mid), var(--capyme-blue))', 
    color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', 
    fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '14px', fontWeight: 600, 
    cursor: 'pointer', boxShadow: '0 2px 8px rgba(31,78,158,0.28)', transition: 'all 200ms ease', whiteSpace: 'nowrap'
  };

  const btnOutlineStyle = {
    ...btnStyle,
    background: '#fff', color: 'var(--capyme-blue-mid)', 
    border: '1px solid var(--capyme-blue-mid)', boxShadow: 'none'
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '26px', fontWeight: 800, color: 'var(--gray-900)', letterSpacing: '-0.02em', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Briefcase style={{ width: '28px', height: '28px', color: 'var(--capyme-blue-mid)' }} />
            Jóvenes Construyendo el Futuro
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--gray-500)', fontFamily: "'DM Sans', sans-serif" }}>
            Gestión de postulaciones y seguimiento de aprendices
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {user.rol === 'admin' && (
            <button style={btnOutlineStyle} onMouseEnter={e => e.currentTarget.style.background = 'var(--gray-50)'} onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
              <Users style={{ width: '16px', height: '16px' }} /> Líderes JCF
            </button>
          )}
          {['admin', 'lider_jcf'].includes(user.rol) && (
            <>
              <button style={btnOutlineStyle} onMouseEnter={e => e.currentTarget.style.background = 'var(--gray-50)'} onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
                <Users style={{ width: '16px', height: '16px' }} /> Encargados JCF
              </button>
              <button style={btnOutlineStyle} onMouseEnter={e => e.currentTarget.style.background = 'var(--gray-50)'} onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
                <Briefcase style={{ width: '16px', height: '16px' }} /> Negocios JCF
              </button>
            </>
          )}
          <button style={btnStyle} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
            <Plus style={{ width: '16px', height: '16px' }} /> Nuevo Aprendiz
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '20px', boxShadow: 'var(--shadow-sm)', flex: 1, display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#F0FDF4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle style={{ width: '24px', height: '24px', color: '#16A34A' }} />
          </div>
          <div>
            <h3 style={{ fontSize: '13px', color: 'var(--gray-500)', fontFamily: "'DM Sans', sans-serif", fontWeight: 600, margin: 0 }}>Postulaciones Completadas</h3>
            <p style={{ fontSize: '24px', fontWeight: 800, fontFamily: "'Plus Jakarta Sans', sans-serif", color: 'var(--gray-900)', margin: '2px 0 0 0' }}>
              {aprendices.filter(a => a.estado_kanban === 'POSTULADO').length}
            </p>
          </div>
        </div>
        
        <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '20px', boxShadow: 'var(--shadow-sm)', flex: 1, display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#FFFBEB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Clock style={{ width: '24px', height: '24px', color: '#D97706' }} />
          </div>
          <div>
            <h3 style={{ fontSize: '13px', color: 'var(--gray-500)', fontFamily: "'DM Sans', sans-serif", fontWeight: 600, margin: 0 }}>Postulaciones Pendientes</h3>
            <p style={{ fontSize: '24px', fontWeight: 800, fontFamily: "'Plus Jakarta Sans', sans-serif", color: 'var(--gray-900)', margin: '2px 0 0 0' }}>
              {aprendices.filter(a => a.estado_kanban !== 'POSTULADO').length}
            </p>
          </div>
        </div>
      </div>

      {/* Kanban */}
      <KanbanJCF 
        aprendices={aprendices} 
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

export default AdminLiderDashboard;