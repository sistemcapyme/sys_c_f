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
  obtenerAprendices: async () => (await api.get('/jcf/aprendices')).data,
  actualizarEstado: async (id, estadoKanban) => (await api.patch(`/jcf/aprendices/${id}/estado`, { estadoKanban })).data,
  asignarEncargado: async (id, encargadoId) => (await api.patch(`/jcf/aprendices/${id}/encargado`, { encargadoId })).data,
  obtenerLideres: async () => (await api.get('/jcf/lideres')).data,
  crearNegocio: async (data) => (await api.post('/jcf/negocios', data)).data,
  crearAprendiz: async (data) => (await api.post('/api/jcf/aprendices', data)).data,
  actualizarAprendiz: async (id, data) => (await api.put(`/api/jcf/aprendices/${id}`, data)).data, 
  obtenerEncargados: async () => (await api.get('/api/encargados')).data,
  obtenerJovenes: async () => (await api.get('/api/jcf/jovenes')).data,
  crearJoven: async (data) => (await api.post('/api/jcf/jovenes', data)).data,
  actualizarJoven: async (id, data) => (await api.put(`/api/jcf/jovenes/${id}`, data)).data,
  eliminarJoven: async (id) => (await api.delete(`/api/jcf/jovenes/${id}`)).data
};