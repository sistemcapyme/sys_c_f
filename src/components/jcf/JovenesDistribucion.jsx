import React, { useState, useEffect } from 'react';
import Layout from '../common/Layout';
import { jcfService } from '../../services/jcfService';
import { useNavigate } from 'react-router-dom';
import { Users, UserCheck, LayoutDashboard, UsersRound, Search, Filter, Pencil } from 'lucide-react';

const JovenesDistribucion = () => {
  const navigate = useNavigate();
  const [jovenes, setJovenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [encargadoSeleccionado, setEncargadoSeleccionado] = useState(null);
  const [encargados, setEncargados] = useState([]);
  const [editandoId, setEditandoId] = useState(null);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const resJovenes = await jcfService.obtenerTodosAprendices();
      const jovenesArray = Array.isArray(resJovenes) ? resJovenes : (resJovenes?.data && Array.isArray(resJovenes.data) ? resJovenes.data : []);
      setJovenes(jovenesArray);

      const resEncargados = await jcfService.obtenerEncargados();
      const encargadosArray = Array.isArray(resEncargados) ? resEncargados : (resEncargados?.data && Array.isArray(resEncargados.data) ? resEncargados.data : []);
      setEncargados(encargadosArray);
    } catch (error) {
      console.error('Error cargando datos:', error);
      setError('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const handleAsignarEncargado = async (jovenId, encargadoId) => {
    try {
      await jcfService.asignarEncargado(jovenId, encargadoId);
      await cargarDatos();
      setEditandoId(null);
    } catch (error) {
      console.error('Error asignando encargado:', error);
    }
  };

  const jovenesFiltered = jovenes.filter(j => {
    const nombre = `${j.nombre || ''} ${j.apellido || ''}`.toLowerCase();
    const negocio = (j.nombreNegocio || j.linkNegocio || '').toLowerCase();
    const query = busqueda.toLowerCase();
    return nombre.includes(query) || negocio.includes(query);
  });

  const navBtnStyle = (isActive) => ({
    display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px',
    background: isActive ? 'linear-gradient(135deg, var(--capyme-blue-mid), var(--capyme-blue))' : '#fff',
    color: isActive ? '#fff' : 'var(--gray-600)', border: isActive ? 'none' : '1px solid var(--border)',
    borderRadius: 'var(--radius-md)', fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontSize: '13px', fontWeight: 600, cursor: 'pointer',
    boxShadow: isActive ? '0 2px 8px rgba(31,78,158,0.28)' : 'none', transition: 'all 200ms ease'
  });

  const estadoColor = (estado) => {
    const colores = {
      'ENCARGADO': '#F59E0B',
      'EN_PROCESO': '#3B82F6',
      'POSTULADO': '#10B981'
    };
    return colores[estado] || '#6B7280';
  };

  return (
    <Layout>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', width: '100%' }}>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button onClick={() => navigate('/jcf/lideres')} style={navBtnStyle(false)}>
            <UsersRound style={{width: 16, height: 16}}/> Gestionar Líderes
          </button>
          <button onClick={() => navigate('/jcf/encargados')} style={navBtnStyle(false)}>
            <UserCheck style={{width: 16, height: 16}}/> Gestionar Encargados
          </button>
          <button onClick={() => navigate('/jcf/jovenes')} style={navBtnStyle(true)}>
            <Users style={{width: 16, height: 16}}/> Distribución de Jóvenes
          </button>
          <button onClick={() => navigate('/jcf/kanban')} style={navBtnStyle(false)}>
            <LayoutDashboard style={{width: 16, height: 16}}/> Tablero Kanban
          </button>
        </div>

        <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '24px' }}>
          
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '26px', fontWeight: 800, color: 'var(--gray-900)', margin: '0 0 8px 0' }}>
              Distribución de Jóvenes
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--gray-500)', fontFamily: "'DM Sans', sans-serif", margin: 0 }}>
              Gestiona y asigna jóvenes a los encargados
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '250px', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', paddingLeft: '12px', background: '#fff' }}>
              <Search size={16} color='var(--gray-400)' />
              <input
                type="text"
                placeholder="Buscar por nombre o negocio..."
                value={busqueda}
                onChange={e => setBusqueda(e.target.value)}
                style={{ flex: 1, border: 'none', padding: '10px 12px', fontSize: '14px', fontFamily: "'DM Sans', sans-serif", outline: 'none' }}
              />
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
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: "'DM Sans', sans-serif" }}>
                <thead>
                  <tr style={{ background: 'var(--gray-50)', borderBottom: '1px solid var(--border)' }}>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: 700, color: 'var(--gray-600)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Nombre</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: 700, color: 'var(--gray-600)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Negocio</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: 700, color: 'var(--gray-600)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Estado</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: 700, color: 'var(--gray-600)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Encargado</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: 700, color: 'var(--gray-600)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {jovenesFiltered.length === 0 ? (
                    <tr>
                      <td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: 'var(--gray-400)', fontSize: '14px' }}>
                        No hay jóvenes registrados
                      </td>
                    </tr>
                  ) : (
                    jovenesFiltered.map(joven => (
                      <tr key={joven.id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 150ms ease' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--gray-50)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                        <td style={{ padding: '12px', fontSize: '14px', color: 'var(--gray-900)', fontWeight: 500 }}>
                          {`${joven.nombre || ''} ${joven.apellido || ''}`.trim()}
                        </td>
                        <td style={{ padding: '12px', fontSize: '14px', color: 'var(--gray-600)' }}>
                          {joven.nombreNegocio || joven.linkNegocio || '—'}
                        </td>
                        <td style={{ padding: '12px' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 600, padding: '4px 8px', background: estadoColor(joven.estadoKanban) + '20', color: estadoColor(joven.estadoKanban), borderRadius: '4px' }}>
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: estadoColor(joven.estadoKanban) }}></span>
                            {joven.estadoKanban || 'ENCARGADO'}
                          </span>
                        </td>
                        <td style={{ padding: '12px', fontSize: '14px', color: 'var(--gray-900)' }}>
                          {joven.encargado ? `${joven.encargado.nombre} ${joven.encargado.apellido}` : 'Sin asignar'}
                        </td>
                        <td style={{ padding: '12px' }}>
                          {editandoId === joven.id ? (
                            <select
                              autoFocus
                              value={joven.encargadoId || ''}
                              onChange={e => handleAsignarEncargado(joven.id, e.target.value || null)}
                              onBlur={() => setEditandoId(null)}
                              style={{ padding: '8px', fontSize: '13px', border: '1px solid var(--border)', borderRadius: '6px', background: '#fff', color: 'var(--gray-900)', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}
                            >
                              <option value="">Asignar encargado</option>
                              {encargados.map(enc => (
                                <option key={enc.id} value={enc.id}>
                                  {enc.nombre} {enc.apellido}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <button
                              onClick={() => setEditandoId(joven.id)}
                              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', fontSize: '13px', fontWeight: 600, border: '1px solid var(--border)', borderRadius: '6px', background: '#fff', color: 'var(--gray-600)', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}
                            >
                              <Pencil style={{ width: 14, height: 14 }} /> Editar
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

        </div>

      </div>
    </Layout>
  );
};

export default JovenesDistribucion;