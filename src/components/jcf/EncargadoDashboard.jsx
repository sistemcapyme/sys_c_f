import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { jcfService } from '../../services/jcfService';
import Layout from '../common/Layout';
import ModalAprendiz from './ModalAprendiz';
import { LayoutDashboard, Clock, RefreshCw, CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';

const EncargadoDashboard = () => {
  const { user } = useAuthStore();

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
      setError('Error al cargar los jóvenes asignados');
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
      setError('Error al actualizar el estado del joven');
    }
  };

  const safeJovenes = Array.isArray(jovenes) ? jovenes : [];
  const nombreCompleto = (j) => j.nombreCompleto || `${j.nombre || ''} ${j.apellido || ''}`.trim();

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

  return (
    <Layout>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <LayoutDashboard style={{ width: '28px', height: '28px', color: 'var(--capyme-blue-mid)' }} />
          <div>
            <h1 style={{ margin: 0, fontSize: '24px', color: 'var(--gray-900)', fontWeight: 800, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Jóvenes Construyendo el Futuro
            </h1>
            <p style={{ margin: '2px 0 0 0', fontSize: '13px', color: 'var(--gray-500)' }}>
              Panel de Encargado
            </p>
          </div>
        </div>

        <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '24px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '20px', fontWeight: 800, color: 'var(--gray-900)', margin: 0 }}>
              Mi Tablero de Jóvenes
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--gray-500)', fontFamily: "'DM Sans', sans-serif", margin: '6px 0 0 0' }}>
              Jóvenes que te asignaron a ti para postular
            </p>
          </div>

          {error && (
            <div style={{ padding: '16px', background: '#FEE2E2', border: '1px solid #FECACA', borderRadius: 'var(--radius-md)', marginBottom: '20px', color: '#DC2626', fontSize: '14px', fontWeight: 500 }}>
              {error}
            </div>
          )}

          {loading ? (
            <div style={{ padding: '60px 24px', textAlign: 'center' }}>
              <div style={{ width: '40px', height: '40px', border: '3px solid var(--border)', borderTopColor: 'var(--capyme-blue-mid)', borderRadius: '50%', animation: 'spin 700ms linear infinite', margin: '0 auto 16px' }} />
              <p style={{ fontSize: '14px', color: 'var(--gray-400)', fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}>Cargando información...</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', alignItems: 'start' }}>
              {columnas.map((columna, colIndex) => {
                const jovenesColumna = safeJovenes.filter(j => (j.estadoKanban || 'ENCARGADO') === columna.key);
                const ColIcon = columna.icon;
                return (
                  <div key={columna.key} style={{ background: 'var(--gray-50)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                    <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--gray-800)', fontFamily: "'Plus Jakarta Sans', sans-serif", margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: columna.color }}></span> {columna.titulo}
                      <span style={{ marginLeft: 'auto', fontSize: '13px', fontWeight: 800, color: 'var(--gray-500)', background: '#fff', padding: '2px 8px', borderRadius: '12px', border: '1px solid var(--border)' }}>{jovenesColumna.length}</span>
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {jovenesColumna.length === 0 ? (
                        <div style={{ padding: '30px 0', textAlign: 'center', background: '#fff', borderRadius: '8px', border: '1px dashed var(--border)' }}>
                          <p style={{ fontSize: '13px', color: 'var(--gray-400)', margin: 0, fontWeight: 500 }}>Sin registros</p>
                        </div>
                      ) : (
                        jovenesColumna.map(joven => (
                          <div key={joven.id} onClick={() => abrirModal(joven)} style={{ background: '#fff', padding: '16px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.03)', border: '1px solid var(--border)', cursor: 'pointer', transition: 'all 150ms ease' }} onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--capyme-blue-mid)'} onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
                            <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', color: 'var(--gray-900)', fontWeight: 700, fontFamily: "'Plus Jakarta Sans', sans-serif", display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <ColIcon style={{ width: '16px', height: '16px', color: columna.color }} />
                              {nombreCompleto(joven) || 'Sin nombre'}
                            </h4>
                            {joven.nombreNegocio && (
                              <p style={{ margin: '0 0 12px 0', fontSize: '13px', color: 'var(--gray-500)', fontWeight: 500 }}>
                                {joven.nombreNegocio}
                              </p>
                            )}
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                              {colIndex > 0 && (
                                <button
                                  onClick={(e) => { e.stopPropagation(); handleActualizarEstado(joven.id, ordenEstados[colIndex - 1]); }}
                                  title={`Regresar a ${columnas[colIndex - 1].titulo}`}
                                  style={arrowBtnStyle}
                                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--gray-100)'; e.currentTarget.style.color = 'var(--gray-800)'; }}
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
                                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--gray-100)'; e.currentTarget.style.color = 'var(--gray-800)'; }}
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
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {modalAbierto && (
        <ModalAprendiz
          aprendiz={jovenSeleccionado}
          onClose={cerrarModal}
          onActualizarEstado={handleActualizarEstado}
        />
      )}
    </Layout>
  );
};

export default EncargadoDashboard;