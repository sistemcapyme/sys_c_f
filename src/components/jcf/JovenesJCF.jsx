import React, { useState, useEffect } from 'react';
import ModalJovenJCF from './ModalJovenJCF';
import { jcfService } from '../../services/jcfService';

const JovenesJCF = () => {
  const [jovenes, setJovenes] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [jovenSeleccionado, setJovenSeleccionado] = useState(null);

  useEffect(() => {
    cargarJovenes();
  }, []);

  const cargarJovenes = async () => {
    try {
      const data = await jcfService.obtenerJovenes();
      setJovenes(data);
    } catch (error) {
      console.error(error);
    }
  };

  const abrirModal = (joven = null) => {
    setJovenSeleccionado(joven);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setJovenSeleccionado(null);
    setModalAbierto(false);
  };

  const guardarJoven = async (datos) => {
    try {
      if (jovenSeleccionado) {
        await jcfService.actualizarJoven(jovenSeleccionado.id, datos);
      } else {
        await jcfService.crearJoven(datos);
      }
      cargarJovenes();
      cerrarModal();
    } catch (error) {
      console.error(error);
    }
  };

  const eliminarJoven = async (id) => {
    try {
      await jcfService.eliminarJoven(id);
      cargarJovenes();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="crud-container" style={{ backgroundColor: '#ffffff', padding: '20px' }}>
      <div className="crud-header">
        <h2>Gestión de Jóvenes JCF</h2>
        <button className="btn-primary" onClick={() => abrirModal()}>Registrar Joven JCF</button>
      </div>
      <table className="crud-table">
        <thead>
          <tr>
            <th>Nombre Completo</th>
            <th>Negocio</th>
            <th>Encargado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {jovenes.map((joven) => (
            <tr key={joven.id}>
              <td>{joven.nombreCompleto}</td>
              <td>{joven.nombreNegocio}</td>
              <td>{joven.encargadoNombre}</td>
              <td>
                <button className="btn-edit" onClick={() => abrirModal(joven)}>Editar</button>
                <button className="btn-delete" onClick={() => eliminarJoven(joven.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ModalJovenJCF
        isOpen={modalAbierto}
        onClose={cerrarModal}
        onSave={guardarJoven}
        jovenData={jovenSeleccionado}
      />
    </div>
  );
};

export default JovenesJCF;