import React, { useState, useEffect } from 'react';
import { jcfService } from '../../services/jcfService';
import { Plus, GripVertical } from 'lucide-react';
import ModalAprendizKanban from './ModalAprendizKanban';

const KanbanJCF = () => {
  const [aprendices, setAprendices] = useState([]);
  const [encargados, setEncargados] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAprendiz, setSelectedAprendiz] = useState(null);

  const columnas = [
    { id: 'PENDIENTE', titulo: 'Pendientes', color: 'border-l-yellow-500' },
    { id: 'EN_PROCESO', titulo: 'En Proceso', color: 'border-l-blue-500' },
    { id: 'POSTULADO', titulo: 'Postulados', color: 'border-l-green-500' }
  ];

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const resAprendices = await jcfService.obtenerAprendices();
      if (resAprendices.success) setAprendices(resAprendices.data);
      
      const resEncargados = await jcfService.obtenerEncargados();
      setEncargados(resEncargados);
    } catch (error) {
      console.error('Error al cargar datos Kanban:', error);
    }
  };

  const handleDragStart = (e, id) => {
    e.dataTransfer.setData('aprendizId', id);
  };

  const handleDrop = async (e, nuevoEstado) => {
    e.preventDefault();
    const aprendizId = e.dataTransfer.getData('aprendizId');
    
    setAprendices(prev => prev.map(a => 
      a.id === Number(aprendizId) ? { ...a, estadoKanban: nuevoEstado } : a
    ));

    try {
      await jcfService.actualizarEstado(aprendizId, nuevoEstado);
    } catch (error) {
      console.error('Error actualizando estado:', error);
      cargarDatos();
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const openModal = (aprendiz = null) => {
    setSelectedAprendiz(aprendiz);
    setModalOpen(true);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Kanban de Postulaciones</h1>
          <p className="text-sm text-gray-500">Arrastra las tarjetas para cambiar su estado</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus size={20} />
          Nuevo Registro
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columnas.map(col => (
          <div 
            key={col.id}
            onDrop={(e) => handleDrop(e, col.id)}
            onDragOver={handleDragOver}
            className="bg-gray-50 rounded-xl p-4 min-h-[500px]"
          >
            <h3 className="font-bold text-gray-700 mb-4 pb-2 border-b-2 border-gray-200">
              {col.titulo}
            </h3>
            <div className="flex flex-col gap-3">
              {aprendices.filter(a => a.estadoKanban === col.id).map(aprendiz => (
                <div
                  key={aprendiz.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, aprendiz.id)}
                  onClick={() => openModal(aprendiz)}
                  className={`bg-white p-4 rounded-lg shadow-sm border-l-4 ${col.color} cursor-pointer hover:shadow-md transition-shadow relative group`}
                >
                  <GripVertical size={16} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-300 opacity-0 group-hover:opacity-100" />
                  <h4 className="font-bold text-gray-800 text-sm mb-1">{aprendiz.nombre} {aprendiz.apellido}</h4>
                  <p className="text-xs text-gray-500">
                    Encargado: {aprendiz.encargado ? `${aprendiz.encargado.nombre} ${aprendiz.encargado.apellido}` : 'Sin asignar'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <ModalAprendizKanban 
          aprendiz={selectedAprendiz} 
          encargados={encargados}
          onClose={() => setModalOpen(false)} 
          onRefresh={cargarDatos}
        />
      )}
    </div>
  );
};

export default KanbanJCF;