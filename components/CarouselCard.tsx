// components/CarouselCard.tsx
import React from 'react';
import { Product } from '../types';

interface CarouselCardProps {
  product: Product;
}

const CarouselCard: React.FC<CarouselCardProps> = ({ product }) => {
  return (
    // Contenedor exterior para que el carrusel lo pueda arrastrar
    <div>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col h-full mx-2">
        <img
          className="w-full h-100 object-cover bg-gray-200"
          src={product.imageUrl || 'https://via.placeholder.com/300x200.png?text=Sin+Imagen'}
          alt={product.name}
          onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/300x200.png?text=Error+Img')}
        />
        <div className="p-4 flex flex-col flex-grow">
          {/* Contenedor con altura fija para manejar nombres de varias líneas */}
          <div className="h-16">
            <h3 className="text-lg font-semibold text-gray-800 mb-1" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {product.name}
            </h3>
          </div>
          <p className="text-sm text-gray-500 mb-1">Por: {product.author}</p>
          <p className="text-sm text-gray-500">Género: {product.gender}</p>
        </div>
      </div>
    </div>
  );
};

export default CarouselCard;
