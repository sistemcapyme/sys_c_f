import api from './axios';

export const jcfService = {
  getAll: async (params = {}) => (await api.get('/jcf', { params })).data,
  getById: async (id) => (await api.get(`/jcf/${id}`)).data,
  create: async (data) => (await api.post('/jcf', data)).data,
  update: async (id, data) => (await api.put(`/jcf/${id}`, data)).data,
  toggleActivo: async (id) => (await api.patch(`/jcf/${id}/toggle-activo`)).data,
  updateRecurso: async (id, data) => (await api.patch(`/jcf/${id}/recurso`, data)).data,
  getNegocios: async () => (await api.get('/negocios', { params: { activo: 'true' } })).data,
  getClientes: async () => (await api.get('/usuarios', { params: { rol: 'cliente', activo: 'true' } })).data,
  obtenerAprendices: async () => {
    const response = await api.get('/jcf/aprendices');
    return response.data;
  },
  actualizarEstado: async (id, estadoKanban) => {
    const response = await api.patch(`/jcf/aprendices/${id}/estado`, { estadoKanban });
    return response.data;
  },
  asignarEncargado: async (id, encargadoId) => {
    const response = await api.patch(`/jcf/aprendices/${id}/encargado`, { encargadoId });
    return response.data;
  }
};
