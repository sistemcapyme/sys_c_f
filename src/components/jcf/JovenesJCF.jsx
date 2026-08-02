import React, { useState, useEffect } from 'react';
import Layout from '../common/Layout';
import { jcfService } from '../../services/jcfService';
import { toast } from 'react-hot-toast';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Users, Plus, Search, Edit, Trash2, X, Briefcase, Link as LinkIcon,
  Image as ImageIcon, UserCheck, LayoutDashboard, UsersRound, AlertTriangle
} from 'lucide-react';

const ROLES_ENCARGABLES = ['admin', 'lider_jcf', 'encargado_jcf'];

const ConfirmModal = ({ config, onClose }) => {
  if (!config?.show) return null;
  const isDanger  = config.variant === 'danger';
  const isWarning = config.variant === 'warning';

  const accentBg     = isDanger ? '#FEF2F2' : isWarning ? '#FFFBEB' : '#EEF4FF';
  const accentBorder = isDanger ? '#FECACA' : isWarning ? '#FDE68A' : 'var(--border)';
  const iconBg       = isDanger ? '#EF4444' : isWarning ? '#F59E0B' : 'var(--capyme-blue-mid)';
  const titleColor   = isDanger ? '#B91C1C' : isWarning ? '#92400E' : 'var(--gray-900)';
  const subtitleColor= isDanger ? '#DC2626' : isWarning ? '#B45309' : 'var(--gray-500)';
  const btnBg        = isDanger
    ? 'linear-gradient(135deg,#EF4444,#DC2626)'
    : isWarning
      ? 'linear-gradient(135deg,#F59E0B,#D97706)'
      : 'linear-gradient(135deg,var(--capyme-blue-mid),var(--capyme-blue))';
  const btnShadow    = isDanger
    ? '0 2px 8px rgba(239,68,68,0.35)'
    : isWarning
      ? '0 2px 8px rgba(245,158,11,0.35)'
      : '0 2px 8px rgba(31,78,158,0.28)';

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.45)', backdropFilter:'blur(4px)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1200, padding:'20px' }}>
      <div onClick={e => e.stopPropagation()} style={{ background:'#fff', borderRadius:'var(--radius-lg)', width:'100%', maxWidth:'440px', boxShadow:'0 24px 64px rgba(0,0,0,0.22)', overflow:'hidden', animation:'modalIn 0.22s ease both' }}>
        <div style={{ background:accentBg, padding:'20px 24px', borderBottom:`1px solid ${accentBorder}`, display:'flex', alignItems:'center', gap:'14px' }}>
          <div style={{ width:'44px', height:'44px', background:iconBg, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, boxShadow:`0 4px 12px ${iconBg}40` }}>
            <AlertTriangle style={{ width:'22px', height:'22px', color:'#fff' }} />
          </div>
          <div>
            <h3 style={{ fontSize:'17px', fontWeight:800, color:titleColor, fontFamily:"'Plus Jakarta Sans', sans-serif", margin:'0 0 2px' }}>
              {config.title}
            </h3>
            <p style={{ fontSize:'13px', color:subtitleColor, margin:0, fontFamily:"'DM Sans', sans-serif", fontWeight:500 }}>
              {config.subtitle || 'Esta acción puede revertirse más adelante'}
            </p>
          </div>
        </div>
        <div style={{ padding:'20px 24px' }}>
          {config.message && (
            <div style={{ background:'var(--gray-50)', border:'1px solid var(--border)', borderRadius:'var(--radius-md)', padding:'14px 16px', marginBottom:'20px' }}>
              <p style={{ fontSize:'14px', color:'var(--gray-700)', margin:0, fontFamily:"'DM Sans', sans-serif", lineHeight:1.5 }}>
                {config.message}
              </p>
            </div>
          )}
          <div style={{ display:'flex', gap:'10px', justifyContent:'flex-end' }}>
            <button onClick={onClose} style={{ padding:'9px 18px', border:'1px solid var(--border)', borderRadius:'var(--radius-md)', background:'#fff', color:'var(--gray-700)', fontSize:'14px', fontWeight:600, fontFamily:"'DM Sans', sans-serif", cursor:'pointer', transition:'all 150ms ease' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--gray-100)'} onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
              Cancelar
            </button>
            <button onClick={() => { config.onConfirm(); onClose(); }} style={{ padding:'9px 22px', border:'none', borderRadius:'var(--radius-md)', background:btnBg, color:'#fff', fontSize:'14px', fontWeight:600, fontFamily:"'DM Sans', sans-serif", cursor:'pointer', boxShadow:btnShadow, transition:'all 150ms ease' }} onMouseEnter={e => e.currentTarget.style.opacity = '0.9'} onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
              {config.confirmLabel || 'Confirmar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const SectionTitle = ({ icon: Icon, text }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '4px' }}>
    <Icon style={{ width: '16px', height: '16px', color: 'var(--capyme-blue-mid)' }} />
    <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--capyme-blue-mid)', textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {text}
    </span>
    <div style={{ flex: 1, height: '1px', background: 'var(--border)', marginLeft: '4px' }} />
  </div>
);

