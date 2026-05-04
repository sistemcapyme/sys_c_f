import axios from './axios';

const crearPdf = async (data) => {
  const response = await axios.post('/api/catalogos', data);
  return response.data;
};

const obtenerTodosAdmin = async () => {
  const response = await axios.get('/api/catalogos/admin');
  return response.data;
};

const obtenerPublicos = async () => {
  const response = await axios.get('/api/catalogos/publicos');
  return response.data;
};

const actualizarPdf = async (id, data) => {
  const response = await axios.put(`/api/catalogos/${id}`, data);
  return response.data;
};

const eliminarPdf = async (id) => {
  const response = await axios.delete(`/api/catalogos/${id}`);
  return response.data;
};

const descargarPdf = async (pdf_id, payment_id) => {
  const response = await axios.get(`/api/catalogos/descargar?pdf_id=${pdf_id}&payment_id=${payment_id}`);
  return response.data;
};

export default {
  crearPdf,
  obtenerTodosAdmin,
  obtenerPublicos,
  actualizarPdf,
  eliminarPdf,
  descargarPdf
};