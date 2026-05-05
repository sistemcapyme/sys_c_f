import React, { useState, useEffect } from 'react';
import Layout from '../../components/common/Layout';
import catalogosService from '../../services/catalogosService';
import { useAuthStore } from '../../store/authStore';
import {
  FileText, Plus, Search, Edit, Trash2, X, Link as LinkIcon,
  ChevronDown, AlertCircle, ExternalLink,
  DollarSign, FileCheck, AlertTriangle, Image as ImageIcon, UploadCloud, Eye, EyeOff
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const initialFormData = {
  titulo: '',
  descripcion: '',
  precio: '',
  linkDrive: '',
  activo: true
};

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

const CatalogosAdmin = () => {
  const { user } = useAuthStore();
  
  const [pdfs, setPdfs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState('');
  const [hoveredRow, setHoveredRow] = useState(null);
  
  const [formData, setFormData] = useState(initialFormData);
  const [imagenArchivo, setImagenArchivo] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  const [confirmConfig, setConfirmConfig] = useState({ show: false });
  const showConfirm = (cfg) => setConfirmConfig({ show: true, ...cfg });
  const closeConfirm = () => setConfirmConfig({ show: false });

  useEffect(() => {
    fetchPdfs();
  }, []);

  const fetchPdfs = async () => {
    try {
      setLoading(true);
      const data = await catalogosService.obtenerTodosAdmin();
      setPdfs(data);
    } catch (error) {
      toast.error('Error al cargar catálogos');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.titulo.trim()) errors.titulo = 'El título es requerido';
    if (!formData.descripcion.trim()) errors.descripcion = 'La descripción es requerida';
    if (!formData.precio || isNaN(formData.precio) || formData.precio <= 0) {
      errors.precio = 'Precio inválido';
    }
    if (!formData.linkDrive.trim()) {
      errors.linkDrive = 'El enlace es requerido';
    } else if (!formData.linkDrive.startsWith('http')) {
      errors.linkDrive = 'El enlace debe empezar con http:// o https://';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const isFormValid = formData.titulo.trim() !== '' && 
                      formData.descripcion.trim() !== '' && 
                      formData.precio > 0 && 
                      formData.linkDrive.trim() !== '';

  const handleOpenModal = (mode, pdf = null) => {
    setModalMode(mode);
    setFormErrors({});
    setImagenArchivo(null);
    setPreviewUrl(null);
    
    if (mode === 'edit' && pdf) {
      setFormData({
        id: pdf.id,
        titulo: pdf.titulo || '',
        descripcion: pdf.descripcion || '',
        precio: pdf.precio || '',
        linkDrive: pdf.linkDrive || '',
        activo: pdf.activo !== undefined ? pdf.activo : true
      });
      if (pdf.imagenUrl) {
        setPreviewUrl(pdf.imagenUrl);
      }
    } else {
      setFormData({ ...initialFormData });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormErrors({});
    setImagenArchivo(null);
    setPreviewUrl(null);
    setFormData({ ...initialFormData });
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImagenArchivo(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      setSubmitting(true);
      const submitData = new FormData();
      submitData.append('titulo', formData.titulo);
      submitData.append('descripcion', formData.descripcion);
      submitData.append('precio', formData.precio);
      submitData.append('linkDrive', formData.linkDrive);
      submitData.append('activo', formData.activo);
      
      if (imagenArchivo) {
        submitData.append('imagen', imagenArchivo);
      }

      if (modalMode === 'create') {
        await catalogosService.crearPdf(submitData);
        toast.success('Catálogo creado exitosamente');
      } else {
        await catalogosService.actualizarPdf(formData.id, submitData);
        toast.success('Catálogo actualizado exitosamente');
      }
      handleCloseModal();
      fetchPdfs();
    } catch (error) {
      toast.error('Error al guardar el catálogo');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActivo = (pdf) => {
    const desactivar = pdf.activo;
    showConfirm({
      variant: 'warning',
      title: desactivar ? 'Ocultar catálogo' : 'Mostrar catálogo',
      subtitle: desactivar
        ? 'El catálogo no será visible para los clientes'
        : 'El catálogo volverá a ser visible',
      message: `¿Confirmas que deseas ${desactivar ? 'ocultar' : 'mostrar'} el archivo "${pdf.titulo}"?`,
      confirmLabel: desactivar ? 'Sí, ocultar' : 'Sí, mostrar',
      onConfirm: async () => {
        try {
          const submitData = new FormData();
          submitData.append('titulo', pdf.titulo);
          submitData.append('descripcion', pdf.descripcion);
          submitData.append('precio', pdf.precio);
          submitData.append('linkDrive', pdf.linkDrive);
          submitData.append('activo', !pdf.activo);

          await catalogosService.actualizarPdf(pdf.id, submitData);
          toast.success(`Catálogo ${desactivar ? 'ocultado' : 'mostrado'} exitosamente`);
          fetchPdfs();
        } catch (error) {
          toast.error('Error al cambiar el estado');
        }
      },
    });
  };

  const handleDelete = (pdf) => {
    showConfirm({
      variant: 'danger',
      title: 'Eliminar catálogo',
      subtitle: 'Esta acción es irreversible',
      message: `¿Confirmas que deseas eliminar definitivamente el catálogo "${pdf.titulo}"? Su imagen también será eliminada de los servidores.`,
      confirmLabel: 'Sí, eliminar',
      onConfirm: async () => {
        try {
          await catalogosService.eliminarPdf(pdf.id);
          toast.success('Catálogo eliminado exitosamente');
          fetchPdfs();
        } catch (error) {
          toast.error('Error al eliminar el catálogo');
        }
      },
    });
  };

  const pdfsFiltrados = pdfs.filter(p => {
    const matchesSearch = p.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.descripcion?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEstado = filterEstado === '' ? true : p.activo.toString() === filterEstado;
    return matchesSearch && matchesEstado;
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
          <p style={{ fontSize: '14px', color: 'var(--gray-400)', fontFamily: "'DM Sans', sans-serif" }}>Cargando catálogos...</p>
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

      <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>

        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
          <div>
            <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '26px', fontWeight: 800, color: 'var(--gray-900)', letterSpacing: '-0.02em', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <FileCheck style={{ width: '28px', height: '28px', color: 'var(--capyme-blue-mid)' }} />
              Gestión de Catálogos
            </h1>
            <p style={{ fontSize: '14px', color: 'var(--gray-500)', fontFamily: "'DM Sans', sans-serif" }}>
              {pdfsFiltrados.length} catálogo{pdfsFiltrados.length !== 1 ? 's' : ''} registrado{pdfsFiltrados.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={() => handleOpenModal('create')}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: 'linear-gradient(135deg, var(--capyme-blue-mid), var(--capyme-blue))', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '14px', fontWeight: 600, cursor: 'pointer', boxShadow: '0 2px 8px rgba(31,78,158,0.28)', transition: 'all 200ms ease', whiteSpace: 'nowrap' }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <Plus style={{ width: '16px', height: '16px' }} />
            Nuevo Catálogo
          </button>
        </div>

        <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px', alignItems: 'center' }}>
            <div style={{ position: 'relative' }}>
              <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: 'var(--gray-400)', pointerEvents: 'none' }} />
              <input type="text" placeholder="Buscar por título o descripción..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={inputWithIconStyle} onFocus={e => { e.target.style.borderColor = 'var(--capyme-blue-mid)'; e.target.style.boxShadow = '0 0 0 3px rgba(43,91,166,0.12)'; }} onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }} />
            </div>
            <div style={{ position: 'relative' }}>
              <select value={filterEstado} onChange={(e) => setFilterEstado(e.target.value)} style={selectStyle}>
                <option value="">Todos los estados</option>
                <option value="true">Activos</option>
                <option value="false">Inactivos</option>
              </select>
              <ChevronDown style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: 'var(--gray-400)', pointerEvents: 'none' }} />
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--gray-50)' }}>
                  {['Portada', 'Título', 'Precio', 'Enlace', 'Estado', 'Acciones'].map((h, i) => (
                    <th key={h} style={{ padding: '14px 24px', textAlign: i === 5 ? 'right' : 'left', fontSize: '11px', fontWeight: 700, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: "'Plus Jakarta Sans', sans-serif", borderBottom: '1px solid var(--border)', whiteSpace: 'nowrap' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pdfsFiltrados.length > 0 ? (
                  pdfsFiltrados.map((pdf) => {
                    return (
                      <tr
                        key={pdf.id}
                        onMouseEnter={() => setHoveredRow(pdf.id)}
                        onMouseLeave={() => setHoveredRow(null)}
                        style={{ borderBottom: '1px solid var(--border)', transition: 'background 150ms ease', background: hoveredRow === pdf.id ? 'var(--gray-50)' : 'transparent' }}
                      >
                        <td style={{ padding: '14px 24px' }}>
                          {pdf.imagenUrl ? (
                            <img src={pdf.imagenUrl} alt="portada" style={{ width: '44px', height: '44px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }} />
                          ) : (
                            <div style={{ width: '44px', height: '44px', background: 'var(--gray-100)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border)' }}>
                              <ImageIcon style={{ width: '20px', height: '20px', color: 'var(--gray-400)' }} />
                            </div>
                          )}
                        </td>
                        <td style={{ padding: '14px 24px' }}>
                          <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--gray-800)', fontFamily: "'DM Sans', sans-serif" }}>
                            {pdf.titulo}
                          </p>
                          <p style={{ fontSize: '12px', color: 'var(--gray-500)', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '250px' }}>
                            {pdf.descripcion}
                          </p>
                        </td>
                        <td style={{ padding: '14px 24px' }}>
                          <p style={{ fontSize: '13px', fontWeight: 800, color: 'var(--capyme-blue-mid)', display: 'flex', alignItems: 'center', gap: '2px' }}>
                             ${Number(pdf.precio).toFixed(2)}
                          </p>
                        </td>
                        <td style={{ padding: '14px 24px' }}>
                          <a href={pdf.linkDrive} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: 600, fontFamily: "'DM Sans', sans-serif", color: 'var(--capyme-blue-mid)', textDecoration: 'none', background: 'var(--capyme-blue-pale)', padding: '4px 8px', borderRadius: '4px' }}>
                            Ver Drive <ExternalLink style={{ width: '11px', height: '11px' }} />
                          </a>
                        </td>
                        <td style={{ padding: '14px 24px' }}>
                          <span style={{ display: 'inline-block', padding: '3px 10px', background: pdf.activo ? '#ECFDF5' : '#FEF2F2', color: pdf.activo ? '#065F46' : '#DC2626', borderRadius: 'var(--radius-sm)', fontSize: '11px', fontWeight: 700, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                            {pdf.activo ? 'Activo' : 'Oculto'}
                          </span>
                        </td>
                        <td style={{ padding: '14px 24px', textAlign: 'right' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px' }}>
                            <button onClick={() => handleOpenModal('edit', pdf)} title="Editar" style={{ width: '34px', height: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', borderRadius: 'var(--radius-sm)', background: 'transparent', cursor: 'pointer', color: 'var(--gray-400)', transition: 'all 150ms ease' }} onMouseEnter={e => { e.currentTarget.style.background = '#EEF4FF'; e.currentTarget.style.color = 'var(--capyme-blue-mid)'; }} onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--gray-400)'; }}>
                              <Edit style={{ width: '16px', height: '16px' }} />
                            </button>

                            {pdf.activo ? (
                              <button onClick={() => handleToggleActivo(pdf)} title="Ocultar catálogo" style={{ width: '34px', height: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', borderRadius: 'var(--radius-sm)', background: 'transparent', cursor: 'pointer', color: 'var(--gray-400)', transition: 'all 150ms ease' }} onMouseEnter={e => { e.currentTarget.style.background = '#FFFBEB'; e.currentTarget.style.color = '#D97706'; }} onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--gray-400)'; }}>
                                <EyeOff style={{ width: '16px', height: '16px' }} />
                              </button>
                            ) : (
                              <button onClick={() => handleToggleActivo(pdf)} title="Mostrar catálogo" style={{ width: '34px', height: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', borderRadius: 'var(--radius-sm)', background: 'transparent', cursor: 'pointer', color: 'var(--gray-400)', transition: 'all 150ms ease' }} onMouseEnter={e => { e.currentTarget.style.background = '#ECFDF5'; e.currentTarget.style.color = '#065F46'; }} onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--gray-400)'; }}>
                                <Eye style={{ width: '16px', height: '16px' }} />
                              </button>
                            )}

                            <button onClick={() => handleDelete(pdf)} title="Eliminar catálogo" style={{ width: '34px', height: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', borderRadius: 'var(--radius-sm)', background: 'transparent', cursor: 'pointer', color: 'var(--gray-400)', transition: 'all 150ms ease' }} onMouseEnter={e => { e.currentTarget.style.background = '#FEF2F2'; e.currentTarget.style.color = '#DC2626'; }} onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--gray-400)'; }}>
                              <Trash2 style={{ width: '16px', height: '16px' }} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" style={{ padding: '60px 24px', textAlign: 'center' }}>
                      <FileText style={{ width: '40px', height: '40px', color: 'var(--gray-200)', margin: '0 auto 12px' }} />
                      <p style={{ fontSize: '14px', color: 'var(--gray-400)', fontWeight: 500 }}>No se encontraron catálogos</p>
                      <p style={{ fontSize: '12px', color: 'var(--gray-300)', marginTop: '4px' }}>Intenta ajustar la búsqueda o crea uno nuevo</p>
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
                <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '18px', fontWeight: 800, color: 'var(--gray-900)', letterSpacing: '-0.01em', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {modalMode === 'create' ? <Plus style={{ color: 'var(--capyme-blue-mid)' }} size={20} /> : <Edit style={{ color: 'var(--capyme-blue-mid)' }} size={20} />}
                  {modalMode === 'create' ? 'Nuevo Catálogo' : 'Editar Catálogo'}
                </h2>
                <p style={{ fontSize: '13px', color: 'var(--gray-400)', marginTop: '2px', fontFamily: "'DM Sans', sans-serif" }}>
                  {modalMode === 'create' ? 'Registra un nuevo PDF para la venta pública' : `Editando: ${formData.titulo}`}
                </p>
              </div>
              <button onClick={handleCloseModal} style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', borderRadius: 'var(--radius-sm)', background: 'transparent', cursor: 'pointer', color: 'var(--gray-400)', transition: 'all 150ms ease' }} onMouseEnter={e => { e.currentTarget.style.background = 'var(--gray-100)'; e.currentTarget.style.color = 'var(--gray-600)'; }} onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--gray-400)'; }}>
                <X style={{ width: '20px', height: '20px' }} />
              </button>
            </div>

            <form id="catalogoForm" onSubmit={handleSubmit} style={{ overflowY: 'auto', flex: 1, padding: '24px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                <SectionTitle icon={ImageIcon} text="Apariencia Visual" />
                <div>
                  <label style={labelStyle}>Portada del Catálogo</label>
                  
                  <div style={{ position: 'relative', width: '100%', height: '200px', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: previewUrl ? 'none' : '2px dashed var(--capyme-blue-mid)', background: 'var(--gray-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 200ms ease' }}>
                    {previewUrl ? (
                      <>
                        <img src={previewUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <div 
                          style={{ position: 'absolute', inset: 0, background: 'rgba(15,42,90,0.7)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 200ms ease' }} 
                          onMouseEnter={e => e.currentTarget.style.opacity = 1} 
                          onMouseLeave={e => e.currentTarget.style.opacity = 0}
                        >
                          <UploadCloud style={{ color: '#fff', width: '32px', height: '32px', marginBottom: '8px' }} />
                          <span style={{ color: '#fff', fontSize: '14px', fontWeight: 700, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Cambiar Portada</span>
                          <input type="file" accept="image/*" onChange={handleImageChange} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%' }} />
                        </div>
                      </>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', padding: '20px', textAlign: 'center', width: '100%', height: '100%', justifyContent: 'center' }}>
                        <div style={{ width: '48px', height: '48px', background: 'var(--capyme-blue-pale)', color: 'var(--capyme-blue-mid)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px' }}>
                          <UploadCloud style={{ width: '24px', height: '24px' }} />
                        </div>
                        <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--capyme-dark)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Haz clic para cargar una imagen</span>
                        <span style={{ fontSize: '12px', color: 'var(--gray-500)', fontFamily: "'DM Sans', sans-serif" }}>Formato JPG, PNG o WEBP</span>
                        <input type="file" accept="image/*" onChange={handleImageChange} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%' }} />
                      </div>
                    )}
                  </div>
                </div>

                <SectionTitle icon={FileText} text="Información del Catálogo" />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  
                  <div>
                    <label style={labelStyle}>Título del PDF *</label>
                    <input type="text" value={formData.titulo} onChange={(e) => handleChange('titulo', e.target.value)} placeholder="Ej. Curso Básico de Negocios" style={{ ...inputBaseStyle, ...(formErrors.titulo ? inputErrorStyle : {}) }} onFocus={e => { if (!formErrors.titulo) { e.target.style.borderColor = 'var(--capyme-blue-mid)'; e.target.style.boxShadow = '0 0 0 3px rgba(43,91,166,0.12)'; } }} onBlur={e => { if (!formErrors.titulo) { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; } }} />
                    {formErrors.titulo && <ErrorMsg text={formErrors.titulo} />}
                  </div>

                  <div>
                    <label style={labelStyle}>Descripción *</label>
                    <textarea value={formData.descripcion} rows="3" onChange={(e) => handleChange('descripcion', e.target.value)} placeholder="Detalles de lo que incluye el archivo..." style={{ ...inputBaseStyle, resize: 'none', ...(formErrors.descripcion ? inputErrorStyle : {}) }} onFocus={e => { if (!formErrors.descripcion) { e.target.style.borderColor = 'var(--capyme-blue-mid)'; e.target.style.boxShadow = '0 0 0 3px rgba(43,91,166,0.12)'; } }} onBlur={e => { if (!formErrors.descripcion) { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; } }} />
                    {formErrors.descripcion && <ErrorMsg text={formErrors.descripcion} />}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '16px' }}>
                    <div>
                      <label style={labelStyle}>Precio (MXN) *</label>
                      <div style={{ position: 'relative' }}>
                        <DollarSign style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: 'var(--gray-400)', pointerEvents: 'none' }} />
                        <input type="number" step="0.01" value={formData.precio} onChange={(e) => handleChange('precio', e.target.value)} placeholder="0.00" style={{ ...inputWithIconStyle, fontWeight: 700, ...(formErrors.precio ? inputErrorStyle : {}) }} onFocus={e => { if (!formErrors.precio) { e.target.style.borderColor = 'var(--capyme-blue-mid)'; e.target.style.boxShadow = '0 0 0 3px rgba(43,91,166,0.12)'; } }} onBlur={e => { if (!formErrors.precio) { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; } }} />
                      </div>
                      {formErrors.precio && <ErrorMsg text={formErrors.precio} />}
                    </div>

                    <div>
                      <label style={labelStyle}>Enlace de Google Drive *</label>
                      <div style={{ position: 'relative' }}>
                        <LinkIcon style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: 'var(--gray-400)', pointerEvents: 'none' }} />
                        <input type="url" value={formData.linkDrive} onChange={(e) => handleChange('linkDrive', e.target.value)} placeholder="https://drive.google.com/..." style={{ ...inputWithIconStyle, color: 'var(--capyme-blue-mid)', ...(formErrors.linkDrive ? inputErrorStyle : {}) }} onFocus={e => { if (!formErrors.linkDrive) { e.target.style.borderColor = 'var(--capyme-blue-mid)'; e.target.style.boxShadow = '0 0 0 3px rgba(43,91,166,0.12)'; } }} onBlur={e => { if (!formErrors.linkDrive) { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; } }} />
                      </div>
                      {formErrors.linkDrive && <ErrorMsg text={formErrors.linkDrive} />}
                    </div>
                  </div>

                  {modalMode === 'edit' && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px', padding: '12px', background: 'var(--capyme-blue-pale)', borderRadius: 'var(--radius-md)' }}>
                      <input 
                        type="checkbox" 
                        id="activo" 
                        checked={formData.activo} 
                        onChange={(e) => handleChange('activo', e.target.checked)}
                        style={{ width: '16px', height: '16px', accentColor: 'var(--capyme-blue-mid)', cursor: 'pointer' }}
                      />
                      <label htmlFor="activo" style={{ fontSize: '13px', fontWeight: 600, color: 'var(--capyme-dark)', cursor: 'pointer', userSelect: 'none' }}>
                        Catálogo visible en la tienda pública
                      </label>
                    </div>
                  )}

                </div>
              </div>
            </form>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px', padding: '16px 24px', borderTop: '1px solid var(--border)', background: 'var(--gray-50)', flexShrink: 0 }}>
              <button type="button" onClick={handleCloseModal} disabled={submitting} style={{ padding: '10px 20px', fontSize: '14px', fontWeight: 600, fontFamily: "'Plus Jakarta Sans', sans-serif", color: 'var(--gray-600)', background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.5 : 1, transition: 'all 150ms ease' }} onMouseEnter={e => { if (!submitting) e.currentTarget.style.background = 'var(--gray-50)'; }} onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
                Cancelar
              </button>
              <button type="submit" form="catalogoForm" disabled={submitting || Object.keys(formErrors).length > 0 || !isFormValid} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 24px', fontSize: '14px', fontWeight: 600, fontFamily: "'Plus Jakarta Sans', sans-serif", color: '#fff', background: 'linear-gradient(135deg, var(--capyme-blue-mid), var(--capyme-blue))', border: 'none', borderRadius: 'var(--radius-md)', cursor: submitting || Object.keys(formErrors).length > 0 || !isFormValid ? 'not-allowed' : 'pointer', opacity: submitting || Object.keys(formErrors).length > 0 || !isFormValid ? 0.6 : 1, boxShadow: '0 2px 8px rgba(31,78,158,0.28)', transition: 'all 200ms ease' }} onMouseEnter={e => { if (!submitting && isFormValid && Object.keys(formErrors).length === 0) e.currentTarget.style.transform = 'translateY(-1px)'; }} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                {submitting && <div style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 700ms linear infinite' }} />}
                {modalMode === 'create' ? 'Crear Catálogo' : 'Guardar Cambios'}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal config={confirmConfig} onClose={closeConfirm} />
    </Layout>
  );
};

export default CatalogosAdmin;