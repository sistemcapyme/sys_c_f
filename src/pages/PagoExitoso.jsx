import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const PagoExitoso = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [countdown, setCountdown] = useState(5);
  
  const searchParams = new URLSearchParams(location.search);
  const returnUrl = searchParams.get('return_url') || '/';

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate(returnUrl);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate, returnUrl]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md w-full">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">¡Pago Exitoso!</h2>
        <p className="text-gray-600 mb-6 text-lg">Tu transacción se ha procesado correctamente.</p>
        
        <p className="text-sm text-gray-500 mb-8 font-medium">
          Regresando a tu página en <span className="text-blue-600 text-lg">{countdown}</span> segundos...
        </p>

        <button
          onClick={() => navigate(returnUrl)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200"
        >
          Regresar ahora
        </button>
      </div>
    </div>
  );
};

export default PagoExitoso;