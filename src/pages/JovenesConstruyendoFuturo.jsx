import React from 'react';
import { Navigate } from 'react-router-dom';
import AdminLiderDashboard from '../components/jcf/AdminLiderDashboard';

const JovenesConstruyendoFuturo = () => {
  const authStorage = JSON.parse(localStorage.getItem('auth-storage') || '{}');
  const currentUser = authStorage?.state?.user || {};
  const rolUsuario = currentUser?.rol?.toLowerCase();

  // Si el usuario es un encargado, redirigir inmediatamente al Kanban
  if (rolUsuario === 'encargado' || rolUsuario === 'encargado_jcf') {
    return <Navigate to="/jcf/kanban" replace />;
  }

  // Si es Admin o Líder, mostrar el Dashboard (que incluye menú y gestión)
  return <AdminLiderDashboard />;
};

export default JovenesConstruyendoFuturo;