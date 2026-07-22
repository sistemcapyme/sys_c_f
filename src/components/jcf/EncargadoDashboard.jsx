import React, { useState } from 'react';
import Layout from '../components/common/Layout';
import { Users, Plus, ArrowLeft, Mail, Shield } from 'lucide-react';

const AdminLiderDashboard = () => {
  const [vistaActual, setVistaActual] = useState('menu');
  const [usuariosLideres, setUsuariosLideres] = useState([
    { id: 1, nombre: 'Ejemplo Líder', correo: 'lider@ejemplo.com', estado: 'Activo' }
  ]);
  const [hoveredRow, setHoveredRow] = useState(null);

  const btnStyle = {
    display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', 
    background: 'linear-gradient(135deg, var(--capyme-blue-mid), var(--capyme-blue))', 
    color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', 
    fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '14px', fontWeight: 600, 
    cursor: 'pointer', boxShadow: '0 2px 8px rgba(31,78,158,0.28)', transition: 'all 200ms ease'
  };

  if (vistaActual === 'crud') {
    return (
      <Layout>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          
          {/* Header */}
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
                style={btnStyle}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <Plus style={{ width: '16px', height: '16px' }} /> Nuevo Líder
              </button>
            </div>
          </div>

          {/* Tabla */}
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
                            {usuario.nombre?.charAt(0)?.toUpperCase()}{usuario.nombre?.split(' ')[1]?.charAt(0)?.toUpperCase()}
                          </div>
                          <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--gray-800)', fontFamily: "'DM Sans', sans-serif", margin: 0 }}>
                            {usuario.nombre}
                          </p>
                        </div>
                      </td>
                      <td style={{ padding: '14px 24px' }}>
                        <p style={{ fontSize: '13px', color: 'var(--gray-700)', display: 'flex', alignItems: 'center', gap: '5px', margin: 0 }}>
                          <Mail style={{ width: '12px', height: '12px', color: 'var(--gray-400)' }} />
                          {usuario.correo}
                        </p>
                      </td>
                      <td style={{ padding: '14px 24px' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '4px 10px', borderRadius: 'var(--radius-sm)', fontSize: '12px', fontWeight: 600, fontFamily: "'DM Sans', sans-serif", background: '#ECFDF5', color: '#065F46' }}>
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981', display: 'inline-block' }} />
                          {usuario.estado}
                        </span>
                      </td>
                      <td style={{ padding: '14px 24px', textAlign: 'right' }}>
                        <button 
                          style={{ padding: '6px 14px', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', background: '#EEF4FF', color: 'var(--capyme-blue-mid)', fontSize: '12px', fontWeight: 600, fontFamily: "'DM Sans', sans-serif", cursor: 'pointer', transition: 'all 150ms ease' }}
                          onMouseEnter={e => { e.currentTarget.style.background = 'var(--capyme-blue-mid)'; e.currentTarget.style.color = '#fff'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = '#EEF4FF'; e.currentTarget.style.color = 'var(--capyme-blue-mid)'; }}
                        >
                          Editar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
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
        
        <div style={{ width: '100%', maxWidth: '320px', marginTop: '10px' }}>
          <button
            onClick={() => setVistaActual('crud')}
            style={{ width: '100%', padding: '16px', background: 'linear-gradient(135deg, var(--capyme-blue-mid), var(--capyme-blue))', color: '#fff', border: 'none', borderRadius: 'var(--radius-lg)', fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '16px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 14px rgba(31,78,158,0.25)', transition: 'all 200ms ease', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <Users style={{ width: '20px', height: '20px' }} />
            Gestionar Líderes
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default AdminLiderDashboard;