const ErrorMsg = ({ text }) => (
  <p style={{ marginTop: '4px', fontSize: '12px', color: '#EF4444', display: 'flex', alignItems: 'center', gap: '4px', fontFamily: "'DM Sans', sans-serif", margin: 0 }}>
    <AlertTriangle style={{ width: '12px', height: '12px' }} /> {text}
  </p>
);

const initialFormData = {
  nombreCompleto: '',
  linkPapeles: '',
  credencialesJcf: '',
  nombreNegocio: '',
  linkImagenNegocio: '',
  encargadoId: ''
};

const JovenesJCF = () => {
  const authStorage = JSON.parse(localStorage.getItem('auth-storage') || '{}');
  const currentUser = authStorage?.state?.user || {};
  const isAdminOrLider = currentUser.rol === 'admin' || currentUser.rol === 'lider' || currentUser.rol === 'lider_jcf';

  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  const [jovenes, setJovenes] = useState([]);
  const [encargados, setEncargados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedJoven, setSelectedJoven] = useState(null);

  const [formData, setFormData] = useState(initialFormData);
  const [formErrors, setFormErrors] = useState({});
  const [hoveredRow, setHoveredRow] = useState(null);

  const [confirmConfig, setConfirmConfig] = useState({ show: false });
  const showConfirm = (cfg) => setConfirmConfig({ show: true, ...cfg });
  const closeConfirm = () => setConfirmConfig({ show: false });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const resJovenes = await jcfService.obtenerAprendices();
      const arrJovenes = Array.isArray(resJovenes) ? resJovenes : (resJovenes?.data && Array.isArray(resJovenes.data) ? resJovenes.data : []);
      setJovenes(arrJovenes);

      const resEncargados = await jcfService.obtenerEncargadosValidos();
      const arrEncargados = Array.isArray(resEncargados) ? resEncargados : (resEncargados?.data && Array.isArray(resEncargados.data) ? resEncargados.data : []);
      setEncargados(arrEncargados);
    } catch (error) {
      toast.error('Error al cargar datos');
      setJovenes([]);
      setEncargados([]);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.nombreCompleto.trim()) errors.nombreCompleto = 'El nombre es requerido';
    if (!formData.linkPapeles.trim()) errors.linkPapeles = 'El link es requerido';
    if (!formData.credencialesJcf.trim()) errors.credencialesJcf = 'El usuario y contraseña son requeridos';
    if (!formData.nombreNegocio.trim()) errors.nombreNegocio = 'El negocio es requerido';
    if (!formData.linkImagenNegocio.trim()) errors.linkImagenNegocio = 'El link de la imagen es requerido';
    if (!formData.encargadoId) errors.encargadoId = 'Debe seleccionar un encargado';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const isFormValid = formData.nombreCompleto.trim() !== '' &&
                      formData.linkPapeles.trim() !== '' &&
                      formData.credencialesJcf.trim() !== '' &&
                      formData.nombreNegocio.trim() !== '' &&
                      formData.linkImagenNegocio.trim() !== '' &&
                      String(formData.encargadoId).trim() !== '';

  const handleOpenModal = (mode, joven = null) => {
    setModalMode(mode);
    setSelectedJoven(joven);
    setFormErrors({});
    if (mode === 'edit' && joven) {
      setFormData({
        nombreCompleto: joven.nombreCompleto || `${joven.nombre || ''} ${joven.apellido || ''}`.trim() || '',
        linkPapeles: joven.linkPapeles || joven.linkDocumentos || '',
        credencialesJcf: joven.credencialesJcf || joven.passwordPrograma || '',
        nombreNegocio: joven.nombreNegocio || joven.linkNegocio || '',
        linkImagenNegocio: joven.linkImagenNegocio || '',
        encargadoId: joven.encargadoId || ''
      });
    } else {
      setFormData({ ...initialFormData });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedJoven(null);
    setFormErrors({});
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      setSubmitting(true);
      const payload = {
        nombreCompleto: formData.nombreCompleto,
        linkPapeles: formData.linkPapeles,
        credencialesJcf: formData.credencialesJcf,
        nombreNegocio: formData.nombreNegocio,
        linkImagenNegocio: formData.linkImagenNegocio,
        encargadoId: parseInt(formData.encargadoId, 10)
      };
      if (modalMode === 'create') {
        await jcfService.crearAprendiz(payload);
        toast.success('Registro creado exitosamente');
      } else {
        await jcfService.actualizarAprendiz(selectedJoven.id, payload);
        toast.success('Registro actualizado exitosamente');
      }
      handleCloseModal();
      cargarDatos();
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.response?.data?.error || 'Error al guardar registro');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEliminar = (joven) => {
    const nombreMostrar = joven.nombreCompleto || `${joven.nombre || ''} ${joven.apellido || ''}`.trim() || 'Este registro';
    showConfirm({
      variant: 'danger',
      title: 'Eliminar registro',
      subtitle: 'Esta acción no se puede revertir',
      message: `¿Confirmas que deseas eliminar a "${nombreMostrar}"?`,
      confirmLabel: 'Sí, eliminar',
      onConfirm: async () => {
        try {
          await jcfService.eliminarAprendiz(joven.id);
          toast.success('Registro eliminado exitosamente');
          cargarDatos();
        } catch (error) {
          toast.error('Error al eliminar registro');
        }
      },
    });
  };

  const safeJovenes = Array.isArray(jovenes) ? jovenes : [];
  const safeEncargados = Array.isArray(encargados) ? encargados : [];

  const jovenesFiltrados = safeJovenes.filter(j => {
    const nombreCompleto = j.nombreCompleto || `${j.nombre || ''} ${j.apellido || ''}`.trim();
    const negocio = j.nombreNegocio || j.linkNegocio || '';
    return nombreCompleto.toLowerCase().includes(searchTerm.toLowerCase()) ||
           negocio.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const inputBaseStyle = {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-md)',
    fontSize: '14px',
    fontFamily: "'DM Sans', sans-serif",
    color: 'var(--gray-900)',
    background: '#fff',
    outline: 'none',
    transition: 'all 200ms ease'
  };

  const inputErrorStyle = {
    borderColor: '#EF4444',
    background: '#FEF2F2'
  };

  const labelStyle = {
    display: 'block',
    fontSize: '13px',
    fontWeight: 600,
    color: 'var(--gray-600)',
    marginBottom: '6px',
    fontFamily: "'DM Sans', sans-serif"
  };

  const selectStyle = {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-md)',
    fontSize: '14px',
    fontFamily: "'DM Sans', sans-serif",
    color: 'var(--gray-900)',
    background: '#fff',
    outline: 'none',
    cursor: 'pointer',
    transition: 'all 200ms ease'
  };

  if (!isAdminOrLider) {
    return (
      <Layout>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', flexDirection: 'column', gap: '16px' }}>
          <AlertTriangle style={{ width: '48px', height: '48px', color: '#F59E0B' }} />
          <h2 style={{ fontSize: '20px', fontWeight: 800, fontFamily: "'Plus Jakarta Sans', sans-serif", color: 'var(--gray-900)' }}>Acceso Denegado</h2>
          <p style={{ fontSize: '14px', fontFamily: "'DM Sans', sans-serif", color: 'var(--gray-500)' }}>No tienes permisos para acceder a esta sección</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 800, fontFamily: "'Plus Jakarta Sans', sans-serif", color: 'var(--gray-900)', margin: 0 }}>
              Distribución de Jóvenes
            </h1>
            <p style={{ fontSize: '14px', color: 'var(--gray-500)', marginTop: '4px', fontFamily: "'DM Sans', sans-serif" }}>
              Gestiona el registro y distribución de jóvenes en el programa JCF
            </p>
          </div>
          {isAdminOrLider && (
            <button onClick={() => handleOpenModal('create')} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: 'linear-gradient(135deg, var(--capyme-blue-mid), var(--capyme-blue))', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', fontSize: '14px', fontWeight: 600, fontFamily: "'Plus Jakarta Sans', sans-serif", cursor: 'pointer', boxShadow: '0 2px 8px rgba(31,78,158,0.28)', transition: 'all 150ms ease' }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
              <Plus style={{ width: '18px', height: '18px' }} />
              Registrar Joven JCF
            </button>
          )}
        </div>

        <div style={{ background: '#fff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 20px', borderBottom: '1px solid var(--border)', background: 'var(--gray-50)' }}>
            <Search style={{ width: '18px', height: '18px', color: 'var(--gray-400)' }} />
            <input type="text" placeholder="Buscar por nombre o negocio..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ flex: 1, border: 'none', background: 'transparent', fontSize: '14px', fontFamily: "'DM Sans', sans-serif", color: 'var(--gray-900)', outline: 'none' }} />
          </div>

          {loading ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 20px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: '40px', height: '40px', border: '3px solid var(--border)', borderTopColor: 'var(--capyme-blue-mid)', borderRadius: '50%', animation: 'spin 700ms linear infinite', margin: '0 auto 16px' }} />
                <p style={{ fontSize: '14px', color: 'var(--gray-500)', fontFamily: "'DM Sans', sans-serif" }}>Cargando registros...</p>
              </div>
            </div>
          ) : jovenesFiltrados.length === 0 ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', flexDirection: 'column', gap: '16px' }}>
              <Users style={{ width: '48px', height: '48px', color: 'var(--gray-300)' }} />
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '16px', fontWeight: 600, color: 'var(--gray-700)', fontFamily: "'Plus Jakarta Sans', sans-serif", margin: 0 }}>
                  {searchTerm ? 'Sin resultados' : 'No hay registros'}
                </p>
                <p style={{ fontSize: '14px', color: 'var(--gray-500)', marginTop: '4px', fontFamily: "'DM Sans', sans-serif" }}>
                  {searchTerm ? 'Intenta con otro término de búsqueda' : 'Crea tu primer registro para comenzar'}
                </p>
              </div>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'var(--gray-50)', borderBottom: '1px solid var(--border)' }}>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 700, color: 'var(--gray-600)', textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: "'DM Sans', sans-serif" }}>Nombre</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 700, color: 'var(--gray-600)', textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: "'DM Sans', sans-serif" }}>Negocio</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 700, color: 'var(--gray-600)', textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: "'DM Sans', sans-serif" }}>Encargado</th>
                    <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '12px', fontWeight: 700, color: 'var(--gray-600)', textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: "'DM Sans', sans-serif" }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {jovenesFiltrados.map((joven, idx) => {
                    const nombreCompleto = joven.nombreCompleto || `${joven.nombre || ''} ${joven.apellido || ''}`.trim();
                    const negocio = joven.nombreNegocio || joven.linkNegocio || '-';
                    const encargado = joven.encargado ? `${joven.encargado.nombre} ${joven.encargado.apellido}` : '-';
                    return (
                      <tr
                        key={joven.id || idx}
                        onMouseEnter={() => setHoveredRow(joven.id)}
                        onMouseLeave={() => setHoveredRow(null)}
                        style={{
                          background: hoveredRow === joven.id ? 'var(--gray-50)' : '#fff',
                          borderBottom: '1px solid var(--border)',
                          transition: 'all 150ms ease'
                        }}
                      >
                        <td style={{ padding: '14px 16px', fontSize: '14px', color: 'var(--gray-900)', fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}>
                          {nombreCompleto}
                        </td>
                        <td style={{ padding: '14px 16px', fontSize: '14px', color: 'var(--gray-700)', fontFamily: "'DM Sans', sans-serif" }}>
                          {negocio}
                        </td>
                        <td style={{ padding: '14px 16px', fontSize: '14px', color: 'var(--gray-700)', fontFamily: "'DM Sans', sans-serif" }}>
                          {encargado}
                        </td>
                        <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                            {hoveredRow === joven.id && (
                              <>
                                <button onClick={() => handleOpenModal('edit', joven)} style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', background: 'var(--capyme-blue-mid)', borderRadius: 'var(--radius-sm)', color: '#fff', cursor: 'pointer', transition: 'all 150ms ease' }} onMouseEnter={e => e.currentTarget.style.opacity = '0.8'} onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
                                  <Edit style={{ width: '16px', height: '16px' }} />
                                </button>
                                <button onClick={() => handleEliminar(joven)} style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', background: '#EF4444', borderRadius: 'var(--radius-sm)', color: '#fff', cursor: 'pointer', transition: 'all 150ms ease' }} onMouseEnter={e => e.currentTarget.style.opacity = '0.8'} onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
                                  <Trash2 style={{ width: '16px', height: '16px' }} />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }} onClick={handleCloseModal}>
          <div style={{ background: '#fff', borderRadius: 'var(--radius-lg)', maxWidth: '600px', width: '100%', maxHeight: '90vh', display: 'flex', flexDirection: 'column', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', overflow: 'hidden', animation: 'modalIn 0.25s ease both' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid var(--border)', background: 'var(--gray-50)' }}>
              <div>
                <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '18px', fontWeight: 800, color: 'var(--gray-900)', letterSpacing: '-0.01em', margin: 0 }}>
                  {modalMode === 'create' ? 'Registrar Joven JCF' : 'Editar Joven JCF'}
                </h2>
                <p style={{ fontSize: '13px', color: 'var(--gray-400)', marginTop: '2px', fontFamily: "'DM Sans', sans-serif", margin: '4px 0 0 0' }}>
                  Complete los datos requeridos para la distribución.
                </p>
              </div>
              <button onClick={handleCloseModal} style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', borderRadius: 'var(--radius-sm)', background: 'transparent', cursor: 'pointer', color: 'var(--gray-400)', transition: 'all 150ms ease' }} onMouseEnter={e => { e.currentTarget.style.background = 'var(--gray-100)'; e.currentTarget.style.color = 'var(--gray-600)'; }} onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--gray-400)'; }}>
                <X style={{ width: '20px', height: '20px' }} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ overflowY: 'auto', flex: 1, padding: '24px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <SectionTitle icon={Users} text="Información del Joven" />

                <div>
                  <label style={labelStyle}>Nombre Completo *</label>
                  <input type="text" value={formData.nombreCompleto} onChange={(e) => handleChange('nombreCompleto', e.target.value)} placeholder="Ej. Juan Pérez" style={{ ...inputBaseStyle, ...(formErrors.nombreCompleto ? inputErrorStyle : {}) }} onFocus={e => { if (!formErrors.nombreCompleto) { e.target.style.borderColor = 'var(--capyme-blue-mid)'; e.target.style.boxShadow = '0 0 0 3px rgba(43,91,166,0.12)'; } }} onBlur={e => { if (!formErrors.nombreCompleto) { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; } }} />
                  {formErrors.nombreCompleto && <ErrorMsg text={formErrors.nombreCompleto} />}
                </div>

                <div>
                  <label style={labelStyle}>Link de Papeles del Joven *</label>
                  <input type="url" value={formData.linkPapeles} onChange={(e) => handleChange('linkPapeles', e.target.value)} placeholder="www.drive.google.com..." style={{ ...inputBaseStyle, ...(formErrors.linkPapeles ? inputErrorStyle : {}) }} onFocus={e => { if (!formErrors.linkPapeles) { e.target.style.borderColor = 'var(--capyme-blue-mid)'; e.target.style.boxShadow = '0 0 0 3px rgba(43,91,166,0.12)'; } }} onBlur={e => { if (!formErrors.linkPapeles) { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; } }} />
                  {formErrors.linkPapeles && <ErrorMsg text={formErrors.linkPapeles} />}
                </div>

                <div>
                  <label style={labelStyle}>Usuario y Contraseña Plataforma JCF *</label>
                  <textarea value={formData.credencialesJcf} onChange={(e) => handleChange('credencialesJcf', e.target.value)} placeholder="Usuario: ... Contraseña: ..." rows="3" style={{ ...inputBaseStyle, resize: 'vertical', ...(formErrors.credencialesJcf ? inputErrorStyle : {}) }} onFocus={e => { if (!formErrors.credencialesJcf) { e.target.style.borderColor = 'var(--capyme-blue-mid)'; e.target.style.boxShadow = '0 0 0 3px rgba(43,91,166,0.12)'; } }} onBlur={e => { if (!formErrors.credencialesJcf) { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; } }} />
                  {formErrors.credencialesJcf && <ErrorMsg text={formErrors.credencialesJcf} />}
                </div>

                <div style={{ margin: '12px 0' }}>
                  <SectionTitle icon={Briefcase} text="Información del Negocio" />
                </div>

                <div>
                  <label style={labelStyle}>Nombre del Negocio *</label>
                  <input type="text" value={formData.nombreNegocio} onChange={(e) => handleChange('nombreNegocio', e.target.value)} placeholder="Ej. Abarrotes La Esperanza" style={{ ...inputBaseStyle, ...(formErrors.nombreNegocio ? inputErrorStyle : {}) }} onFocus={e => { if (!formErrors.nombreNegocio) { e.target.style.borderColor = 'var(--capyme-blue-mid)'; e.target.style.boxShadow = '0 0 0 3px rgba(43,91,166,0.12)'; } }} onBlur={e => { if (!formErrors.nombreNegocio) { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; } }} />
                  {formErrors.nombreNegocio && <ErrorMsg text={formErrors.nombreNegocio} />}
                </div>

                <div>
                  <label style={labelStyle}>Link de Imagen de la Información del Negocio *</label>
                  <input type="url" value={formData.linkImagenNegocio} onChange={(e) => handleChange('linkImagenNegocio', e.target.value)} placeholder="www.drive.google.com..." style={{ ...inputBaseStyle, ...(formErrors.linkImagenNegocio ? inputErrorStyle : {}) }} onFocus={e => { if (!formErrors.linkImagenNegocio) { e.target.style.borderColor = 'var(--capyme-blue-mid)'; e.target.style.boxShadow = '0 0 0 3px rgba(43,91,166,0.12)'; } }} onBlur={e => { if (!formErrors.linkImagenNegocio) { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; } }} />
                  {formErrors.linkImagenNegocio && <ErrorMsg text={formErrors.linkImagenNegocio} />}
                </div>

                <div style={{ margin: '16px 0 8px 0', padding: '20px', background: '#F0FDF4', border: '2px solid #16A34A', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                    <UserCheck style={{ width: '22px', height: '22px', color: '#16A34A' }} />
                    <span style={{ fontSize: '15px', fontWeight: 800, color: '#16A34A', textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      Asignación de Encargado
                    </span>
                  </div>

                  <div>
                    <label style={{ ...labelStyle, color: '#15803D' }}>Encargarlo a: *</label>
                    <div style={{ position: 'relative' }}>
                      <select value={formData.encargadoId} onChange={(e) => handleChange('encargadoId', e.target.value)} style={{ ...selectStyle, borderColor: '#16A34A', borderWidth: '2px', ...(formErrors.encargadoId ? inputErrorStyle : {}) }}>
                        <option value="">Seleccione un encargado de la lista...</option>
                        {safeEncargados.map((encargado) => (
                          <option key={encargado.id} value={encargado.id}>
                            {encargado.nombre} {encargado.apellido}
                          </option>
                        ))}
                      </select>
                    </div>
                    {formErrors.encargadoId && <ErrorMsg text={formErrors.encargadoId} />}
                  </div>
                </div>

              </div>
            </form>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px', padding: '16px 24px', borderTop: '1px solid var(--border)', background: 'var(--gray-50)' }}>
              <button type="button" onClick={handleCloseModal} disabled={submitting} style={{ padding: '10px 20px', fontSize: '14px', fontWeight: 600, fontFamily: "'Plus Jakarta Sans', sans-serif", color: 'var(--gray-600)', background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.5 : 1, transition: 'all 150ms ease' }} onMouseEnter={e => { if (!submitting) e.currentTarget.style.background = 'var(--gray-50)'; }} onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
                Cancelar
              </button>
              <button type="submit" onClick={handleSubmit} disabled={submitting || Object.keys(formErrors).length > 0 || !isFormValid} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 24px', fontSize: '14px', fontWeight: 600, fontFamily: "'Plus Jakarta Sans', sans-serif", color: '#fff', background: 'linear-gradient(135deg, var(--capyme-blue-mid), var(--capyme-blue))', border: 'none', borderRadius: 'var(--radius-md)', cursor: submitting || Object.keys(formErrors).length > 0 || !isFormValid ? 'not-allowed' : 'pointer', opacity: submitting || Object.keys(formErrors).length > 0 || !isFormValid ? 0.6 : 1, boxShadow: '0 2px 8px rgba(31,78,158,0.28)', transition: 'all 200ms ease' }} onMouseEnter={e => { if (!submitting && isFormValid && Object.keys(formErrors).length === 0) e.currentTarget.style.transform = 'translateY(-1px)'; }} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                {submitting && <div style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 700ms linear infinite' }} />}
                {modalMode === 'create' ? 'Guardar Registro' : 'Guardar Cambios'}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal config={confirmConfig} onClose={closeConfirm} />
    </Layout>
  );
};

export default JovenesJCF;