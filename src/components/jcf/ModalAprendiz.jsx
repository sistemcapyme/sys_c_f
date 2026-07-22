import React, { useState } from 'react';
import { X, Briefcase, User, MapPin, ExternalLink, Shield, ArrowRight, CheckCircle } from 'lucide-react';

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
      <a href={value} target="_blank" rel="noopener noreferrer" style={{ fontSize: '14px', color: 'var(--capyme-blue-mid)', fontFamily: "'DM Sans', sans-serif", fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}>
        Ver documento <ExternalLink style={{ width: '12px', height: '12px' }} />
      </a>
    ) : (
      <span style={{ fontSize: '14px', color: value ? 'var(--gray-900)' : 'var(--gray-400)', fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}>
        {value || '—'}
      </span>
    )}
  </div>
);

const ModalAprendiz = ({ aprendiz, onClose, onAsignarEncargado, onActualizarEstado }) => {
  const [encargado, setEncargado] = useState(aprendiz?.encargadoId || '');

  if (!aprendiz) return null;

  const estadoActual = aprendiz.estadoKanban || aprendiz.estado_kanban || 'INICIADO';

  const guardarAsignacion = () => {
    if (onAsignarEncargado && encargado !== aprendiz.encargadoId) {
      onAsignarEncargado(aprendiz.id, encargado);
    }
  };

  const handleAvanzarProceso = () => {
    guardarAsignacion();
    onActualizarEstado(aprendiz.id, 'PROCESO');
    onClose();
  };

  const handleJovenPostulado = () => {
    guardarAsignacion();
    onActualizarEstado(aprendiz.id, 'POSTULADO');
    onClose();
  };

  const selectStyle = {
    width: '100%', padding: '10px 12px', border: '1px solid var(--border)', 
    borderRadius: 'var(--radius-md)', fontSize: '14px', fontFamily: "'DM Sans', sans-serif", 
    color: 'var(--gray-900)', background: '#fff', outline: 'none', transition: 'all 200ms ease',
    cursor: 'pointer'
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
      <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 'var(--radius-lg)', width: '100%', maxWidth: '800px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 60px rgba(0,0,0,0.18)', animation: 'modalIn 200ms ease' }}>
        
        <div style={{ padding: '20px 24px', background: 'var(--gray-50)', borderBottom: '1px solid var(--border)', borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 800, fontFamily: "'Plus Jakarta Sans', sans-serif", color: 'var(--gray-900)' }}>
              Información de Postulación
            </h2>
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--gray-500)', fontFamily: "'DM Sans', sans-serif" }}>
              Analiza los documentos y gestiona el avance en el Kanban
            </p>
          </div>
          <button onClick={onClose} style={{ width: '34px', height: '34px', border: 'none', background: 'transparent', borderRadius: 'var(--radius-sm)', cursor: 'pointer', color: 'var(--gray-400)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 150ms ease' }} onMouseEnter={e => { e.currentTarget.style.background = 'var(--gray-100)'; e.currentTarget.style.color = 'var(--gray-700)'; }} onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--gray-400)'; }}>
            <X style={{ width: '18px', height: '18px' }} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              
              <div>
                <SectionTitle icon={User} text="Datos del Aprendiz" />
                <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '16px', background: 'var(--gray-50)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '16px' }}>
                  <InfoRow label="Nombre Completo" value={`${aprendiz.nombre} ${aprendiz.apellido}`} />
                  <InfoRow label="CURP" value={aprendiz.curp} />
                  <InfoRow label="Teléfono" value={aprendiz.telefono} />
                  <InfoRow label="Documentos (Drive)" value={aprendiz.urlRecurso} isLink={true} />
                </div>
              </div>

              <div>
                <SectionTitle icon={Briefcase} text="Datos del Negocio" />
                <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '16px', background: 'var(--gray-50)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '16px' }}>
                  <InfoRow label="Razón Social / Nombre" value={aprendiz.negocio?.nombreNegocio} />
                  <InfoRow label="Encargado del Negocio" value={aprendiz.negocio?.usuario ? `${aprendiz.negocio.usuario.nombre} ${aprendiz.negocio.usuario.apellido}` : ''} icon={User} />
                  <InfoRow label="Dirección" value={aprendiz.negocio?.direccion} icon={MapPin} />
                </div>
              </div>

            </div>

            <div>
              <SectionTitle icon={Shield} text="Asignación Operativa" />
              <div style={{ marginTop: '12px', background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--gray-600)', marginBottom: '8px', fontFamily: "'DM Sans', sans-serif" }}>
                  Usuario asignado para postular
                </label>
                <select 
                  value={encargado} 
                  onChange={(e) => setEncargado(e.target.value)} 
                  style={selectStyle}
                  onFocus={e => { e.target.style.borderColor = 'var(--capyme-blue-mid)'; e.target.style.boxShadow = '0 0 0 3px rgba(43,91,166,0.12)'; }} 
                  onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }}
                >
                  <option value="">-- Seleccionar Encargado --</option>
                  <option value="1">Admin General</option>
                </select>
              </div>
            </div>

          </div>

          <div style={{ padding: '16px 24px', background: 'var(--gray-50)', borderTop: '1px solid var(--border)', borderRadius: '0 0 var(--radius-lg) var(--radius-lg)', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button onClick={onClose} style={{ padding: '9px 24px', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', background: '#fff', color: 'var(--gray-700)', fontSize: '14px', fontWeight: 600, fontFamily: "'DM Sans', sans-serif", cursor: 'pointer', transition: 'all 150ms ease' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--gray-100)'} onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
              Quitar Modal
            </button>

            {estadoActual === 'INICIADO' && (
              <button onClick={handleAvanzarProceso} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 24px', border: 'none', borderRadius: 'var(--radius-md)', background: 'linear-gradient(135deg, #F59E0B, #D97706)', color: '#fff', fontSize: '14px', fontWeight: 600, fontFamily: "'Plus Jakarta Sans', sans-serif", cursor: 'pointer', boxShadow: '0 2px 8px rgba(245,158,11,0.28)', transition: 'all 150ms ease' }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                Avanzar Proceso <ArrowRight style={{ width: '16px', height: '16px' }} />
              </button>
            )}

            {estadoActual === 'PROCESO' && (
              <button onClick={handleJovenPostulado} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 24px', border: 'none', borderRadius: 'var(--radius-md)', background: 'linear-gradient(135deg, #10B981, #059669)', color: '#fff', fontSize: '14px', fontWeight: 600, fontFamily: "'Plus Jakarta Sans', sans-serif", cursor: 'pointer', boxShadow: '0 2px 8px rgba(16,185,129,0.28)', transition: 'all 150ms ease' }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                Joven Postulado <CheckCircle style={{ width: '16px', height: '16px' }} />
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ModalAprendiz;