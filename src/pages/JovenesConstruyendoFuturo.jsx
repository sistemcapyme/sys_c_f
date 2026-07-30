import React from 'react';
import { Navigate } from 'react-router-dom';
import AdminLiderDashboard from '../components/jcf/AdminLiderDashboard';

const JovenesConstruyendoFuturo = () => {
  const authStorage = JSON.parse(localStorage.getItem('auth-storage') || '{}');
  const currentUser = authStorage?.state?.user || {};
  const rolUsuario = currentUser?.rol?.toLowerCase();

  if (rolUsuario === 'encargado' || rolUsuario === 'encargado_jcf') {
    return <Navigate to="/jcf/kanban" replace />;
  }

  return <AdminLiderDashboard />;
};

export default JovenesConstruyendoFuturo;