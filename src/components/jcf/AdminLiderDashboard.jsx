import React, { useState, useEffect } from 'react';
import Layout from '../common/Layout';
import { Users, Plus, ArrowLeft, Mail, Shield, X, Save } from 'lucide-react';
import { jcfService } from '../../services/jcfService';
import axios from '../../services/axios';
import { useNavigate } from 'react-router-dom';

const AdminLiderDashboard = () => {
  const navigate = useNavigate();
  const [vistaActual, setVistaActual] = useState('menu');
  const [usuariosLideres, setUsuariosLideres] = useState([]);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    activo: true
  });

  useEffect(() => {
    if (vistaActual === 'crud') {
      cargarLideres();
    }
  }, [vistaActual]);

  const cargarLideres = async () => {
    try {
      const res = await jcfService.obtenerLideres();
      if (res.success) {
        setUsuariosLideres(res.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenModal = (lider = null) => {
    if (lider) {
      setFormData({
        nombre: lider.nombre || '',
        apellido: lider.apellido || '',
        email: lider.email || '',
        password: '',
        activo: lider.activo
      });
      setEditingId(lider.id);
    } else {
      setFormData({
        nombre: '',
        apellido: '',
        email: '',
        password: '',
        activo: true
      });
      setEditingId(null);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        // Petición para editar (si la implementas en el futuro)
        await axios.put(`/jcf/lideres/${editingId}`, formData);
      } else {
        // Petición POST real para crear el líder
        await axios.post('/jcf/lideres', formData);
      }
      
      handleCloseModal(); // Cierra la ventana
      cargarLideres();    // Vuelve a descargar la lista para que aparezca el nuevo
      
    } catch (error) {
      console.error('Error al guardar el líder:', error);
    }
  };

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
    color: 'var(--gray-900)', background: '#fff', outline: 'none'
  };

  if (vistaActual === 'crud') {
    return (
      <Layout>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
            <div>
              <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '26px', fontWeight: 800, color: 'var(--gray-900)', letterSpacing: '-0.02em', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Users style={{ width: '28px', height: '28px', color: 'var(--capyme-blue-mid)' }} />
                Usuarios Líderes
              </h1>
              <p style={{ fontSize: '14px', color: 'var(--gray-500)', fontFamily: "'DM Sans', sans-serif" }}>
                Gestión de líderes registrados en el sistema
              </p>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                onClick={() => setVistaActual('menu')}
                style={{ ...btnStyle, background: '#fff', color: 'var(--gray-700)', border: '1px solid var(--border)', boxShadow: 'none' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--gray-50)'}
                onMouseLeave={e => e.currentTarget.style.background = '#fff'}
              >
                <ArrowLeft style={{ width: '16px', height: '16px' }} /> Volver
              </button>
              <button 
                onClick={() => handleOpenModal()}
                style={btnStyle}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <Plus style={{ width: '16px', height: '16px' }} /> Nuevo Líder
              </button>
            </div>
          </div>

          <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'var(--gray-50)' }}>
                    {['ID', 'Nombre', 'Correo', 'Estado', 'Acciones'].map((h, i) => (
                      <th key={h} style={{ padding: '14px 24px', textAlign: i === 4 ? 'right' : 'left', fontSize: '11px', fontWeight: 700, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: "'Plus Jakarta Sans', sans-serif", borderBottom: '1px solid var(--border)', whiteSpace: 'nowrap' }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {usuariosLideres.map((usuario) => (
                    <tr 
                      key={usuario.id}
                      onMouseEnter={() => setHoveredRow(usuario.id)}
                      onMouseLeave={() => setHoveredRow(null)}
                      style={{ borderBottom: '1px solid var(--border)', transition: 'background 150ms ease', background: hoveredRow === usuario.id ? 'var(--gray-50)' : 'transparent' }}
                    >
                      <td style={{ padding: '14px 24px', fontSize: '13px', fontWeight: 600, color: 'var(--gray-900)', fontFamily: "'DM Sans', sans-serif" }}>
                        {usuario.id}
                      </td>
                      <td style={{ padding: '14px 24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{ width: '38px', height: '38px', borderRadius: 'var(--radius-md)', background: 'linear-gradient(135deg, var(--capyme-blue-mid), var(--capyme-blue))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '13px', fontWeight: 700, fontFamily: "'Plus Jakarta Sans', sans-serif", flexShrink: 0 }}>
                            {usuario.nombre?.charAt(0)?.toUpperCase()}{usuario.apellido?.charAt(0)?.toUpperCase()}
                          </div>
                          <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--gray-800)', fontFamily: "'DM Sans', sans-serif", margin: 0 }}>
                            {usuario.nombre} {usuario.apellido}
                          </p>
                        </div>
                      </td>
                      <td style={{ padding: '14px 24px' }}>
                        <p style={{ fontSize: '13px', color: 'var(--gray-700)', display: 'flex', alignItems: 'center', gap: '5px', margin: 0 }}>
                          <Mail style={{ width: '12px', height: '12px', color: 'var(--gray-400)' }} />
                          {usuario.email}
                        </p>
                      </td>
                      <td style={{ padding: '14px 24px' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '4px 10px', borderRadius: 'var(--radius-sm)', fontSize: '12px', fontWeight: 600, fontFamily: "'DM Sans', sans-serif", background: usuario.activo ? '#ECFDF5' : '#FEF2F2', color: usuario.activo ? '#065F46' : '#991B1B' }}>
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: usuario.activo ? '#10B981' : '#EF4444', display: 'inline-block' }} />
                          {usuario.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td style={{ padding: '14px 24px', textAlign: 'right' }}>
                        <button 
                          onClick={() => handleOpenModal(usuario)}
                          style={{ padding: '6px 14px', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', background: '#EEF4FF', color: 'var(--capyme-blue-mid)', fontSize: '12px', fontWeight: 600, fontFamily: "'DM Sans', sans-serif", cursor: 'pointer', transition: 'all 150ms ease' }}
                          onMouseEnter={e => { e.currentTarget.style.background = 'var(--capyme-blue-mid)'; e.currentTarget.style.color = '#fff'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = '#EEF4FF'; e.currentTarget.style.color = 'var(--capyme-blue-mid)'; }}
                        >
                          Editar
                        </button>
                      </td>
                    </tr>
                  ))}
                  {usuariosLideres.length === 0 && (
                    <tr>
                      <td colSpan="5" style={{ padding: '24px', textAlign: 'center', color: 'var(--gray-500)', fontSize: '14px', fontFamily: "'DM Sans', sans-serif" }}>
                        No hay líderes registrados.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {isModalOpen && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
            <div style={{ background: '#fff', borderRadius: 'var(--radius-lg)', width: '100%', maxWidth: '500px', boxShadow: '0 20px 60px rgba(0,0,0,0.18)', overflow: 'hidden' }}>
              <div style={{ padding: '20px 24px', background: 'var(--gray-50)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 800, fontFamily: "'Plus Jakarta Sans', sans-serif", color: 'var(--gray-900)' }}>
                  {editingId ? 'Editar Líder' : 'Nuevo Líder'}
                </h2>
                <button onClick={handleCloseModal} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--gray-400)' }}>
                  <X style={{ width: '20px', height: '20px' }} />
                </button>
              </div>

              <form onSubmit={handleSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--gray-700)', marginBottom: '6px', fontFamily: "'DM Sans', sans-serif" }}>Nombre</label>
                    <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--gray-700)', marginBottom: '6px', fontFamily: "'DM Sans', sans-serif" }}>Apellido</label>
                    <input type="text" name="apellido" value={formData.apellido} onChange={handleChange} required style={inputStyle} />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--gray-700)', marginBottom: '6px', fontFamily: "'DM Sans', sans-serif" }}>Correo Electrónico</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} required style={inputStyle} />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--gray-700)', marginBottom: '6px', fontFamily: "'DM Sans', sans-serif" }}>Contraseña {editingId && '(Dejar en blanco para no cambiar)'}</label>
                  <input type="password" name="password" value={formData.password} onChange={handleChange} required={!editingId} style={inputStyle} />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                  <input type="checkbox" name="activo" checked={formData.activo} onChange={handleChange} id="activoCheck" style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
                  <label htmlFor="activoCheck" style={{ fontSize: '14px', color: 'var(--gray-700)', fontFamily: "'DM Sans', sans-serif", cursor: 'pointer' }}>Usuario Activo</label>
                </div>

                <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                  <button type="button" onClick={handleCloseModal} style={{ padding: '10px 20px', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', background: '#fff', color: 'var(--gray-700)', fontSize: '14px', fontWeight: 600, fontFamily: "'DM Sans', sans-serif", cursor: 'pointer' }}>
                    Cancelar
                  </button>
                  <button type="submit" style={{ ...btnStyle, margin: 0 }}>
                    <Save style={{ width: '16px', height: '16px' }} />
                    {editingId ? 'Guardar Cambios' : 'Crear Líder'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </Layout>
    );
  }

  return (
    <Layout>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '70vh', gap: '24px' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '64px', height: '64px', background: '#EEF4FF', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: '0 4px 12px rgba(31,78,158,0.1)' }}>
            <Shield style={{ width: '32px', height: '32px', color: 'var(--capyme-blue-mid)' }} />
          </div>
          <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '28px', fontWeight: 800, color: 'var(--gray-900)', margin: '0 0 8px 0', letterSpacing: '-0.02em' }}>
            Dashboard Líder JCF
          </h1>
          <p style={{ fontSize: '15px', color: 'var(--gray-500)', fontFamily: "'DM Sans', sans-serif", maxWidth: '400px', margin: 0, lineHeight: 1.5 }}>
            Administra los usuarios líderes encargados de supervisar a los jóvenes de Construyendo el Futuro.
          </p>
        </div>
        
        <div style={{ width: '100%', maxWidth: '320px', marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <button
            onClick={() => setVistaActual('crud')}
            style={{ width: '100%', padding: '16px', background: 'linear-gradient(135deg, var(--capyme-blue-mid), var(--capyme-blue))', color: '#fff', border: 'none', borderRadius: 'var(--radius-lg)', fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '16px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 14px rgba(31,78,158,0.25)', transition: 'all 200ms ease', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <Users style={{ width: '20px', height: '20px' }} />
            Gestionar Líderes
          </button>

          <button
            onClick={() => navigate('/jcf/encargados')}
            style={{ width: '100%', padding: '16px', background: 'linear-gradient(135deg, #10B981, #059669)', color: '#fff', border: 'none', borderRadius: 'var(--radius-lg)', fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '16px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 14px rgba(16, 185, 129, 0.25)', transition: 'all 200ms ease', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <Users style={{ width: '20px', height: '20px' }} />
            Gestionar Encargados
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default AdminLiderDashboard;