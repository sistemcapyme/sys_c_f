import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Layout from '../common/Layout';
import { getEncargados, createEncargado, updateEncargado, deleteEncargado } from '../../services/encargadosService';
import { Users, Plus, Edit2, Trash2, X, Save, Mail, ArrowLeft, UserCheck, LayoutDashboard, UsersRound } from 'lucide-react';

const GestionEncargados = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;
  
  const [encargados, setEncargados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    nombre: '', apellido: '', email: '', password: '', telefono: '', activo: true
  });

  useEffect(() => {
    fetchEncargados();
  }, []);

  const fetchEncargados = async () => {
    try {
      setLoading(true);
      const data = await getEncargados();
      // SEGURO AL ERROR `.map is not a function`:
      setEncargados(Array.isArray(data) ? data : (data?.data && Array.isArray(data.data) ? data.data : []));
    } catch (err) {
      console.error(err);
      setError('Error al cargar los encargados');
      setEncargados([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const openModal = (encargado = null) => {
    setError('');
    if (encargado) {
      setEditId(encargado.id);
      setFormData({
        nombre: encargado.nombre || '', apellido: encargado.apellido || '',
        email: encargado.email || '', password: '', telefono: encargado.telefono || '',
        activo: encargado.activo
      });
    } else {
      setEditId(null);
      setFormData({ nombre: '', apellido: '', email: '', password: '', telefono: '', activo: true });
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        const updateData = { ...formData };
        if (!updateData.password) delete updateData.password;
        await updateEncargado(editId, updateData);
      } else {
        await createEncargado(formData);
      }
      fetchEncargados();
      closeModal();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar el encargado');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este encargado?')) {
      try {
        await deleteEncargado(id);
        fetchEncargados();
      } catch (err) {
        console.error(err);
        alert('Error al eliminar el encargado');
      }
    }
  };

  const safeEncargados = Array.isArray(encargados) ? encargados : [];

  const navBtnStyle = (isActive) => ({
    display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px',
    background: isActive ? 'linear-gradient(135deg, var(--capyme-blue-mid), var(--capyme-blue))' : '#fff',
    color: isActive ? '#fff' : 'var(--gray-600)', border: isActive ? 'none' : '1px solid var(--border)',
    borderRadius: 'var(--radius-md)', fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontSize: '13px', fontWeight: 600, cursor: 'pointer',
    boxShadow: isActive ? '0 2px 8px rgba(31,78,158,0.28)' : 'none', transition: 'all 200ms ease'
  });

  const btnStyle = {
    display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', 
    background: 'linear-gradient(135deg, var(--capyme-blue-mid), var(--capyme-blue))', 
    color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', 
    fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '14px', fontWeight: 600, 
    cursor: 'pointer', boxShadow: '0 2px 8px rgba(31,78,158,0.28)', transition: 'all 200ms ease'
  };

  const inputStyle = {
    width: '100%', padding: '10px 12px', border: '1px solid var(--border)', 
    borderRadius: 'var(--radius-md)', fontSize: '14px', fontFamily: "'DM Sans', sans-serif", 
    color: 'var(--gray-900)', background: '#fff', outline: 'none', boxSizing: 'border-box'
  };

  if (loading) {
    return (
      <Layout>
        <div style={{ padding: '24px', textAlign: 'center', fontFamily: "'DM Sans', sans-serif" }}>Cargando encargados...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
        
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button onClick={() => navigate('/jcf')} style={navBtnStyle(path === '/jcf' || path.includes('lideres'))}>
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

        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
          <div>
            <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '26px', fontWeight: 800, color: 'var(--gray-900)', letterSpacing: '-0.02em', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <UserCheck style={{ width: '28px', height: '28px', color: 'var(--capyme-blue-mid)' }} />
              Gestión de Encargados JCF
            </h1>
            <p style={{ fontSize: '14px', color: 'var(--gray-500)', fontFamily: "'DM Sans', sans-serif", margin: 0 }}>
              Administra los usuarios encargados registrados en el sistema
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              onClick={() => openModal()}
              style={btnStyle}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <Plus style={{ width: '16px', height: '16px' }} /> Nuevo Encargado
            </button>
          </div>
        </div>

        <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--gray-50)' }}>
                  {['Nombre Completo', 'Correo', 'Teléfono', 'Estado', 'Acciones'].map((h, i) => (
                    <th key={h} style={{ padding: '14px 24px', textAlign: i === 4 ? 'center' : 'left', fontSize: '11px', fontWeight: 700, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: "'Plus Jakarta Sans', sans-serif", borderBottom: '1px solid var(--border)', whiteSpace: 'nowrap' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {safeEncargados.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ padding: '24px', textAlign: 'center', color: 'var(--gray-500)', fontSize: '14px', fontFamily: "'DM Sans', sans-serif" }}>
                      No hay encargados registrados.
                    </td>
                  </tr>
                ) : (
                  safeEncargados.map((encargado) => (
                    <tr 
                      key={encargado.id}
                      onMouseEnter={() => setHoveredRow(encargado.id)}
                      onMouseLeave={() => setHoveredRow(null)}
                      style={{ borderBottom: '1px solid var(--border)', transition: 'background 150ms ease', background: hoveredRow === encargado.id ? 'var(--gray-50)' : 'transparent' }}
                    >
                      <td style={{ padding: '14px 24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{ width: '38px', height: '38px', borderRadius: 'var(--radius-md)', background: 'linear-gradient(135deg, #10B981, #059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '13px', fontWeight: 700, fontFamily: "'Plus Jakarta Sans', sans-serif", flexShrink: 0 }}>
                            {encargado.nombre?.charAt(0)?.toUpperCase()}{encargado.apellido?.charAt(0)?.toUpperCase()}
                          </div>
                          <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--gray-800)', fontFamily: "'DM Sans', sans-serif", margin: 0 }}>
                            {encargado.nombre} {encargado.apellido}
                          </p>
                        </div>
                      </td>
                      <td style={{ padding: '14px 24px' }}>
                        <p style={{ fontSize: '13px', color: 'var(--gray-700)', display: 'flex', alignItems: 'center', gap: '5px', margin: 0 }}>
                          <Mail style={{ width: '12px', height: '12px', color: 'var(--gray-400)' }} />
                          {encargado.email}
                        </p>
                      </td>
                      <td style={{ padding: '14px 24px', fontSize: '13px', color: 'var(--gray-700)', fontFamily: "'DM Sans', sans-serif" }}>
                        {encargado.telefono || 'N/A'}
                      </td>
                      <td style={{ padding: '14px 24px' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '4px 10px', borderRadius: 'var(--radius-sm)', fontSize: '12px', fontWeight: 600, fontFamily: "'DM Sans', sans-serif", background: encargado.activo ? '#ECFDF5' : '#FEF2F2', color: encargado.activo ? '#065F46' : '#991B1B' }}>
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: encargado.activo ? '#10B981' : '#EF4444', display: 'inline-block' }} />
                          {encargado.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td style={{ padding: '14px 24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                          <button 
                            onClick={() => openModal(encargado)}
                            style={{ padding: '6px', background: '#EEF4FF', border: '1px solid #D1E0FF', borderRadius: 'var(--radius-sm)', color: 'var(--capyme-blue-mid)', cursor: 'pointer', transition: 'all 150ms ease' }}
                          >
                            <Edit2 style={{ width: '16px', height: '16px' }} />
                          </button>
                          <button 
                            onClick={() => handleDelete(encargado.id)}
                            style={{ padding: '6px', background: '#FEF2F2', border: '1px solid #FEE2E2', borderRadius: 'var(--radius-sm)', color: '#EF4444', cursor: 'pointer', transition: 'all 150ms ease' }}
                          >
                            <Trash2 style={{ width: '16px', height: '16px' }} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {modalOpen && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
            <div style={{ background: '#fff', borderRadius: 'var(--radius-lg)', width: '100%', maxWidth: '500px', boxShadow: '0 20px 60px rgba(0,0,0,0.18)', overflow: 'hidden' }}>
              <div style={{ padding: '20px 24px', background: 'var(--gray-50)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 800, fontFamily: "'Plus Jakarta Sans', sans-serif", color: 'var(--gray-900)' }}>
                  {editId ? 'Editar Encargado' : 'Nuevo Encargado'}
                </h2>
                <button onClick={closeModal} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--gray-400)' }}>
                  <X style={{ width: '20px', height: '20px' }} />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {error && (
                  <div style={{ padding: '12px', background: '#FEF2F2', color: '#991B1B', borderRadius: 'var(--radius-md)', fontSize: '13px', fontFamily: "'DM Sans', sans-serif" }}>
                    {error}
                  </div>
                )}
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--gray-700)', marginBottom: '6px', fontFamily: "'DM Sans', sans-serif" }}>Nombre</label>
                    <input type="text" name="nombre" value={formData.nombre} onChange={handleInputChange} required style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--gray-700)', marginBottom: '6px', fontFamily: "'DM Sans', sans-serif" }}>Apellido</label>
                    <input type="text" name="apellido" value={formData.apellido} onChange={handleInputChange} required style={inputStyle} />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--gray-700)', marginBottom: '6px', fontFamily: "'DM Sans', sans-serif" }}>Correo Electrónico</label>
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange} required style={inputStyle} />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--gray-700)', marginBottom: '6px', fontFamily: "'DM Sans', sans-serif" }}>
                    Contraseña {editId && <span style={{ color: 'var(--gray-400)', fontWeight: 400 }}>(Dejar en blanco para mantener actual)</span>}
                  </label>
                  <input type="password" name="password" value={formData.password} onChange={handleInputChange} required={!editId} style={inputStyle} />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--gray-700)', marginBottom: '6px', fontFamily: "'DM Sans', sans-serif" }}>Teléfono</label>
                  <input type="tel" name="telefono" value={formData.telefono} onChange={handleInputChange} style={inputStyle} />
                </div>

                {editId && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                    <input type="checkbox" id="activo" name="activo" checked={formData.activo} onChange={handleInputChange} style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
                    <label htmlFor="activo" style={{ fontSize: '14px', color: 'var(--gray-700)', fontFamily: "'DM Sans', sans-serif", cursor: 'pointer' }}>
                      Usuario Activo
                    </label>
                  </div>
                )}

                <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                  <button type="button" onClick={closeModal} style={{ padding: '10px 20px', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', background: '#fff', color: 'var(--gray-700)', fontSize: '14px', fontWeight: 600, fontFamily: "'DM Sans', sans-serif", cursor: 'pointer' }}>
                    Cancelar
                  </button>
                  <button type="submit" style={{ ...btnStyle, margin: 0 }}>
                    <Save style={{ width: '16px', height: '16px' }} />
                    {editId ? 'Actualizar' : 'Crear Encargado'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default GestionEncargados;