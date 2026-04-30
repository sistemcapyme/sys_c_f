import { useState } from 'react';
import { pagosService } from '../../services/pagosService';
import { toast } from 'react-hot-toast';

const BotonPagoPdf = ({ titulo, precio, pdfId }) => {
  const [loading, setLoading] = useState(false);

  const handlePago = async () => {
    setLoading(true);
    try {
      const returnUrl = `/catalogos?descargar=${pdfId}`;

      const res = await pagosService.crearPreferencia({
        titulo: `PDF: ${titulo}`,
        precio,
        cantidad: 1,
        idReferencia: pdfId,
        tipo: 'pdf',
        returnUrl: returnUrl
      });
      
      if (res.init_point) {
        window.location.href = res.init_point;
      } else {
        toast.error('No se recibió el link de pago');
      }
    } catch (error) {
      toast.error('Error al iniciar el pago');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePago}
      disabled={loading}
      className="w-full py-3 px-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
    >
      {loading ? 'Procesando...' : `Comprar por $${precio} MXN`}
    </button>
  );
};

export default BotonPagoPdf;