import React, { useState, useEffect } from 'react';
import Layout from '../common/Layout';
import ModalAprendiz from './ModalAprendiz';
import { jcfService } from '../../services/jcfService';
import { useNavigate, useLocation } from 'react-router-dom';
import { Users, UserCheck, LayoutDashboard, UsersRound, LogOut } from 'lucide-react';

const KanbanJCF = () => {
  const authStorage = JSON.parse(localStorage.getItem('auth-storage') || '{}');
  const currentUser = authStorage?.state?.user || {};
  const rolUsuario = currentUser?.rol?.toLowerCase();
  const isEncargado = rolUsuario === 'encargado' || rolUsuario === 'encargado_jcf';
  const isAdminOrLider = rolUsuario === 'admin' || rolUsuario === 'lider' || rolUsuario === 'lider_jcf';
  
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  const [tareas, setTareas] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [tareaSeleccionada, setTareaSeleccionada] = useState(null);

  useEffect(() => {
    cargarTareas();
  }, []);

  const cargarTareas = async () => {
    try {
      const res = await jcfService.obtenerAprendices();
      const dataArray = Array.isArray(res) ? res : (res?.data && Array.isArray(res.data) ? res.data : []);
      setTareas(dataArray);
    } catch (error) {
      console.error(error);
      setTareas([]);
    }
  };

  const abrirModal = (tarea = null) => {
    setTareaSeleccionada(tarea);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setTareaSeleccionada(null);
    setModalAbierto(false);
  };

  const guardarTarea = async (datos) => {
    try {
      if (tareaSeleccionada) {
        await jcfService.actualizarAprendiz(tareaSeleccionada.id, datos);
      } else {
        await jcfService.crearAprendiz(datos);
      }
      cargarTareas();
      cerrarModal();
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('auth-storage');
    window.location.href = '/login';
  };

  const safeTareas = Array.isArray(tareas) ? tareas : [];

  const navBtnStyle = (isActive) => ({
    display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px',
    background: isActive ? 'linear-gradient(135deg, var(--capyme-blue-mid), var(--capyme-blue))' : '#fff',
    color: isActive ? '#fff' : 'var(--gray-600)', border: isActive ? 'none' : '1px solid var(--border)',
    borderRadius: 'var(--radius-md)', fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontSize: '13px', fontWeight: 600, cursor: 'pointer',
    boxShadow: isActive ? '0 2px 8px rgba(31,78,158,0.28)' : 'none', transition: 'all 200ms ease'
  });

  const KanbanContent = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', width: '100%' }}>
      
      {isAdminOrLider && (
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button onClick={() => navigate('/jcf/lideres')} style={navBtnStyle(path === '/jcf' || path.includes('lideres'))}>
            <UsersRound style={{width: 16, height: 16}}/> Gestionar Líderes
          </button>
          <button onClick={() => navigate('/jcf/encargados')} style={navBtnStyle(path.includes('encargados'))}>
            <UserCheck style={{width: 16, height: 16}}/> Gestionar Encargados
          </button>
          <button onClick={() => navigate('/jcf/jovenes')} style={navBtnStyle(path.includes('jovenes') || path.includes('distribucion'))}>
            <Users style={{width: 16, height: 16}}/> Distribución de Jóvenes
          </button>
          <button onClick={() => navigate('/jcf/kanban')} style={navBtnStyle(path.includes('kanban'))}>
            <LayoutDashboard style={{width: 16, height: 16}}/> Tablero Kanban
          </button>
        </div>
      )}

      <div className="kanban-container" style={{ backgroundColor: '#ffffff', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '24px' }}>
        <div className="kanban-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '26px', fontWeight: 800, color: 'var(--gray-900)', margin: 0 }}>
              Tablero Kanban
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--gray-500)', fontFamily: "'DM Sans', sans-serif", margin: '4px 0 0 0' }}>
              Postulación y seguimiento de jóvenes asignados
            </p>
          </div>
          <button 
            className="btn-primary" 
            onClick={() => abrirModal()}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: 'linear-gradient(135deg, var(--capyme-blue-mid), var(--capyme-blue))', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '14px', fontWeight: 600, cursor: 'pointer', boxShadow: '0 2px 8px rgba(31,78,158,0.28)' }}
          >
            Nueva Tarea
          </button>
        </div>
        
        <div className="kanban-board" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(250px, 1fr))', gap: '20px', overflowX: 'auto' }}>
          <div className="kanban-column" style={{ background: 'var(--gray-50)', padding: '16px', borderRadius: 'var(--radius-md)' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--gray-800)', fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#F59E0B' }}></span> Pendientes
            </h3>
            {safeTareas.filter(t => t.estado === 'pendiente').map(tarea => (
              <div key={tarea.id} className="kanban-card" onClick={() => abrirModal(tarea)} style={{ background: '#fff', padding: '16px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', marginBottom: '12px', cursor: 'pointer', border: '1px solid var(--border)' }}>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', color: 'var(--gray-900)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{tarea.titulo}</h4>
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--gray-600)', fontFamily: "'DM Sans', sans-serif" }}>{tarea.descripcion}</p>
              </div>
            ))}
          </div>
          <div className="kanban-column" style={{ background: 'var(--gray-50)', padding: '16px', borderRadius: 'var(--radius-md)' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--gray-800)', fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#3B82F6' }}></span> En Progreso
            </h3>
            {safeTareas.filter(t => t.estado === 'en_progreso').map(tarea => (
              <div key={tarea.id} className="kanban-card" onClick={() => abrirModal(tarea)} style={{ background: '#fff', padding: '16px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', marginBottom: '12px', cursor: 'pointer', border: '1px solid var(--border)' }}>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', color: 'var(--gray-900)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{tarea.titulo}</h4>
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--gray-600)', fontFamily: "'DM Sans', sans-serif" }}>{tarea.descripcion}</p>
              </div>
            ))}
          </div>
          <div className="kanban-column" style={{ background: 'var(--gray-50)', padding: '16px', borderRadius: 'var(--radius-md)' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--gray-800)', fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10B981' }}></span> Completado
            </h3>
            {safeTareas.filter(t => t.estado === 'completado').map(tarea => (
              <div key={tarea.id} className="kanban-card" onClick={() => abrirModal(tarea)} style={{ background: '#fff', padding: '16px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', marginBottom: '12px', cursor: 'pointer', border: '1px solid var(--border)' }}>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', color: 'var(--gray-900)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{tarea.titulo}</h4>
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--gray-600)', fontFamily: "'DM Sans', sans-serif" }}>{tarea.descripcion}</p>
              </div>
            ))}
          </div>
        </div>
        
        <ModalAprendiz
          isOpen={modalAbierto}
          onClose={cerrarModal}
          onSave={guardarTarea}
          tareaData={tareaSeleccionada}
        />
      </div>
    </div>
  );

  if (isEncargado) {
    return (
      <div style={{ padding: '20px', minHeight: '100vh', backgroundColor: '#f3f4f6', fontFamily: "'DM Sans', sans-serif" }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', background: '#fff', padding: '15px 24px', borderRadius: 'var(--radius-lg)', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <LayoutDashboard style={{ width: '24px', height: '24px', color: 'var(--capyme-blue-mid)' }} />
            <h1 style={{ margin: 0, fontSize: '20px', color: 'var(--capyme-blue-mid)', fontWeight: 800, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Jóvenes Construyendo el Futuro</h1>
          </div>
          <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', background: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 150ms ease' }} onMouseEnter={e => e.currentTarget.style.background = '#FEE2E2'} onMouseLeave={e => e.currentTarget.style.background = '#FEF2F2'}>
            <LogOut style={{ width: '16px', height: '16px' }} /> Cerrar Sesión
          </button>
        </div>
        {KanbanContent}
      </div>
    );
  }

  return <Layout>{KanbanContent}</Layout>;
};

export default KanbanJCF;