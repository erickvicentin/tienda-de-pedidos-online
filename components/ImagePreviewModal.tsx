
import React from 'react';

interface ImagePreviewModalProps {
  imageUrl: string;
  onClose: () => void;
}

const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({ imageUrl, onClose }) => {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 transition-opacity duration-300 ease-in-out"
      onClick={onClose} // Cerrar al hacer clic en el fondo
      role="dialog"
      aria-modal="true"
      aria-labelledby="image-preview-title"
    >
      <div
        className="bg-white p-2 rounded-lg shadow-2xl relative max-w-3xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()} // Evitar que el clic en la imagen cierre el modal
      >
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 bg-primary text-white rounded-full p-1.5 shadow-lg hover:bg-pink-600 transition-colors z-10"
          aria-label="Cerrar vista previa de imagen"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
        <img
          src={imageUrl}
          alt="Vista previa del producto"
          className="object-contain w-full h-full max-w-full max-h-[calc(90vh-2rem)] rounded" // Ajustar el tamaño de la imagen
          id="image-preview-title" // Para aria-labelledby
        />
      </div>
    </div>
  );
};

export default ImagePreviewModal;