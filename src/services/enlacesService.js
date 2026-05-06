import api from './axios';

export const enlacesService = {
  getAll: async (params = {}) => (await api.get('/enlaces', { params })).data,
  getById: async (id) => (await api.get(`/enlaces/${id}`)).data,
  create: async (data) => (await api.post('/enlaces', data, { headers: { 'Content-Type': 'multipart/form-data' } })).data,
  update: async (id, data) => (await api.put(`/enlaces/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } })).data,
  delete: async (id) => (await api.delete(`/enlaces/${id}`)).data,
  toggleActivo: async (id) => (await api.patch(`/enlaces/${id}/toggle-activo`)).data,
  solicitarAcceso: async (id, data) => (await api.post(`/enlaces/${id}/solicitar-acceso`, data)).data,
  confirmarPorReferencia: async (referencia) => (await api.post('/enlaces/confirmar', { referencia })).data,
  getAccesos: async (id) => (await api.get(`/enlaces/${id}/accesos`)).data,
  crearPreferenciaMP: async (data) => (await api.post('/pagos-recursos/crear-preferencia', data)).data,
};