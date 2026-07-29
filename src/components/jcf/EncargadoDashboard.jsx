import React, { useState, useEffect } from 'react';
import Layout from '../common/Layout';
import axios from '../../services/axios';
import { Users, Plus, ArrowLeft, User, Briefcase, FileText } from 'lucide-react';

const EncargadoDashboard = () => {
  const [vistaActual, setVistaActual] = useState('menu');
  const [jovenesPostulados, setJovenesPostulados] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [hoveredRow, setHoveredRow] = useState(null);

  const fetchJovenes = async () => {
    setCargando(true);
    try {
      const response = await axios.get('/api/jcf/aprendices');
      setJovenesPostulados(response.data);
    } catch (error) {
      console.error('Error al obtener los jóvenes:', error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    if (vistaActual === 'crud') {
      fetchJovenes();
    }
  }, [vistaActual]);

  const btnStyle = {
    display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', 
    background: 'linear-gradient(135deg, #10B981, #059669)', 
    color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', 
    fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '14px', fontWeight: 600, 
    cursor: 'pointer', boxShadow: '0 2px 8px rgba(16, 185, 129, 0.28)', transition: 'all 200ms ease'
  };

  if (vistaActual === 'crud') {
    return (
      <Layout>
        <style>{`
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
            <div>
              <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '26px', fontWeight: 800, color: 'var(--gray-900)', letterSpacing: '-0.02em', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Users style={{ width: '28px', height: '28px', color: '#10B981' }} />
                Jóvenes Postulados
              </h1>
              <p style={{ fontSize: '14px', color: 'var(--gray-500)', fontFamily: "'DM Sans', sans-serif" }}>
                {jovenesPostulados.length} joven{jovenesPostulados.length !== 1 ? 'es' : ''} registrado{jovenesPostulados.length !== 1 ? 's' : ''}
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
                <Plus style={{ width: '16px', height: '16px' }} /> Nuevo Joven
              </button>
            </div>
          </div>

          {cargando ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px', flexDirection: 'column', gap: '16px' }}>
              <div style={{ width: '40px', height: '40px', border: '3px solid var(--border)', borderTopColor: '#10B981', borderRadius: '50%', animation: 'spin 700ms linear infinite' }} />
              <p style={{ fontSize: '14px', color: 'var(--gray-400)', fontFamily: "'DM Sans', sans-serif" }}>Cargando jóvenes...</p>
            </div>
          ) : (
            <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: 'var(--gray-50)' }}>
                      {['ID', 'Nombre', 'CURP', 'Estatus', 'Acciones'].map((h, i) => (
                        <th key={h} style={{ padding: '14px 24px', textAlign: i === 4 ? 'right' : 'left', fontSize: '11px', fontWeight: 700, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: "'Plus Jakarta Sans', sans-serif", borderBottom: '1px solid var(--border)', whiteSpace: 'nowrap' }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {jovenesPostulados.map((joven) => (
                      <tr 
                        key={joven.id}
                        onMouseEnter={() => setHoveredRow(joven.id)}
                        onMouseLeave={() => setHoveredRow(null)}
                        style={{ borderBottom: '1px solid var(--border)', transition: 'background 150ms ease', background: hoveredRow === joven.id ? 'var(--gray-50)' : 'transparent' }}
                      >
                        <td style={{ padding: '14px 24px', fontSize: '13px', fontWeight: 600, color: 'var(--gray-900)', fontFamily: "'DM Sans', sans-serif" }}>
                          {joven.id}
                        </td>
                        <td style={{ padding: '14px 24px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669', fontSize: '13px', fontWeight: 700, fontFamily: "'Plus Jakarta Sans', sans-serif", flexShrink: 0 }}>
                              <User style={{ width: '18px', height: '18px' }} />
                            </div>
                            <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--gray-800)', fontFamily: "'DM Sans', sans-serif", margin: 0 }}>
                              {joven.nombre} {joven.apellido}
                            </p>
                          </div>
                        </td>
                        <td style={{ padding: '14px 24px' }}>
                          <p style={{ fontSize: '13px', color: 'var(--gray-700)', display: 'flex', alignItems: 'center', gap: '5px', margin: 0 }}>
                            <FileText style={{ width: '12px', height: '12px', color: 'var(--gray-400)' }} />
                            {joven.curp}
                          </p>
                        </td>
                        <td style={{ padding: '14px 24px' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '4px 10px', borderRadius: 'var(--radius-sm)', fontSize: '12px', fontWeight: 600, fontFamily: "'DM Sans', sans-serif", background: '#EEF4FF', color: 'var(--capyme-blue-mid)' }}>
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--capyme-blue)', display: 'inline-block' }} />
                            {joven.estatus}
                          </span>
                        </td>
                        <td style={{ padding: '14px 24px', textAlign: 'right' }}>
                          <button 
                            style={{ padding: '6px 14px', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', background: '#FEFCE8', color: '#B45309', fontSize: '12px', fontWeight: 600, fontFamily: "'DM Sans', sans-serif", cursor: 'pointer', transition: 'all 150ms ease' }}
                            onMouseEnter={e => { e.currentTarget.style.background = '#B45309'; e.currentTarget.style.color = '#fff'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = '#FEFCE8'; e.currentTarget.style.color = '#B45309'; }}
                          >
                            Editar
                          </button>
                        </td>
                      </tr>
                    ))}
                    {jovenesPostulados.length === 0 && (
                      <tr>
                        <td colSpan="5" style={{ padding: '60px 24px', textAlign: 'center' }}>
                          <Users style={{ width: '40px', height: '40px', color: 'var(--gray-200)', margin: '0 auto 12px' }} />
                          <p style={{ fontSize: '14px', color: 'var(--gray-400)', fontWeight: 500, fontFamily: "'DM Sans', sans-serif", margin: 0 }}>No hay jóvenes registrados</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '70vh', gap: '24px' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '64px', height: '64px', background: '#ECFDF5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: '0 4px 12px rgba(16,185,129,0.1)' }}>
            <Briefcase style={{ width: '32px', height: '32px', color: '#10B981' }} />
          </div>
          <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '28px', fontWeight: 800, color: 'var(--gray-900)', margin: '0 0 8px 0', letterSpacing: '-0.02em' }}>
            Dashboard Encargado JCF
          </h1>
          <p style={{ fontSize: '15px', color: 'var(--gray-500)', fontFamily: "'DM Sans', sans-serif", maxWidth: '400px', margin: 0, lineHeight: 1.5 }}>
            Administra y da seguimiento a los jóvenes postulados en el programa Construyendo el Futuro.
          </p>
        </div>
        
        <div style={{ width: '100%', maxWidth: '320px', marginTop: '10px' }}>
          <button
            onClick={() => setVistaActual('crud')}
            style={{ width: '100%', padding: '16px', background: 'linear-gradient(135deg, #10B981, #059669)', color: '#fff', border: 'none', borderRadius: 'var(--radius-lg)', fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '16px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 14px rgba(16, 185, 129, 0.25)', transition: 'all 200ms ease', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <Users style={{ width: '20px', height: '20px' }} />
            Jóvenes Postulados
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default EncargadoDashboard;