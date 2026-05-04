import axios from './axios';

const crearPdf = async (data) => {
  const response = await axios.post('/catalogos', data);
  return response.data;
};

const obtenerTodosAdmin = async () => {
  const response = await axios.get('/catalogos/admin');
  return response.data;
};

const obtenerPublicos = async () => {
  const response = await axios.get('/catalogos/publicos');
  return response.data;
};

const actualizarPdf = async (id, data) => {
  const response = await axios.put(`/catalogos/${id}`, data);
  return response.data;
};

const eliminarPdf = async (id) => {
  const response = await axios.delete(`/catalogos/${id}`);
  return response.data;
};

const descargarPdf = async (pdf_id, payment_id) => {
  const response = await axios.get(`/catalogos/descargar?pdf_id=${pdf_id}&payment_id=${payment_id}`);
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