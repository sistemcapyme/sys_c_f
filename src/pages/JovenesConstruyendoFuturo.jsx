import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import AdminLiderDashboard from '../components/jcf/AdminLiderDashboard'; 
import EncargadoDashboard from '../components/jcf/EncargadoDashboard';
import Layout from '../components/common/Layout';
import { jcfService } from '../services/jcfService';
import { ShieldAlert } from 'lucide-react';

const DashboardJCF = () => {
  const { user } = useAuth();
  const [aprendices, setAprendices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const data = await jcfService.obtenerAprendices();
        setAprendices(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDatos();
  }, []);

  const actualizarEstadoAprendiz = async (id, nuevoEstado) => {
    try {
      await jcfService.actualizarEstado(id, nuevoEstado);
      setAprendices(prev => 
        prev.map(a => a.id === id ? { ...a, estado_kanban: nuevoEstado } : a)
      );
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <style>{`
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '320px', flexDirection: 'column', gap: '16px' }}>
          <div style={{ width: '40px', height: '40px', border: '3px solid var(--border)', borderTopColor: 'var(--capyme-blue-mid)', borderRadius: '50%', animation: 'spin 700ms linear infinite' }} />
          <p style={{ fontSize: '14px', color: 'var(--gray-400)', fontFamily: "'DM Sans', sans-serif" }}>Cargando módulo JCF...</p>
        </div>
      </Layout>
    );
  }

  const rolUsuario = user?.rol?.toLowerCase();

  return (
    <Layout>
      {['admin', 'lider_jcf'].includes(rolUsuario) ? (
        <AdminLiderDashboard 
          user={user} 
          aprendices={aprendices} 
          onActualizarEstado={actualizarEstadoAprendiz} 
        />
      ) : rolUsuario === 'encargado_jcf' ? (
        <EncargadoDashboard 
          user={user} 
          aprendices={aprendices} 
          onActualizarEstado={actualizarEstadoAprendiz} 
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '40px' }}>
          <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 'var(--radius-lg)', padding: '32px', textAlign: 'center', maxWidth: '400px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
            <ShieldAlert style={{ width: '48px', height: '48px', color: '#DC2626', margin: '0 auto 16px auto' }} />
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#B91C1C', fontFamily: "'Plus Jakarta Sans', sans-serif", margin: '0 0 8px 0' }}>
              Acceso Denegado
            </h2>
            <p style={{ fontSize: '14px', color: '#DC2626', margin: 0, fontFamily: "'DM Sans', sans-serif" }}>
              Tu rol actual ({user?.rol}) no tiene permisos para ver este módulo.
            </p>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default DashboardJCF;