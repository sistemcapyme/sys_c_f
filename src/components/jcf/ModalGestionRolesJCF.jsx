import React, { useState, useEffect } from 'react';
import { usuariosService } from '../../services/usuariosService';
import { 
  X, Plus, Users, Mail, Phone, Shield, User, 
  Eye, EyeOff, AlertCircle, ArrowRightLeft 
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const SectionTitle = ({ icon: Icon, text }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '4px' }}>
    <Icon style={{ width: '14px', height: '14px', color: 'var(--capyme-blue-mid)' }} />
    <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--capyme-blue-mid)', textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {text}
    </span>
    <div style={{ flex: 1, height: '1px', background: 'var(--border)', marginLeft: '4px' }} />
  </div>
);

const ErrorMsg = ({ text }) => (
  <p style={{ marginTop: '4px', fontSize: '12px', color: '#EF4444', display: 'flex', alignItems: 'center', gap: '4px', fontFamily: "'DM Sans', sans-serif" }}>
    <AlertCircle style={{ width: '12px', height: '12px' }} /> {text}
  </p>
);

const initialFormData = {
  nombre: '',
  apellido: '',
  email: '',
  password: '',
  telefono: ''
};

const ModalGestionRolesJCF = ({ config, onClose }) => {
  const [view, setView] = useState('list'); 
  const [usuarios, setUsuarios] = useState([]);
  const [candidatos, setCandidatos] = useState([]);
  const [candidatoId, setCandidatoId] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState(initialFormData);
  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (config.show) {
      if (view === 'list') {
        cargarUsuarios();
      } else if (view === 'assign') {
        cargarCandidatos();
      }
    }
  }, [config.show, config.rol, view]);

  const cargarUsuarios = async () => {
    try {
      setLoading(true);
      const res = await usuariosService.getAll({ rol: config.rol, activo: 'true' });
      setUsuarios(res.data || []);
    } catch (error) {
      toast.error('Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  const cargarCandidatos = async () => {
    try {
      setLoading(true);
      const res = await usuariosService.getAll({ activo: 'true' });
      const filtrados = (res.data || []).filter(u => u.rol !== config.rol && u.rol !== 'admin');
      setCandidatos(filtrados);
    } catch (error) {
      toast.error('Error al cargar candidatos');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.nombre.trim()) errors.nombre = 'El nombre es requerido';
    if (!formData.apellido.trim()) errors.apellido = 'El apellido es requerido';
    if (!formData.email.trim()) errors.email = 'El email es requerido';
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Email no válido';
    }
    if (!formData.password) errors.password = 'La contraseña es requerida';
    if (formData.password && formData.password.length < 6) {
      errors.password = 'Mínimo 6 caracteres';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      setSubmitting(true);
      const dataToSend = { ...formData, rol: config.rol };
      await usuariosService.create(dataToSend);
      toast.success(`${config.titulo} creado exitosamente`);
      setFormData(initialFormData);
      setView('list');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al crear usuario');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAssignSubmit = async (e) => {
    e.preventDefault();
    if (!candidatoId) {
      toast.error('Selecciona un usuario');
      return;
    }
    try {
      setSubmitting(true);
      await usuariosService.update(candidatoId, { rol: config.rol });
      toast.success(`Usuario asignado como ${config.titulo} exitosamente`);
      setCandidatoId('');
      setView('list');
    } catch (error) {
      toast.error('Error al asignar usuario');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) setFormErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const inputBaseStyle = {
    width: '100%', padding: '10px 12px', border: '1px solid var(--border)',
    borderRadius: 'var(--radius-md)', fontSize: '14px', fontFamily: "'DM Sans', sans-serif",
    color: 'var(--gray-900)', background: '#fff', outline: 'none', transition: 'all 200ms ease',
  };

  const inputWithIconStyle = { ...inputBaseStyle, paddingLeft: '38px' };
  const inputErrorStyle = { borderColor: '#EF4444', boxShadow: '0 0 0 2px rgba(239,68,68,0.15)' };

  const labelStyle = {
    display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--gray-600)',
    marginBottom: '6px', fontFamily: "'DM Sans', sans-serif",
  };

  const btnStyle = {
    display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', 
    background: 'linear-gradient(135deg, var(--capyme-blue-mid), var(--capyme-blue))', 
    color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', 
    fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '14px', fontWeight: 600, 
    cursor: 'pointer', boxShadow: '0 2px 8px rgba(31,78,158,0.28)', transition: 'all 200ms ease'
  };

  if (!config.show) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '16px' }}>
      <div style={{ background: '#fff', borderRadius: 'var(--radius-lg)', maxWidth: '700px', width: '100%', maxHeight: '90vh', display: 'flex', flexDirection: 'column', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', overflow: 'hidden', animation: 'modalIn 0.25s ease both' }} onClick={(e) => e.stopPropagation()}>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid var(--border)', background: 'var(--gray-50)' }}>
          <div>
            <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '18px', fontWeight: 800, color: 'var(--gray-900)', letterSpacing: '-0.01em' }}>
              Gestión de {config.titulo}
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--gray-400)', marginTop: '2px', fontFamily: "'DM Sans', sans-serif" }}>
              {view === 'list' ? `Administra los usuarios con acceso de ${config.titulo}` : view === 'create' ? `Registra un nuevo ${config.titulo}` : `Asigna un usuario existente como ${config.titulo}`}
            </p>
          </div>
          <button onClick={onClose} style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', borderRadius: 'var(--radius-sm)', background: 'transparent', cursor: 'pointer', color: 'var(--gray-400)', transition: 'all 150ms ease' }} onMouseEnter={e => { e.currentTarget.style.background = 'var(--gray-100)'; e.currentTarget.style.color = 'var(--gray-600)'; }} onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--gray-400)'; }}>
            <X style={{ width: '20px', height: '20px' }} />
          </button>
        </div>

        <div style={{ overflowY: 'auto', flex: 1, padding: '24px' }}>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
              <div style={{ width: '30px', height: '30px', border: '3px solid var(--border)', borderTopColor: 'var(--capyme-blue-mid)', borderRadius: '50%', animation: 'spin 700ms linear infinite' }} />
            </div>
          ) : view === 'list' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button onClick={() => setView('assign')} style={{ ...btnStyle, background: '#fff', color: 'var(--gray-700)', border: '1px solid var(--border)', boxShadow: 'none' }}>
                  <ArrowRightLeft style={{ width: '16px', height: '16px' }} /> Asignar Existente
                </button>
                <button onClick={() => setView('create')} style={btnStyle}>
                  <Plus style={{ width: '16px', height: '16px' }} /> Nuevo Registro
                </button>
              </div>

              <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: 'var(--gray-50)' }}>
                      <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: 'var(--gray-500)', textTransform: 'uppercase', fontFamily: "'Plus Jakarta Sans', sans-serif", borderBottom: '1px solid var(--border)' }}>Usuario</th>
                      <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: 'var(--gray-500)', textTransform: 'uppercase', fontFamily: "'Plus Jakarta Sans', sans-serif", borderBottom: '1px solid var(--border)' }}>Contacto</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usuarios.length > 0 ? usuarios.map(u => (
                      <tr key={u.id} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '12px 16px' }}>
                          <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--gray-800)', fontFamily: "'DM Sans', sans-serif", margin: 0 }}>{u.nombre} {u.apellido}</p>
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <p style={{ fontSize: '12px', color: 'var(--gray-600)', margin: 0 }}>{u.email}</p>
                          <p style={{ fontSize: '11px', color: 'var(--gray-400)', margin: 0 }}>{u.telefono || 'Sin teléfono'}</p>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="2" style={{ padding: '40px 16px', textAlign: 'center' }}>
                          <Users style={{ width: '30px', height: '30px', color: 'var(--gray-300)', margin: '0 auto 8px' }} />
                          <p style={{ fontSize: '13px', color: 'var(--gray-500)', margin: 0, fontFamily: "'DM Sans', sans-serif" }}>No hay {config.titulo} registrados</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : view === 'create' ? (
            <form id="createForm" onSubmit={handleCreateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <SectionTitle icon={User} text="Información Personal" />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>Nombre *</label>
                  <input type="text" value={formData.nombre} onChange={(e) => handleChange('nombre', e.target.value)} placeholder="Nombre" style={{ ...inputBaseStyle, ...(formErrors.nombre ? inputErrorStyle : {}) }} />
                  {formErrors.nombre && <ErrorMsg text={formErrors.nombre} />}
                </div>
                <div>
                  <label style={labelStyle}>Apellido *</label>
                  <input type="text" value={formData.apellido} onChange={(e) => handleChange('apellido', e.target.value)} placeholder="Apellido" style={{ ...inputBaseStyle, ...(formErrors.apellido ? inputErrorStyle : {}) }} />
                  {formErrors.apellido && <ErrorMsg text={formErrors.apellido} />}
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={labelStyle}>Email *</label>
                  <div style={{ position: 'relative' }}>
                    <Mail style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: 'var(--gray-400)' }} />
                    <input type="email" value={formData.email} onChange={(e) => handleChange('email', e.target.value)} placeholder="correo@ejemplo.com" style={{ ...inputWithIconStyle, ...(formErrors.email ? inputErrorStyle : {}) }} />
                  </div>
                  {formErrors.email && <ErrorMsg text={formErrors.email} />}
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={labelStyle}>Teléfono</label>
                  <div style={{ position: 'relative' }}>
                    <Phone style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: 'var(--gray-400)' }} />
                    <input type="tel" value={formData.telefono} onChange={(e) => handleChange('telefono', e.target.value)} placeholder="442 123 4567" style={inputWithIconStyle} />
                  </div>
                </div>
              </div>

              <SectionTitle icon={Shield} text="Acceso" />
              <div>
                <label style={labelStyle}>Contraseña *</label>
                <div style={{ position: 'relative' }}>
                  <input type={showPassword ? 'text' : 'password'} value={formData.password} onChange={(e) => handleChange('password', e.target.value)} placeholder="Mínimo 6 caracteres" style={{ ...inputBaseStyle, paddingRight: '42px', ...(formErrors.password ? inputErrorStyle : {}) }} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray-400)' }}>
                    {showPassword ? <EyeOff style={{ width: '16px', height: '16px' }} /> : <Eye style={{ width: '16px', height: '16px' }} />}
                  </button>
                </div>
                {formErrors.password && <ErrorMsg text={formErrors.password} />}
              </div>
            </form>
          ) : (
            <form id="assignForm" onSubmit={handleAssignSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <SectionTitle icon={ArrowRightLeft} text={`Promover a ${config.titulo}`} />
              <div>
                <label style={labelStyle}>Seleccionar Usuario Existente</label>
                <select value={candidatoId} onChange={(e) => setCandidatoId(e.target.value)} style={{ ...inputBaseStyle, cursor: 'pointer' }}>
                  <option value="">-- Elige un usuario --</option>
                  {candidatos.map(c => (
                    <option key={c.id} value={c.id}>{c.nombre} {c.apellido} ({c.email}) - Actual: {c.rol}</option>
                  ))}
                </select>
                <p style={{ marginTop: '8px', fontSize: '12px', color: 'var(--gray-500)', fontFamily: "'DM Sans', sans-serif", lineHeight: 1.5 }}>
                  Al asignar a este usuario, su rol cambiará a <strong>{config.titulo}</strong> y obtendrá los permisos correspondientes en este módulo.
                </p>
              </div>
            </form>
          )}
        </div>

        {view !== 'list' && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px', padding: '16px 24px', borderTop: '1px solid var(--border)', background: 'var(--gray-50)' }}>
            <button type="button" onClick={() => { setView('list'); setFormErrors({}); }} disabled={submitting} style={{ padding: '10px 20px', fontSize: '14px', fontWeight: 600, fontFamily: "'Plus Jakarta Sans', sans-serif", color: 'var(--gray-600)', background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', cursor: submitting ? 'not-allowed' : 'pointer' }}>
              Atrás
            </button>
            <button type="submit" form={view === 'create' ? 'createForm' : 'assignForm'} disabled={submitting} style={{ ...btnStyle, opacity: submitting ? 0.6 : 1, cursor: submitting ? 'not-allowed' : 'pointer' }}>
              {submitting ? 'Procesando...' : view === 'create' ? 'Crear Usuario' : 'Asignar Usuario'}
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default ModalGestionRolesJCF;