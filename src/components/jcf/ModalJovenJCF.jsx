import { useState, useEffect } from 'react'
import api from '../../services/axios'

const ModalJovenJCF = ({ isOpen, onClose, onSave, jovenData }) => {
  const [formData, setFormData] = useState({
    nombre: jovenData?.nombre || '',
    negocio: jovenData?.negocio || '',
    encargadoId: jovenData?.encargadoId || ''
  })
  const [usuariosOptions, setUsuariosOptions] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen) {
      fetchUsuariosAsignables()
    }
  }, [isOpen])

  const fetchUsuariosAsignables = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/usuarios')
      const asignables = data.filter(user =>
        ['ENCARGADO_JCF', 'ADMIN', 'LIDER'].includes(user.rol.toUpperCase())
      )
      setUsuariosOptions(asignables)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    await onSave(formData)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          {jovenData ? 'Editar Joven JCF' : 'Registrar Joven JCF'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre del Joven</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Negocio Asignado</label>
            <input
              type="text"
              name="negocio"
              value={formData.negocio}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Asignar a Usuario</label>
            <select
              name="encargadoId"
              value={formData.encargadoId}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
              required
              disabled={loading}
            >
              <option value="">-- Seleccione un responsable --</option>
              {usuariosOptions.map(user => (
                <option key={user.id} value={user.id}>
                  {user.nombre} {user.apellidos} ({user.rol})
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-100 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Guardar Registro
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ModalJovenJCF