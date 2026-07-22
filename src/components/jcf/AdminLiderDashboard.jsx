import React, { useState } from 'react';

const AdminLiderDashboard = () => {
  const [vistaActual, setVistaActual] = useState('menu');
  const [usuariosLideres, setUsuariosLideres] = useState([
    { id: 1, nombre: 'Ejemplo Líder', correo: 'lider@ejemplo.com', estado: 'Activo' }
  ]);

  if (vistaActual === 'crud') {
    return (
      <div className="p-8 w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Usuarios Líderes</h2>
          <div>
            <button 
              onClick={() => setVistaActual('menu')} 
              className="mr-4 bg-gray-500 text-white px-4 py-2 rounded shadow hover:bg-gray-600 transition"
            >
              Volver al Inicio
            </button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition">
              Nuevo Usuario Líder
            </button>
          </div>
        </div>
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
                  Correo
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {usuariosLideres.map((usuario) => (
                <tr key={usuario.id}>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{usuario.id}</p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{usuario.nombre}</p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{usuario.correo}</p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <span className="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
                      <span aria-hidden className="absolute inset-0 bg-green-200 opacity-50 rounded-full"></span>
                      <span className="relative">{usuario.estado}</span>
                    </span>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">
                    <button className="bg-yellow-500 text-white px-3 py-1 rounded shadow hover:bg-yellow-600 transition">
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-50">
      <h1 className="text-3xl font-bold mb-10 text-gray-800">Dashboard Líder JCF</h1>
      <div className="w-full max-w-md">
        <button
          onClick={() => setVistaActual('crud')}
          className="w-full bg-blue-600 text-white font-bold py-6 px-4 rounded-xl shadow-lg hover:bg-blue-700 hover:shadow-xl transition duration-300 text-xl"
        >
          Usuarios Líderes
        </button>
      </div>
    </div>
  );
};

export default AdminLiderDashboard;