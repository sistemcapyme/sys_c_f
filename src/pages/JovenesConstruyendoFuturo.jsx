import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth'; 
import AdminLiderDashboard from '../components/jcf/AdminLiderDashboard'; 
import EncargadoDashboard from '../components/jcf/EncargadoDashboard';
import Layout from '../components/common/Layout';
import { jcfService } from '../services/jcfService';

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
        prev.map(a => a.id === id ? { ...a, estado: nuevoEstado } : a)
      );
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading) return <Layout><div className="text-primary font-bold">Cargando...</div></Layout>;

  return (
    <Layout>
      {['ADMIN', 'LIDER_JCF'].includes(user?.rol) ? (
        <AdminLiderDashboard 
          user={user} 
          aprendices={aprendices} 
          onActualizarEstado={actualizarEstadoAprendiz} 
        />
      ) : user?.rol === 'ENCARGADO_JCF' ? (
        <EncargadoDashboard 
          user={user} 
          aprendices={aprendices} 
          onActualizarEstado={actualizarEstadoAprendiz} 
        />
      ) : (
        <div className="text-red-500">Acceso Denegado</div>
      )}
    </Layout>
  );
};

export default DashboardJCF;