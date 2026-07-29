import api from './axios';

const ENCARGADOS_URL = '/encargados';

export const getEncargados = async () => {
  const response = await api.get(ENCARGADOS_URL);
  return response.data;
};

export const createEncargado = async (encargadoData) => {
  const response = await api.post(ENCARGADOS_URL, encargadoData);
  return response.data;
};

export const updateEncargado = async (id, encargadoData) => {
  const response = await api.put(`${ENCARGADOS_URL}/${id}`, encargadoData);
  return response.data;
};

export const deleteEncargado = async (id) => {
  const response = await api.delete(`${ENCARGADOS_URL}/${id}`);
  return response.data;
};