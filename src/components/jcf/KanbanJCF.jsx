import React, { useState, useEffect } from 'react';
import Layout from '../common/Layout';
import ModalAprendiz from './ModalAprendiz';
import { jcfService } from '../../services/jcfService';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Users, UserCheck, LayoutDashboard, UsersRound, LogOut, Clock, RefreshCw, CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';

const KanbanJCF = () => {
  const { user, logout } = useAuthStore();
  const rolUsuario = user?.rol?.toLowerCase();
  const isEncargado = rolUsuario === 'encargado_jcf';
  const isAdminOrLider = rolUsuario === 'admin' || rolUsuario === 'lider_jcf';

  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  const [jovenes, setJovenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [jovenSeleccionado, setJovenSeleccionado] = useState(null);

  useEffect(() => {
    cargarJovenes();
  }, []);

  const cargarJovenes = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await jcfService.obtenerAprendices();
      const dataArray = Array.isArray(res) ? res : (res?.data && Array.isArray(res.data) ? res.data : []);
      const filtrados = dataArray.filter(j => j.encargadoId === user?.id);
      setJovenes(filtrados);
    } catch (error) {
      setError('Error al cargar los jóvenes');
      setJovenes([]);
    } finally {
      setLoading(false);
    }
  };

  const abrirModal = (joven) => {
    setJovenSeleccionado(joven);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setJovenSeleccionado(null);
    setModalAbierto(false);
  };

  const handleActualizarEstado = async (id, estadoKanban) => {
    try {
      await jcfService.actualizarEstado(id, estadoKanban);
      cargarJovenes();
    } catch (error) {
      setError('Error al actualizar estado');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const safeJovenes = Array.isArray(jovenes) ? jovenes : [];

  const nombreCompleto = (j) => j.nombreCompleto || `${j.nombre || ''} ${j.apellido || ''}`.trim();

  const navBtnStyle = (isActive) => ({
    display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px',
    background: isActive ? 'linear-gradient(135deg, var(--capyme-blue-mid), var(--capyme-blue))' : '#fff',
    color: isActive ? '#fff' : 'var(--gray-600)', border: isActive ? 'none' : '1px solid var(--border)',
    borderRadius: 'var(--radius-md)', fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontSize: '13px', fontWeight: 600, cursor: 'pointer',
    boxShadow: isActive ? '0 2px 8px rgba(31,78,158,0.28)' : 'none', transition: 'all 200ms ease'
  });

  const columnas = [
    { key: 'ENCARGADO', titulo: 'Jóvenes Encargados', color: '#F59E0B', icon: Clock },
    { key: 'EN_PROCESO', titulo: 'Joven en Proceso', color: '#3B82F6', icon: RefreshCw },
    { key: 'POSTULADO', titulo: 'Joven Postulado', color: '#10B981', icon: CheckCircle2 }
  ];

  const ordenEstados = columnas.map(c => c.key);

  const arrowBtnStyle = {
    width: '26px', height: '26px', display: 'flex', alignItems: 'center', justifyContent: 'center',
    border: '1px solid var(--border)', borderRadius: '6px', background: '#fff', cursor: 'pointer',
    color: 'var(--gray-500)', transition: 'all 150ms ease'
  };

  const KanbanContent = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', width: '100%' }}>

      {isAdminOrLider && (
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button onClick={() => navigate('/jcf/lideres')} style={navBtnStyle(path === '/jcf/lideres')}>
            <UsersRound style={{width: 16, height: 16}}/> Gestionar Líderes
          </button>
          <button onClick={() => navigate('/jcf/encargados')} style={navBtnStyle(path === '/jcf/encargados')}>
            <UserCheck style={{width: 16, height: 16}}/> Gestionar Encargados
          </button>
          <button onClick={() => navigate('/jcf/jovenes')} style={navBtnStyle(path === '/jcf/jovenes')}>
            <Users style={{width: 16, height: 16}}/> Distribución de Jóvenes
          </button>
          <button onClick={() => navigate('/jcf/kanban')} style={navBtnStyle(path === '/jcf/kanban')}>
            <LayoutDashboard style={{width: 16, height: 16}}/> Tablero Kanban
          </button>
        </div>
      )}

      <div className="kanban-container" style={{ backgroundColor: '#ffffff', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '24px' }}>
        <div className="kanban-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '26px', fontWeight: 800, color: 'var(--gray-900)', margin: 0 }}>
              Mi Tablero de Jóvenes
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--gray-500)', fontFamily: "'DM Sans', sans-serif", margin: '4px 0 0 0' }}>
              Jóvenes que te asignaron a ti para postular
            </p>
          </div>
        </div>

        {error && (
          <div style={{ padding: '16px', background: '#FEE2E2', border: '1px solid #FECACA', borderRadius: 'var(--radius-md)', marginBottom: '16px', color: '#DC2626', fontSize: '14px' }}>
            {error}
          </div>
        )}

        {loading ? (
          <div style={{ padding: '60px 24px', textAlign: 'center' }}>
            <div style={{ width: '40px', height: '40px', border: '3px solid var(--border)', borderTopColor: 'var(--capyme-blue-mid)', borderRadius: '50%', animation: 'spin 700ms linear infinite', margin: '0 auto 16px' }} />
            <p style={{ fontSize: '14px', color: 'var(--gray-400)', fontFamily: "'DM Sans', sans-serif" }}>Cargando información...</p>
          </div>
        ) : (
          <div className="kanban-board" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(250px, 1fr))', gap: '20px', overflowX: 'auto' }}>
            {columnas.map((columna, colIndex) => {
              const jovenesColumna = safeJovenes.filter(j => (j.estadoKanban || 'ENCARGADO') === columna.key);
              const ColIcon = columna.icon;
              return (
                <div key={columna.key} className="kanban-column" style={{ background: 'var(--gray-50)', padding: '16px', borderRadius: 'var(--radius-md)' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--gray-800)', fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: columna.color }}></span> {columna.titulo}
                    <span style={{ marginLeft: 'auto', fontSize: '12px', fontWeight: 700, color: 'var(--gray-400)' }}>{jovenesColumna.length}</span>
                  </h3>
                  {jovenesColumna.length === 0 ? (
                    <p style={{ fontSize: '13px', color: 'var(--gray-400)', fontFamily: "'DM Sans', sans-serif", textAlign: 'center', padding: '20px 0' }}>
                      Sin registros
                    </p>
                  ) : (
                    jovenesColumna.map(joven => (
                      <div key={joven.id} className="kanban-card" onClick={() => abrirModal(joven)} style={{ background: '#fff', padding: '16px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', marginBottom: '12px', cursor: 'pointer', border: '1px solid var(--border)' }}>
                        <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', color: 'var(--gray-900)', fontFamily: "'Plus Jakarta Sans', sans-serif", display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <ColIcon style={{ width: '14px', height: '14px', color: columna.color }} />
                          {nombreCompleto(joven) || 'Sin nombre'}
                        </h4>
                        {joven.nombreNegocio && (
                          <p style={{ margin: '0 0 10px 0', fontSize: '12px', color: 'var(--gray-600)', fontFamily: "'DM Sans', sans-serif" }}>
                            {joven.nombreNegocio}
                          </p>
                        )}
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
                          {colIndex > 0 && (
                            <button
                              onClick={(e) => { e.stopPropagation(); handleActualizarEstado(joven.id, ordenEstados[colIndex - 1]); }}
                              title={`Regresar a ${columnas[colIndex - 1].titulo}`}
                              style={arrowBtnStyle}
                              onMouseEnter={e => { e.currentTarget.style.background = 'var(--gray-100)'; e.currentTarget.style.color = 'var(--gray-700)'; }}
                              onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = 'var(--gray-500)'; }}
                            >
                              <ArrowLeft style={{ width: '14px', height: '14px' }} />
                            </button>
                          )}
                          {colIndex < columnas.length - 1 && (
                            <button
                              onClick={(e) => { e.stopPropagation(); handleActualizarEstado(joven.id, ordenEstados[colIndex + 1]); }}
                              title={`Mover a ${columnas[colIndex + 1].titulo}`}
                              style={arrowBtnStyle}
                              onMouseEnter={e => { e.currentTarget.style.background = 'var(--gray-100)'; e.currentTarget.style.color = 'var(--gray-700)'; }}
                              onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = 'var(--gray-500)'; }}
                            >
                              <ArrowRight style={{ width: '14px', height: '14px' }} />
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              );
            })}
          </div>
        )}

        {modalAbierto && (
          <ModalAprendiz
            aprendiz={jovenSeleccionado}
            onClose={cerrarModal}
            onActualizarEstado={handleActualizarEstado}
          />
        )}
      </div>
    </div>
  );

  if (isEncargado) {
    return (
      <div style={{ padding: '20px', minHeight: '100vh', backgroundColor: '#f3f4f6', fontFamily: "'DM Sans', sans-serif" }}>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
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

  return (
    <Layout>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      {KanbanContent}
    </Layout>
  );
};

export default KanbanJCF;