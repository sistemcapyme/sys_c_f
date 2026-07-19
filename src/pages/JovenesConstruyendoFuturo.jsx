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
        prev.map(a => a.id === id ? { ...a, estado_kanban: nuevoEstado } : a)
      );
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading) return <Layout><div className="p-6 text-blue-800 font-medium">Cargando...</div></Layout>;

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
        <div className="p-6 flex flex-col items-center justify-center h-full">
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg shadow-sm">
            <h2 className="font-bold text-lg mb-2">Acceso Denegado</h2>
            <p>Tu rol actual ({user?.rol}) no tiene permisos para ver este módulo.</p>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default DashboardJCF;