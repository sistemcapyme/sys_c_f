import React, { useState, useEffect } from 'react';
import { jcfService } from '../../services/jcfService';

const ModalJovenJCF = ({ isOpen, onClose, onSave, jovenData }) => {
  const [formData, setFormData] = useState({
    nombreCompleto: '',
    linkPapeles: '',
    credencialesJcf: '',
    nombreNegocio: '',
    linkImagenNegocio: '',
    encargadoId: ''
  });
  const [encargados, setEncargados] = useState([]);

  useEffect(() => {
    if (isOpen) {
      cargarEncargados();
      if (jovenData) {
        setFormData(jovenData);
      } else {
        setFormData({
          nombreCompleto: '',
          linkPapeles: '',
          credencialesJcf: '',
          nombreNegocio: '',
          linkImagenNegocio: '',
          encargadoId: ''
        });
      }
    }
  }, [isOpen, jovenData]);

  const cargarEncargados = async () => {
    try {
      const data = await jcfService.obtenerEncargados();
      setEncargados(Array.isArray(data) ? data : (data?.data || []));
    } catch (error) {
      console.error(error);
      setEncargados([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ backgroundColor: '#ffffff', color: '#000000', padding: '20px', borderRadius: '8px' }}>
        <h2>{jovenData ? 'Editar Joven JCF' : 'Registrar Joven JCF'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Nombre Completo</label>
            <input type="text" name="nombreCompleto" value={formData.nombreCompleto} onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
          </div>
          <div className="form-group" style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Link de Papeles del Joven</label>
            <input type="url" name="linkPapeles" value={formData.linkPapeles} onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
          </div>
          <div className="form-group" style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Usuario y Contraseña Plataforma JCF</label>
            <textarea name="credencialesJcf" value={formData.credencialesJcf} onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
          </div>

          <hr className="separator" style={{ border: 'none', borderTop: '1px solid #cccccc', margin: '25px 0' }} />

          <div className="form-group" style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Nombre del Negocio</label>
            <input type="text" name="nombreNegocio" value={formData.nombreNegocio} onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
          </div>
          <div className="form-group" style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Link de Imagen de la Información del Negocio</label>
            <input type="url" name="linkImagenNegocio" value={formData.linkImagenNegocio} onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
          </div>

          <hr className="separator-highlight" style={{ border: 'none', borderTop: '3px solid #0056b3', margin: '30px 0' }} />

          <div className="form-group" style={{ marginBottom: '25px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#0056b3', fontSize: '1.1em' }}>Encargarlo a:</label>
            <select name="encargadoId" value={formData.encargadoId} onChange={handleChange} required style={{ width: '100%', padding: '10px', border: '2px solid #0056b3' }}>
              <option value="">Seleccione un encargado</option>
              {(Array.isArray(encargados) ? encargados : []).map((encargado) => (
                <option key={encargado.id} value={encargado.id}>
                  {encargado.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="modal-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button type="button" className="btn-cancel" onClick={onClose} style={{ padding: '10px 20px', backgroundColor: '#f44336', color: '#fff', border: 'none', cursor: 'pointer' }}>Cancelar</button>
            <button type="submit" className="btn-submit" style={{ padding: '10px 20px', backgroundColor: '#4CAF50', color: '#fff', border: 'none', cursor: 'pointer' }}>Guardar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalJovenJCF;