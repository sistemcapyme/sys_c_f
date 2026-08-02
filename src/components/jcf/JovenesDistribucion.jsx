import { useState, useEffect } from 'react';
import Layout from '../common/Layout';
import { useNavigate } from 'react-router-dom';
import { jcfService } from '../../services/jcfService';
import {
  Users, UserCheck, LayoutDashboard, UsersRound, Plus, Search, Edit, Trash2, X,
  ChevronDown, AlertCircle, CheckCircle, Eye, Shield, User, AlertTriangle, Briefcase, Link2
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const ROLES_ENCARGABLES = ['admin', 'lider_jcf', 'encargado_jcf'];

const initialFormData = {
  nombre: '',
  apellido: '',
  nombreNegocio: '',
  linkNegocio: '',
  estadoKanban: 'ENCARGADO',
  encargadoId: ''
};

const ConfirmModal = ({ config, onClose }) => {
  if (!config?.show) return null;
  const isDanger = config.variant === 'danger';
  const isWarning = config.variant === 'warning';

  const accentBg = isDanger ? '#FEF2F2' : isWarning ? '#FFFBEB' : '#EEF4FF';
  const accentBorder = isDanger ? '#FECACA' : isWarning ? '#FDE68A' : 'var(--border)';
  const iconBg = isDanger ? '#EF4444' : isWarning ? '#F59E0B' : 'var(--capyme-blue-mid)';
  const titleColor = isDanger ? '#B91C1C' : isWarning ? '#92400E' : 'var(--gray-900)';
  const subtitleColor = isDanger ? '#DC2626' : isWarning ? '#B45309' : 'var(--gray-500)';
  const btnBg = isDanger
    ? 'linear-gradient(135deg,#EF4444,#DC2626)'
    : isWarning
      ? 'linear-gradient(135deg,#F59E0B,#D97706)'
      : 'linear-gradient(135deg,var(--capyme-blue-mid),var(--capyme-blue))';
  const btnShadow = isDanger
    ? '0 2px 8px rgba(239,68,68,0.35)'
    : isWarning
      ? '0 2px 8px rgba(245,158,11,0.35)'
      : '0 2px 8px rgba(31,78,158,0.28)';

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1200, padding: '20px' }}>
      <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 'var(--radius-lg)', width: '100%', maxWidth: '440px', boxShadow: '0 24px 64px rgba(0,0,0,0.22)', overflow: 'hidden', animation: 'modalIn 0.22s ease both' }}>
        <div style={{ background: accentBg, padding: '20px 24px', borderBottom: `1px solid ${accentBorder}`, display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '44px', height: '44px', background: iconBg, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: `0 4px 12px ${iconBg}40` }}>
            <AlertTriangle style={{ width: '22px', height: '22px', color: '#fff' }} />
          </div>
          <div>
            <h3 style={{ fontSize: '17px', fontWeight: 800, color: titleColor, fontFamily: "'Plus Jakarta Sans', sans-serif", margin: '0 0 2px' }}>
              {config.title}
            </h3>
            <p style={{ fontSize: '13px', color: subtitleColor, margin: 0, fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}>
              {config.subtitle || 'Esta acción puede revertirse más adelante'}
            </p>
          </div>
        </div>
        <div style={{ padding: '20px 24px' }}>
          {config.message && (
            <div style={{ background: 'var(--gray-50)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '14px 16px', marginBottom: '20px' }}>
              <p style={{ fontSize: '14px', color: 'var(--gray-700)', margin: 0, fontFamily: "'DM Sans', sans-serif", lineHeight: 1.5 }}>
                {config.message}
              </p>
            </div>
          )}
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button onClick={onClose} style={{ padding: '9px 18px', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', background: '#fff', color: 'var(--gray-700)', fontSize: '14px', fontWeight: 600, fontFamily: "'DM Sans', sans-serif", cursor: 'pointer', transition: 'all 150ms ease' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--gray-100)'} onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
              Cancelar
            </button>
            <button onClick={() => { config.onConfirm(); onClose(); }} style={{ padding: '9px 22px', border: 'none', borderRadius: 'var(--radius-md)', background: btnBg, color: '#fff', fontSize: '14px', fontWeight: 600, fontFamily: "'DM Sans', sans-serif", cursor: 'pointer', boxShadow: btnShadow, transition: 'all 150ms ease' }} onMouseEnter={e => e.currentTarget.style.opacity = '0.9'} onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
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
    <Icon style={{ width: '14px', height: '14px', color: 'var(--capyme-blue-mid)' }} />
    <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--capyme-blue-mid)', textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {text}
    </span>
    <div style={{ flex: 1, height: '1px', background: 'var(--border)', marginLeft: '4px' }} />
  </div>
);

const InfoRow = ({ label, value, icon: Icon, isLink }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
    <span style={{ fontSize: '12px', color: 'var(--gray-500)', fontWeight: 600, fontFamily: "'DM Sans', sans-serif", display: 'flex', alignItems: 'center', gap: '5px' }}>
      {Icon && <Icon style={{ width: '13px', height: '13px', color: 'var(--gray-400)' }} />}
      {label}
    </span>
    {isLink && value ? (
      <a href={value} target="_blank" rel="noopener noreferrer" style={{ fontSize: '14px', color: 'var(--capyme-blue-mid)', fontFamily: "'DM Sans', sans-serif", fontWeight: 500, textDecoration: 'none' }}>
        Ver enlace
      </a>
    ) : (
      <span style={{ fontSize: '14px', color: value ? 'var(--gray-900)' : 'var(--gray-400)', fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}>
        {value || '—'}
      </span>
    )}
  </div>
);

const ErrorMsg = ({ text }) => (
  <p style={{ marginTop: '4px', fontSize: '12px', color: '#EF4444', display: 'flex', alignItems: 'center', gap: '4px', fontFamily: "'DM Sans', sans-serif" }}>
    <AlertCircle style={{ width: '12px', height: '12px' }} /> {text}
  </p>
);

const JovenesDistribucion = () => {
  const navigate = useNavigate();

  const [jovenes, setJovenes] = useState([]);
  const [encargados, setEncargados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedJoven, setSelectedJoven] = useState(null);

  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [detailsItem, setDetailsItem] = useState(null);
  const [hoveredRow, setHoveredRow] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState('');

  const [formData, setFormData] = useState(initialFormData);
  const [formErrors, setFormErrors] = useState({});

  const [confirmConfig, setConfirmConfig] = useState({ show: false });
  const showConfirm = (cfg) => setConfirmConfig({ show: true, ...cfg });
  const closeConfirm = () => setConfirmConfig({ show: false });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);

      const resJovenes = await jcfService.obtenerTodosAprendices();
      const jovenesArray = Array.isArray(resJovenes) ? resJovenes : (resJovenes?.data && Array.isArray(resJovenes.data) ? resJovenes.data : []);
      setJovenes(jovenesArray);

      const resEncargados = await jcfService.obtenerEncargados();
      const encargadosArray = Array.isArray(resEncargados) ? resEncargados : (resEncargados?.data && Array.isArray(resEncargados.data) ? resEncargados.data : []);
      setEncargados(encargadosArray.filter(u => ROLES_ENCARGABLES.includes(u.rol)));
    } catch (error) {
      toast.error('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.nombre.trim()) errors.nombre = 'El nombre es requerido';
    if (!formData.apellido.trim()) errors.apellido = 'El apellido es requerido';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const isFormValid = formData.nombre.trim() !== '' && formData.apellido.trim() !== '';

  const handleOpenModal = (mode, joven = null) => {
    setModalMode(mode);
    setSelectedJoven(joven);
    setFormErrors({});
    if (mode === 'edit' && joven) {
      setFormData({
        nombre: joven.nombre || '',
        apellido: joven.apellido || '',
        nombreNegocio: joven.nombreNegocio || '',
        linkNegocio: joven.linkNegocio || '',
        estadoKanban: joven.estadoKanban || 'ENCARGADO',
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

  const handleOpenDetails = (item) => { setDetailsItem(item); setShowDetailsModal(true); };
  const handleCloseDetails = () => { setShowDetailsModal(false); setDetailsItem(null); };

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
      const dataToSend = {
        nombre: formData.nombre,
        apellido: formData.apellido,
        nombreNegocio: formData.nombreNegocio,
        linkNegocio: formData.linkNegocio,
        estadoKanban: formData.estadoKanban
      };

      let jovenId = selectedJoven?.id;

      if (modalMode === 'create') {
        const creado = await jcfService.crearJoven(dataToSend);
        jovenId = creado?.data?.id || creado?.id;
        toast.success('Joven creado exitosamente');
      } else {
        await jcfService.actualizarJoven(jovenId, dataToSend);
        toast.success('Joven actualizado exitosamente');
      }

      if (jovenId) {
        await jcfService.asignarEncargado(jovenId, formData.encargadoId || null);
      }

      handleCloseModal();
      cargarDatos();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al guardar el joven');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (joven) => {
    showConfirm({
      variant: 'danger',
      title: 'Eliminar joven',
      subtitle: 'Esta acción no se puede deshacer',
      message: `¿Confirmas que deseas eliminar a "${joven.nombre} ${joven.apellido}"?`,
      confirmLabel: 'Sí, eliminar',
      onConfirm: async () => {
        try {
          await jcfService.eliminarJoven(joven.id);
          toast.success('Joven eliminado exitosamente');
          cargarDatos();
        } catch (error) {
          toast.error('Error al eliminar el joven');
        }
      },
    });
  };

  const getRolColor = (rol) => {
    const map = {
      admin: { bg: '#FEF2F2', color: '#DC2626' },
      lider_jcf: { bg: 'var(--capyme-blue-pale)', color: 'var(--capyme-blue-mid)' },
      encargado_jcf: { bg: '#F0FDF4', color: '#16A34A' }
    };
    return map[rol] || { bg: 'var(--gray-100)', color: 'var(--gray-500)' };
  };

  const getRolName = (rol) => {
    const map = { admin: 'Administrador', lider_jcf: 'Líder JCF', encargado_jcf: 'Encargado JCF' };
    return map[rol] || rol;
  };

  const estadoColor = (estado) => {
    const colores = {
      'ENCARGADO': '#F59E0B',
      'EN_PROCESO': '#3B82F6',
      'POSTULADO': '#10B981'
    };
    return colores[estado] || '#6B7280';
  };

  const jovenesFiltrados = jovenes.filter(j => {
    const nombre = `${j.nombre || ''} ${j.apellido || ''}`.toLowerCase();
    const negocio = (j.nombreNegocio || j.linkNegocio || '').toLowerCase();
    const query = searchTerm.toLowerCase();
    const coincideBusqueda = nombre.includes(query) || negocio.includes(query);
    const coincideEstado = filterEstado ? j.estadoKanban === filterEstado : true;
    return coincideBusqueda && coincideEstado;
  });

  const navBtnStyle = (isActive) => ({
    display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px',
    background: isActive ? 'linear-gradient(135deg, var(--capyme-blue-mid), var(--capyme-blue))' : '#fff',
    color: isActive ? '#fff' : 'var(--gray-600)', border: isActive ? 'none' : '1px solid var(--border)',
    borderRadius: 'var(--radius-md)', fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontSize: '13px', fontWeight: 600, cursor: 'pointer',
    boxShadow: isActive ? '0 2px 8px rgba(31,78,158,0.28)' : 'none', transition: 'all 200ms ease'
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
    transition: 'all 200ms ease',
  };

  const inputWithIconStyle = { ...inputBaseStyle, paddingLeft: '38px' };
  const inputErrorStyle = { borderColor: '#EF4444', boxShadow: '0 0 0 2px rgba(239,68,68,0.15)' };

  const labelStyle = {
    display: 'block',
    fontSize: '13px',
    fontWeight: 600,
    color: 'var(--gray-600)',
    marginBottom: '6px',
    fontFamily: "'DM Sans', sans-serif",
  };

  const selectStyle = {
    ...inputBaseStyle,
    appearance: 'none',
    paddingRight: '36px',
    cursor: 'pointer',
  };

  if (loading) {
    return (
      <Layout>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '320px', flexDirection: 'column', gap: '16px' }}>
          <div style={{ width: '40px', height: '40px', border: '3px solid var(--border)', borderTopColor: 'var(--capyme-blue-mid)', borderRadius: '50%', animation: 'spin 700ms linear infinite' }} />
          <p style={{ fontSize: '14px', color: 'var(--gray-400)', fontFamily: "'DM Sans', sans-serif" }}>Cargando información...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes modalIn { from { opacity:0; transform:scale(0.96) translateY(8px); } to { opacity:1; transform:scale(1) translateY(0); } }
      `}</style>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', width: '100%' }}>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button onClick={() => navigate('/jcf/lideres')} style={navBtnStyle(false)}>
            <UsersRound style={{ width: 16, height: 16 }} /> Gestionar Líderes
          </button>
          <button onClick={() => navigate('/jcf/encargados')} style={navBtnStyle(false)}>
            <UserCheck style={{ width: 16, height: 16 }} /> Gestionar Encargados
          </button>
          <button onClick={() => navigate('/jcf/jovenes')} style={navBtnStyle(true)}>
            <Users style={{ width: 16, height: 16 }} /> Distribución de Jóvenes
          </button>
          <button onClick={() => navigate('/jcf/kanban')} style={navBtnStyle(false)}>
            <LayoutDashboard style={{ width: 16, height: 16 }} /> Tablero Kanban
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
          <div>
            <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '26px', fontWeight: 800, color: 'var(--gray-900)', letterSpacing: '-0.02em', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Users style={{ width: '28px', height: '28px', color: 'var(--capyme-blue-mid)' }} />
              Distribución de Jóvenes
            </h1>
            <p style={{ fontSize: '14px', color: 'var(--gray-500)', fontFamily: "'DM Sans', sans-serif" }}>
              {jovenesFiltrados.length} joven{jovenesFiltrados.length !== 1 ? 'es' : ''} registrado{jovenesFiltrados.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={() => handleOpenModal('create')}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: 'linear-gradient(135deg, var(--capyme-blue-mid), var(--capyme-blue))', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '14px', fontWeight: 600, cursor: 'pointer', boxShadow: '0 2px 8px rgba(31,78,158,0.28)', transition: 'all 200ms ease', whiteSpace: 'nowrap' }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <Plus style={{ width: '16px', height: '16px' }} />
            Nuevo Joven
          </button>
        </div>

        <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px', alignItems: 'center' }}>
            <div style={{ position: 'relative' }}>
              <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: 'var(--gray-400)', pointerEvents: 'none' }} />
              <input type="text" placeholder="Buscar por nombre o negocio..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={inputWithIconStyle} onFocus={e => { e.target.style.borderColor = 'var(--capyme-blue-mid)'; e.target.style.boxShadow = '0 0 0 3px rgba(43,91,166,0.12)'; }} onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }} />
            </div>
            <div style={{ position: 'relative' }}>
              <select value={filterEstado} onChange={(e) => setFilterEstado(e.target.value)} style={selectStyle}>
                <option value="">Todos los estados</option>
                <option value="ENCARGADO">Encargado</option>
                <option value="EN_PROCESO">En proceso</option>
                <option value="POSTULADO">Postulado</option>
              </select>
              <ChevronDown style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: 'var(--gray-400)', pointerEvents: 'none' }} />
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--gray-50)' }}>
                  {['Nombre', 'Negocio', 'Estado', 'Encargado', 'Acciones'].map((h, i) => (
                    <th key={h} style={{ padding: '14px 24px', textAlign: i === 4 ? 'right' : 'left', fontSize: '11px', fontWeight: 700, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: "'Plus Jakarta Sans', sans-serif", borderBottom: '1px solid var(--border)', whiteSpace: 'nowrap' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {jovenesFiltrados.length > 0 ? (
                  jovenesFiltrados.map((joven) => (
                    <tr
                      key={joven.id}
                      onClick={() => handleOpenDetails(joven)}
                      onMouseEnter={() => setHoveredRow(joven.id)}
                      onMouseLeave={() => setHoveredRow(null)}
                      style={{ borderBottom: '1px solid var(--border)', transition: 'background 150ms ease', cursor: 'pointer', background: hoveredRow === joven.id ? 'var(--gray-50)' : 'transparent' }}
                    >
                      <td style={{ padding: '14px 24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{ width: '38px', height: '38px', borderRadius: 'var(--radius-md)', background: 'linear-gradient(135deg, var(--capyme-blue-mid), var(--capyme-blue))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '13px', fontWeight: 700, fontFamily: "'Plus Jakarta Sans', sans-serif", flexShrink: 0 }}>
                            {joven.nombre?.charAt(0)?.toUpperCase()}{joven.apellido?.charAt(0)?.toUpperCase()}
                          </div>
                          <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--gray-800)', fontFamily: "'DM Sans', sans-serif" }}>
                            {joven.nombre} {joven.apellido}
                          </p>
                        </div>
                      </td>
                      <td style={{ padding: '14px 24px' }}>
                        <p style={{ fontSize: '13px', color: 'var(--gray-700)' }}>
                          {joven.nombreNegocio || joven.linkNegocio || '—'}
                        </p>
                      </td>
                      <td style={{ padding: '14px 24px' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 600, padding: '4px 8px', background: estadoColor(joven.estadoKanban) + '20', color: estadoColor(joven.estadoKanban), borderRadius: '4px' }}>
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: estadoColor(joven.estadoKanban) }}></span>
                          {joven.estadoKanban || 'ENCARGADO'}
                        </span>
                      </td>
                      <td style={{ padding: '14px 24px' }}>
                        {joven.encargado ? (
                          <div>
                            <p style={{ fontSize: '13px', color: 'var(--gray-900)', fontWeight: 500 }}>
                              {joven.encargado.nombre} {joven.encargado.apellido}
                            </p>
                            {joven.encargado.rol && (
                              <span style={{ display: 'inline-block', marginTop: '2px', padding: '2px 8px', background: getRolColor(joven.encargado.rol).bg, color: getRolColor(joven.encargado.rol).color, borderRadius: 'var(--radius-sm)', fontSize: '10px', fontWeight: 700, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                                {getRolName(joven.encargado.rol)}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span style={{ fontSize: '13px', color: 'var(--gray-400)' }}>Sin asignar</span>
                        )}
                      </td>
                      <td style={{ padding: '14px 24px', textAlign: 'right' }} onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px' }}>
                          <button onClick={() => handleOpenDetails(joven)} title="Ver detalles" style={{ width: '34px', height: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', borderRadius: 'var(--radius-sm)', background: 'transparent', cursor: 'pointer', color: 'var(--gray-400)', transition: 'all 150ms ease' }} onMouseEnter={e => { e.currentTarget.style.background = '#EEF4FF'; e.currentTarget.style.color = 'var(--capyme-blue-mid)'; }} onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--gray-400)'; }}>
                            <Eye style={{ width: '15px', height: '15px' }} />
                          </button>
                          <button onClick={() => handleOpenModal('edit', joven)} title="Editar" style={{ width: '34px', height: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', borderRadius: 'var(--radius-sm)', background: 'transparent', cursor: 'pointer', color: 'var(--gray-400)', transition: 'all 150ms ease' }} onMouseEnter={e => { e.currentTarget.style.background = '#EEF4FF'; e.currentTarget.style.color = 'var(--capyme-blue-mid)'; }} onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--gray-400)'; }}>
                            <Edit style={{ width: '16px', height: '16px' }} />
                          </button>
                          <button onClick={() => handleDelete(joven)} title="Eliminar" style={{ width: '34px', height: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', borderRadius: 'var(--radius-sm)', background: 'transparent', cursor: 'pointer', color: 'var(--gray-400)', transition: 'all 150ms ease' }} onMouseEnter={e => { e.currentTarget.style.background = '#FEF2F2'; e.currentTarget.style.color = '#DC2626'; }} onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--gray-400)'; }}>
                            <Trash2 style={{ width: '16px', height: '16px' }} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={{ padding: '60px 24px', textAlign: 'center' }}>
                      <Users style={{ width: '40px', height: '40px', color: 'var(--gray-200)', margin: '0 auto 12px' }} />
                      <p style={{ fontSize: '14px', color: 'var(--gray-400)', fontWeight: 500 }}>No se encontraron jóvenes</p>
                      <p style={{ fontSize: '12px', color: 'var(--gray-300)', marginTop: '4px' }}>Intenta ajustar los filtros o crea uno nuevo</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '16px' }}>
          <div style={{ background: '#fff', borderRadius: 'var(--radius-lg)', maxWidth: '600px', width: '100%', maxHeight: '90vh', display: 'flex', flexDirection: 'column', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', overflow: 'hidden', animation: 'modalIn 0.25s ease both' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid var(--border)', background: 'var(--gray-50)' }}>
              <div>
                <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '18px', fontWeight: 800, color: 'var(--gray-900)', letterSpacing: '-0.01em' }}>
                  {modalMode === 'create' ? 'Nuevo Joven' : 'Editar Joven'}
                </h2>
                <p style={{ fontSize: '13px', color: 'var(--gray-400)', marginTop: '2px', fontFamily: "'DM Sans', sans-serif" }}>
                  {modalMode === 'create' ? 'Registra un nuevo joven en el sistema' : `Editando: ${selectedJoven?.nombre} ${selectedJoven?.apellido}`}
                </p>
              </div>
              <button onClick={handleCloseModal} style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', borderRadius: 'var(--radius-sm)', background: 'transparent', cursor: 'pointer', color: 'var(--gray-400)', transition: 'all 150ms ease' }} onMouseEnter={e => { e.currentTarget.style.background = 'var(--gray-100)'; e.currentTarget.style.color = 'var(--gray-600)'; }} onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--gray-400)'; }}>
                <X style={{ width: '20px', height: '20px' }} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ overflowY: 'auto', flex: 1, padding: '24px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                <SectionTitle icon={User} text="Información Personal" />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={labelStyle}>Nombre *</label>
                    <div style={{ position: 'relative' }}>
                      <User style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: 'var(--gray-400)', pointerEvents: 'none' }} />
                      <input type="text" value={formData.nombre} onChange={(e) => handleChange('nombre', e.target.value)} placeholder="Nombre" style={{ ...inputWithIconStyle, ...(formErrors.nombre ? inputErrorStyle : {}) }} />
                    </div>
                    {formErrors.nombre && <ErrorMsg text={formErrors.nombre} />}
                  </div>
                  <div>
                    <label style={labelStyle}>Apellido *</label>
                    <input type="text" value={formData.apellido} onChange={(e) => handleChange('apellido', e.target.value)} placeholder="Apellido" style={{ ...inputBaseStyle, ...(formErrors.apellido ? inputErrorStyle : {}) }} />
                    {formErrors.apellido && <ErrorMsg text={formErrors.apellido} />}
                  </div>
                </div>

                <SectionTitle icon={Briefcase} text="Negocio" />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={labelStyle}>Nombre del negocio</label>
                    <input type="text" value={formData.nombreNegocio} onChange={(e) => handleChange('nombreNegocio', e.target.value)} placeholder="Nombre del negocio" style={inputBaseStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Link del negocio</label>
                    <div style={{ position: 'relative' }}>
                      <Link2 style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: 'var(--gray-400)', pointerEvents: 'none' }} />
                      <input type="text" value={formData.linkNegocio} onChange={(e) => handleChange('linkNegocio', e.target.value)} placeholder="https://..." style={inputWithIconStyle} />
                    </div>
                  </div>
                </div>

                <SectionTitle icon={Shield} text="Estado y Encargado" />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={labelStyle}>Estado</label>
                    <div style={{ position: 'relative' }}>
                      <select value={formData.estadoKanban} onChange={(e) => handleChange('estadoKanban', e.target.value)} style={selectStyle}>
                        <option value="ENCARGADO">Encargado</option>
                        <option value="EN_PROCESO">En proceso</option>
                        <option value="POSTULADO">Postulado</option>
                      </select>
                      <ChevronDown style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: 'var(--gray-400)', pointerEvents: 'none' }} />
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>Encargado</label>
                    <div style={{ position: 'relative' }}>
                      <select value={formData.encargadoId} onChange={(e) => handleChange('encargadoId', e.target.value)} style={selectStyle}>
                        <option value="">Sin asignar</option>
                        {encargados.map(enc => (
                          <option key={enc.id} value={enc.id}>
                            {enc.nombre} {enc.apellido} — {getRolName(enc.rol)}
                          </option>
                        ))}
                      </select>
                      <ChevronDown style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: 'var(--gray-400)', pointerEvents: 'none' }} />
                    </div>
                    <p style={{ marginTop: '5px', fontSize: '11px', color: 'var(--gray-400)', fontFamily: "'DM Sans', sans-serif" }}>
                      Solo se listan usuarios con rol Administrador, Líder JCF o Encargado JCF
                    </p>
                  </div>
                </div>

              </div>
            </form>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px', padding: '16px 24px', borderTop: '1px solid var(--border)', background: 'var(--gray-50)' }}>
              <button type="button" onClick={handleCloseModal} disabled={submitting} style={{ padding: '10px 20px', fontSize: '14px', fontWeight: 600, fontFamily: "'Plus Jakarta Sans', sans-serif", color: 'var(--gray-600)', background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.5 : 1, transition: 'all 150ms ease' }}>
                Cancelar
              </button>
              <button type="submit" onClick={handleSubmit} disabled={submitting || !isFormValid} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 24px', fontSize: '14px', fontWeight: 600, fontFamily: "'Plus Jakarta Sans', sans-serif", color: '#fff', background: 'linear-gradient(135deg, var(--capyme-blue-mid), var(--capyme-blue))', border: 'none', borderRadius: 'var(--radius-md)', cursor: submitting || !isFormValid ? 'not-allowed' : 'pointer', opacity: submitting || !isFormValid ? 0.6 : 1, boxShadow: '0 2px 8px rgba(31,78,158,0.28)', transition: 'all 200ms ease' }}>
                {submitting && <div style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 700ms linear infinite' }} />}
                {modalMode === 'create' ? 'Crear Joven' : 'Guardar Cambios'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showDetailsModal && detailsItem && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 'var(--radius-lg)', width: '100%', maxWidth: '640px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 60px rgba(0,0,0,0.18)', animation: 'modalIn 200ms ease' }}>
            <div style={{ padding: '20px 24px', background: 'var(--gray-50)', borderBottom: '1px solid var(--border)', borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: 'var(--radius-md)', background: 'linear-gradient(135deg, var(--capyme-blue-mid), var(--capyme-blue))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '15px', fontWeight: 700, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  {detailsItem.nombre?.charAt(0)?.toUpperCase()}{detailsItem.apellido?.charAt(0)?.toUpperCase()}
                </div>
                <div>
                  <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 800, fontFamily: "'Plus Jakarta Sans', sans-serif", color: 'var(--gray-900)' }}>
                    {detailsItem.nombre} {detailsItem.apellido}
                  </h2>
                  <p style={{ margin: 0, fontSize: '13px', color: 'var(--gray-500)', fontFamily: "'DM Sans', sans-serif" }}>Detalles completos del joven</p>
                </div>
              </div>
              <button onClick={handleCloseDetails} style={{ width: '34px', height: '34px', border: 'none', background: 'transparent', borderRadius: 'var(--radius-sm)', cursor: 'pointer', color: 'var(--gray-400)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 150ms ease' }}>
                <X style={{ width: '18px', height: '18px' }} />
              </button>
            </div>

            <div style={{ overflowY: 'auto', flex: 1, padding: '24px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
              <div>
                <SectionTitle icon={User} text="Información Personal y Negocio" />
                <div style={{ marginTop: '12px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '16px' }}>
                  <InfoRow label="Nombre Completo" value={`${detailsItem.nombre} ${detailsItem.apellido}`} icon={User} />
                  <InfoRow label="Negocio" value={detailsItem.nombreNegocio} icon={Briefcase} />
                  <InfoRow label="Link del Negocio" value={detailsItem.linkNegocio} icon={Link2} isLink />
                </div>
              </div>

              <div>
                <SectionTitle icon={Shield} text="Estado y Encargado" />
                <div style={{ marginTop: '12px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '16px' }}>
                  <div>
                    <span style={{ fontSize: '12px', color: 'var(--gray-500)', fontWeight: 600, fontFamily: "'DM Sans', sans-serif", display: 'block', marginBottom: '4px' }}>Estado</span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '4px 10px', borderRadius: 'var(--radius-sm)', fontSize: '12px', fontWeight: 600, background: estadoColor(detailsItem.estadoKanban) + '20', color: estadoColor(detailsItem.estadoKanban) }}>
                      {detailsItem.estadoKanban || 'ENCARGADO'}
                    </span>
                  </div>
                  <div>
                    <span style={{ fontSize: '12px', color: 'var(--gray-500)', fontWeight: 600, fontFamily: "'DM Sans', sans-serif", display: 'block', marginBottom: '4px' }}>Encargado</span>
                    {detailsItem.encargado ? (
                      <span style={{ display: 'inline-block', padding: '3px 10px', background: getRolColor(detailsItem.encargado.rol).bg, color: getRolColor(detailsItem.encargado.rol).color, borderRadius: 'var(--radius-sm)', fontSize: '11px', fontWeight: 700, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        {detailsItem.encargado.nombre} {detailsItem.encargado.apellido} — {getRolName(detailsItem.encargado.rol)}
                      </span>
                    ) : (
                      <span style={{ fontSize: '13px', color: 'var(--gray-400)' }}>Sin asignar</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ padding: '16px 24px', background: 'var(--gray-50)', borderTop: '1px solid var(--border)', borderRadius: '0 0 var(--radius-lg) var(--radius-lg)', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button onClick={handleCloseDetails} style={{ padding: '9px 24px', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', background: '#fff', color: 'var(--gray-700)', fontSize: '14px', fontWeight: 600, fontFamily: "'DM Sans', sans-serif", cursor: 'pointer' }}>
                Cerrar Detalles
              </button>
              <button onClick={() => { handleCloseDetails(); handleOpenModal('edit', detailsItem); }} style={{ padding: '9px 24px', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', background: '#EEF4FF', color: 'var(--capyme-blue-mid)', fontSize: '14px', fontWeight: 600, fontFamily: "'DM Sans', sans-serif", cursor: 'pointer' }}>
                Editar Joven
              </button>
              <button onClick={() => { handleCloseDetails(); handleDelete(detailsItem); }} style={{ padding: '9px 24px', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', background: '#FEF2F2', color: '#DC2626', fontSize: '14px', fontWeight: 600, fontFamily: "'DM Sans', sans-serif", cursor: 'pointer' }}>
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal config={confirmConfig} onClose={closeConfirm} />
    </Layout>
  );
};

export default JovenesDistribucion;