import axios from './axios';

const getContactos = async () => {
  const response = await axios.get('/api/contacto');
  return response.data;
};

const createContacto = async (contactoData) => {
  const response = await axios.post('/api/contacto', contactoData);
  return response.data;
};

const contactoService = {
  getContactos,
  createContacto,
};
export { contactoService };
export default contactoService;