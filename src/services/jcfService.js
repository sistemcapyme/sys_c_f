import api from './axios'

export const jcfService = {
  getAll: async (params = {}) => (await api.get('/jcf', { params })).data,
  getById: async (id) => (await api.get(`/jcf/${id}`)).data,
  create: async (data) => {
    const payload = data instanceof FormData ? Object.fromEntries(data) : data
    return (await api.post('/jcf', payload)).data
  },
  update: async (id, data) => {
    const payload = data instanceof FormData ? Object.fromEntries(data) : data
    return (await api.put(`/jcf/${id}`, payload)).data
  },
  toggleActivo: async (id) => (await api.patch(`/jcf/${id}/toggle-activo`)).data,
  updateRecurso: async (id, data) => (await api.patch(`/jcf/${id}/recurso`, data)).data,
  getNegocios: async () => (await api.get('/negocios', { params: { activo: 'true' } })).data,
  getClientes: async () => (await api.get('/usuarios', { params: { rol: 'cliente', activo: 'true' } })).data,

  obtenerAprendices: async () => (await api.get('/jcf/aprendices')).data,
  obtenerTodosAprendices: async () => (await api.get('/jcf/aprendices/todos')).data,
  actualizarEstado: async (id, estadoKanban) => (await api.patch(`/jcf/aprendices/${id}/estado`, { estadoKanban })).data,
  asignarEncargado: async (id, encargadoId) => (await api.patch(`/jcf/aprendices/${id}/encargado`, { encargadoId })).data,

  obtenerLideres: async () => (await api.get('/jcf/lideres')).data,
  crearNegocio: async (data) => {
    const payload = data instanceof FormData ? Object.fromEntries(data) : data
    return (await api.post('/jcf/negocios', payload)).data
  },
  crearAprendiz: async (data) => {
    const payload = data instanceof FormData ? Object.fromEntries(data) : data
    return (await api.post('/jcf/aprendices', payload)).data
  },
  actualizarAprendiz: async (id, data) => {
    const payload = data instanceof FormData ? Object.fromEntries(data) : data
    return (await api.put(`/jcf/aprendices/${id}`, payload)).data
  },
  eliminarAprendiz: async (id) => (await api.delete(`/jcf/aprendices/${id}`)).data,

  obtenerEncargados: async () => (await api.get('/jcf/encargados')).data,
  crearEncargado: async (data) => (await api.post('/jcf/encargados', data)).data,
  actualizarEncargado: async (id, data) => (await api.put(`/jcf/encargados/${id}`, data)).data,
  toggleActivoEncargado: async (id) => (await api.patch(`/jcf/encargados/${id}/activo`)).data,
  eliminarEncargado: async (id) => (await api.delete(`/jcf/encargados/${id}`)).data,

  obtenerEncargadosValidos: async () => (await api.get('/distribucionjcf/encargados')).data,

  crearJoven: async (data) => {
    const payload = data instanceof FormData ? Object.fromEntries(data) : data
    return (await api.post('/jcf', payload)).data
  }
}