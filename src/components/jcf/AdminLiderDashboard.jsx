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
    <div className="p-6 max-w-7xl mx-auto flex flex-col gap-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <div className="bg-blue-800 p-3 rounded-lg text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Jóvenes Construyendo el Futuro</h1>
            <p className="text-gray-500 text-sm">{aprendices.length} beneficiarios</p>
          </div>
        </div>
        <button className="bg-blue-800 hover:bg-blue-900 text-white font-medium py-2 px-4 rounded-md flex items-center gap-2 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Nuevo Beneficiario
        </button>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Buscar por nombre, CURP, estatus, cliente..."
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
          </svg>
          Filtros
        </button>
      </div>

      <div className="flex flex-wrap gap-3">
        {user.rol?.toLowerCase() === 'admin' && (
          <button className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded shadow-sm hover:bg-gray-50 font-medium text-sm">
            Líder JCF
          </button>
        )}
        <button className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded shadow-sm hover:bg-gray-50 font-medium text-sm">
          Colaboradores Encargados
        </button>
        <button className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded shadow-sm hover:bg-gray-50 font-medium text-sm">
          Negocios JCF
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <KanbanJCF 
          aprendices={aprendices} 
          onActualizarEstado={onActualizarEstado} 
          onVerDetalle={abrirModal} 
        />
      </div>

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