import React, { useState, useEffect } from 'react';
import ModalAprendiz from './ModalAprendiz';
import { jcfService } from '../../services/jcfService';

const KanbanJCF = () => {
  const [tareas, setTareas] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [tareaSeleccionada, setTareaSeleccionada] = useState(null);

  useEffect(() => {
    cargarTareas();
  }, []);

  const cargarTareas = async () => {
    try {
      const data = await jcfService.obtenerAprendices();
      setTareas(data);
    } catch (error) {
      console.error(error);
    }
  };

  const abrirModal = (tarea = null) => {
    setTareaSeleccionada(tarea);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setTareaSeleccionada(null);
    setModalAbierto(false);
  };

  const guardarTarea = async (datos) => {
    try {
      if (tareaSeleccionada) {
        await jcfService.actualizarAprendiz(tareaSeleccionada.id, datos);
      } else {
        await jcfService.crearAprendiz(datos);
      }
      cargarTareas();
      cerrarModal();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="kanban-container" style={{ backgroundColor: '#ffffff' }}>
      <div className="kanban-header">
        <h2>Kanban Jóvenes Construyendo el Futuro</h2>
        <button className="btn-primary" onClick={() => abrirModal()}>Nueva Tarea</button>
      </div>
      <div className="kanban-board">
        <div className="kanban-column">
          <h3>Pendientes</h3>
          {tareas.filter(t => t.estado === 'pendiente').map(tarea => (
            <div key={tarea.id} className="kanban-card" onClick={() => abrirModal(tarea)}>
              <h4>{tarea.titulo}</h4>
              <p>{tarea.descripcion}</p>
            </div>
          ))}
        </div>
        <div className="kanban-column">
          <h3>En Progreso</h3>
          {tareas.filter(t => t.estado === 'en_progreso').map(tarea => (
            <div key={tarea.id} className="kanban-card" onClick={() => abrirModal(tarea)}>
              <h4>{tarea.titulo}</h4>
              <p>{tarea.descripcion}</p>
            </div>
          ))}
        </div>
        <div className="kanban-column">
          <h3>Completado</h3>
          {tareas.filter(t => t.estado === 'completado').map(tarea => (
            <div key={tarea.id} className="kanban-card" onClick={() => abrirModal(tarea)}>
              <h4>{tarea.titulo}</h4>
              <p>{tarea.descripcion}</p>
            </div>
          ))}
        </div>
      </div>
      <ModalAprendiz
        isOpen={modalAbierto}
        onClose={cerrarModal}
        onSave={guardarTarea}
        tareaData={tareaSeleccionada}
      />
    </div>
  );
};

export default KanbanJCF;