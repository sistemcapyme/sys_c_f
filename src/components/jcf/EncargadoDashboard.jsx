import React, { useState, useEffect } from 'react';
import axios from '../../services/axios';

const EncargadoDashboard = () => {
  const [vistaActual, setVistaActual] = useState('menu');
  const [jovenesPostulados, setJovenesPostulados] = useState([]);
  const [cargando, setCargando] = useState(false);

  const fetchJovenes = async () => {
    setCargando(true);
    try {
      const response = await axios.get('/api/jcf/aprendices');
      setJovenesPostulados(response.data);
    } catch (error) {
      console.error('Error al obtener los jóvenes:', error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    if (vistaActual === 'crud') {
      fetchJovenes();
    }
  }, [vistaActual]);

  if (vistaActual === 'crud') {
    return (
      <div className="p-8 w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Jóvenes Postulados</h2>
          <div>
            <button 
              onClick={() => setVistaActual('menu')} 
              className="mr-4 bg-gray-500 text-white px-4 py-2 rounded shadow hover:bg-gray-600 transition"
            >
              Volver al Inicio
            </button>
            <button className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700 transition">
              Nuevo Joven
            </button>
          </div>
        </div>
        
        {cargando ? (
          <p className="text-center text-gray-600 font-semibold">Cargando datos...</p>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full leading-normal">
              <thead>
                <tr>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    CURP
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Estatus
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {jovenesPostulados.map((joven) => (
                  <tr key={joven.id}>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">{joven.id}</p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">{joven.nombre} {joven.apellido}</p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">{joven.curp}</p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <span className="relative inline-block px-3 py-1 font-semibold text-blue-900 leading-tight">
                        <span aria-hidden className="absolute inset-0 bg-blue-200 opacity-50 rounded-full"></span>
                        <span className="relative">{joven.estatus}</span>
                      </span>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">
                      <button className="bg-yellow-500 text-white px-3 py-1 rounded shadow hover:bg-yellow-600 transition">
                        Editar
                      </button>
                    </td>
                  </tr>
                ))}
                {jovenesPostulados.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">
                      No hay jóvenes registrados
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-50">
      <h1 className="text-3xl font-bold mb-10 text-gray-800">Dashboard Encargado JCF</h1>
      <div className="w-full max-w-md">
        <button
          onClick={() => setVistaActual('crud')}
          className="w-full bg-green-600 text-white font-bold py-6 px-4 rounded-xl shadow-lg hover:bg-green-700 hover:shadow-xl transition duration-300 text-xl"
        >
          Jóvenes Postulados
        </button>
      </div>
    </div>
  );
};

export default EncargadoDashboard;