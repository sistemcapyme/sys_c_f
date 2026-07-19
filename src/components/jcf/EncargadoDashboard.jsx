import React, { useState } from 'react';
import KanbanJCF from './KanbanJCF';
import ModalAprendiz from './ModalAprendiz';

const EncargadoDashboard = ({ user, aprendices, onActualizarEstado }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [aprendizSeleccionado, setAprendizSeleccionado] = useState(null);

  const misAprendices = aprendices.filter(a => a.encargado_id === user.id);
  const postulados = misAprendices.filter(a => a.estado === 'POSTULADO').length;
  const pendientes = misAprendices.filter(a => a.estado === 'PENDIENTE').length;

  const abrirModal = (aprendiz) => {
    setAprendizSeleccionado(aprendiz);
    setModalOpen(true);
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow border-l-4 border-accent flex-1">
          <h3 className="text-lg font-bold">Mis Aprendices a Postular</h3>
          <p className="text-2xl">{pendientes}</p>
        </div>
        <div className="bg-white p-4 rounded shadow border-l-4 border-primary flex-1">
          <h3 className="text-lg font-bold">Postulaciones Exitosas</h3>
          <p className="text-2xl">{postulados}</p>
        </div>
      </div>

      <KanbanJCF 
        aprendices={misAprendices} 
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

export default EncargadoDashboard;