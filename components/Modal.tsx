
import React from 'react';

interface ModalProps {
  title: string;
  message: string;
  onClose: () => void;
  onConfirm?: () => void; // Para el botón de confirmación (opcional)
  confirmText?: string;   // Texto para el botón de confirmación
  type?: 'success' | 'error' | 'info' | 'warning';
}

const Modal: React.FC<ModalProps> = ({ title, message, onClose, onConfirm, confirmText = "Confirmar", type = 'info' }) => {
  let titleColor = 'text-gray-800';
  let primaryButtonColor = 'bg-primary hover:bg-pink-600'; // Color primario de Tailwind
  let primaryButtonTextColor = 'text-white';

  if (type === 'success') {
    titleColor = 'text-green-600';
    primaryButtonColor = 'bg-green-500 hover:bg-green-600';
  } else if (type === 'error') {
    titleColor = 'text-red-600';
    primaryButtonColor = 'bg-red-500 hover:bg-red-600';
  } else if (type === 'warning') {
    titleColor = 'text-amber-600'; // Amber para warning
    primaryButtonColor = 'bg-red-500 hover:bg-red-600'; // Botón de confirmación de "warning" suele ser destructivo
  }


  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-auto">
        <h3 className={`text-2xl font-bold mb-4 ${titleColor}`}>{title}</h3>
        <p className="text-gray-700 mb-6 whitespace-pre-wrap">{message}</p>
        <div className="flex justify-end space-x-3">
          {onConfirm && type === 'warning' && ( // Mostrar botón de cancelar solo para warnings con confirmación
            <button
              onClick={onClose} // El onClose actúa como "cancelar" aquí
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              Cancelar
            </button>
          )}
          <button
            onClick={onConfirm ? onConfirm : onClose} // Si hay onConfirm, lo usa, sino usa onClose
            className={` ${primaryButtonColor} ${primaryButtonTextColor} font-semibold py-2 px-4 rounded-lg transition-colors`}
          >
            {onConfirm ? confirmText : "Cerrar"} 
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
