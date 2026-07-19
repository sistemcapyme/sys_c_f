import React, { useState } from 'react';
import KanbanJCF from './KanbanJCF';
import ModalAprendiz from './ModalAprendiz';

const AdminLiderDashboard = ({ user, aprendices, onActualizarEstado }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [aprendizSeleccionado, setAprendizSeleccionado] = useState(null);

  const abrirModal = (aprendiz) => {
    setAprendizSeleccionado(aprendiz);
    setModalOpen(true);
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-wrap gap-4 mb-6">
        {user.rol === 'ADMIN' && (
          <button className="bg-primary text-white px-4 py-2 rounded shadow hover:bg-opacity-90">
            Líder JCF (CRUD)
          </button>
        )}
        
        {['ADMIN', 'LIDER_JCF'].includes(user.rol) && (
          <>
            <button className="bg-primary text-white px-4 py-2 rounded shadow hover:bg-opacity-90">
              Colaboradores Encargados JCF (CRUD)
            </button>
            <button className="bg-secondary text-white px-4 py-2 rounded shadow hover:bg-opacity-90">
              Negocios JCF (CRUD)
            </button>
            <button className="bg-accent text-white px-4 py-2 rounded shadow hover:bg-opacity-90">
              Gestión de Aprendices (CRUD)
            </button>
          </>
        )}
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-bold mb-4 text-primary">Rendimiento de Encargados</h2>
        <div className="flex gap-4">
          <div className="p-4 border rounded border-gray-200 flex-1">
            <h3 className="font-semibold text-green-600">Postulaciones Completadas</h3>
          </div>
          <div className="p-4 border rounded border-gray-200 flex-1">
            <h3 className="font-semibold text-red-600">Postulaciones Pendientes</h3>
          </div>
        </div>
      </div>

      <KanbanJCF 
        aprendices={aprendices} 
        onActualizarEstado={onActualizarEstado} 
        onVerDetalle={abrirModal} 
      />

      {modalOpen && (
        <ModalAprendiz 
          aprendiz={aprendizSeleccionado} 
          onClose={() => setModalOpen(false)} 
        />
      )}
    </div>
  );
};

export default AdminLiderDashboard;