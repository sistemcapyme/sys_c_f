import axios from './axios';

export const catalogosService = {
  obtenerPublicos: async () => {
    const res = await axios.get('/catalogos/publicos');
    return res.data;
  },
  descargarPdf: async (pdfId, paymentId) => {
    const res = await axios.get(`/catalogos/descargar?pdf_id=${pdfId}&payment_id=${paymentId}`);
    return res.data;
  },
  obtenerTodosAdmin: async () => {
    const res = await axios.get('/catalogos/admin');
    return res.data;
  },
  crearPdf: async (data) => {
    const res = await axios.post('/catalogos', data);
    return res.data;
  },
  actualizarPdf: async (id, data) => {
    const res = await axios.put(`/catalogos/${id}`, data);
    return res.data;
  },
  eliminarPdf: async (id) => {
    const res = await axios.delete(`/catalogos/${id}`);
    return res.data;
  }
};