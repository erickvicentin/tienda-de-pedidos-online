
import React, { useState, useMemo, useEffect } from 'react';
import { Product } from '../types';
import { GLOBAL_SIZE_PRICES } from '../constants';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, selectedSize: number, priceForSize: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  // Inicializar selectedSize con el primer tamaño del producto que tenga un precio definido globalmente.
  const getInitialSelectableSize = () => {
    const firstAvailableSize = product.sizes.find(size => GLOBAL_SIZE_PRICES[size] !== undefined);
    return firstAvailableSize || 0; // 0 si ningún tamaño del producto tiene precio global
  }
  
  const [selectedSize, setSelectedSize] = useState<number>(getInitialSelectableSize());

  const currentPrice = useMemo(() => {
    if (!selectedSize || GLOBAL_SIZE_PRICES[selectedSize] === undefined) {
      return 0; // O un valor por defecto apropiado si no se encuentra ningún precio
    }
    return GLOBAL_SIZE_PRICES[selectedSize];
  }, [selectedSize]);

  const handleAddToCartClick = () => {
    if (selectedSize > 0 && GLOBAL_SIZE_PRICES[selectedSize] !== undefined) {
      onAddToCart(product, selectedSize, currentPrice);
    }
  };

  useEffect(() => {
    // Re-evaluar el tamaño seleccionado si el producto o los precios globales cambian.
    // Esto es útil si los productos se cargan dinámicamente o los precios globales cambian.
    const currentInitialSize = getInitialSelectableSize();
    if (selectedSize === 0 && currentInitialSize !== 0) {
      setSelectedSize(currentInitialSize);
    } else if (selectedSize !== 0 && GLOBAL_SIZE_PRICES[selectedSize] === undefined) {
      // Si el tamaño actualmente seleccionado ya no tiene un precio global,
      // intentar reestablecerlo a un tamaño válido.
      setSelectedSize(currentInitialSize);
    }
  }, [product.sizes, selectedSize]); // Dependencia en product.sizes por si el producto cambia.

  const availableSizesWithPrices = product.sizes.filter(size => GLOBAL_SIZE_PRICES[size] !== undefined);

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col transition-all duration-300 hover:shadow-2xl h-full">
      <img 
        className="w-full h-48 object-cover bg-gray-200"
        src={product.imageUrl || 'https://via.placeholder.com/300x200.png?text=Sin+Imagen'}
        alt={product.name} 
        onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/300x200.png?text=Error+Img')}
      />
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-semibold text-gray-800 mb-1">{product.name}</h3>
        <p className="text-sm text-gray-500 mb-1">Por: {product.author}</p>
        <p className="text-sm text-gray-500 mb-2">Género: {product.gender}</p>
        <p className="text-sm text-gray-600 flex-grow mb-3">{product.description}</p>
        
        {availableSizesWithPrices.length > 0 ? (
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-1">Tamaño:</p>
            <div className="flex space-x-2 flex-wrap gap-y-2">
              {availableSizesWithPrices.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-3 py-1 border rounded-md text-sm font-medium transition-colors
                    ${selectedSize === size 
                      ? 'bg-primary text-white border-primary ring-2 ring-primary ring-offset-1' 
                      : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'}`}
                >
                  {size}ml
                </button>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-sm text-red-500 mb-4">No hay tamaños con precios definidos para este producto.</p>
        )}

        <div className="flex justify-between items-center mt-auto">
          <p className="text-2xl font-bold text-primary">
            {currentPrice > 0 ? `$${currentPrice.toFixed(2)}` : 'N/D'}
          </p>
          <button
            onClick={handleAddToCartClick}
            disabled={!selectedSize || currentPrice === 0}
            className="bg-accent hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Añadir
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;