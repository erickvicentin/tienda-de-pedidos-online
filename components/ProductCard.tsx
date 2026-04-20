

import React, { useState, useMemo, useEffect } from 'react';
import { Product } from '../types';
import { GLOBAL_SIZE_PRICES } from '../constants';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, selectedSize: number, priceForSize: number) => void;
  onDirectOrder: (product: Product, selectedSize: number, priceForSize: number) => void;
  onImageClick: (imageUrl: string) => void;
  showDescription?: boolean; // Nueva propiedad opcional
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onDirectOrder, onImageClick, showDescription = true }) => {
  const isFragrance = product.category === 'Fragancia';

  const getInitialSelectableSize = () => {
    if (!isFragrance || product.sizes.length === 0) {
      return product.sizes.length > 0 ? product.sizes[0] : 0; // Default for non-fragrance or empty sizes
    }
    const firstAvailableSize = product.sizes.find(size => GLOBAL_SIZE_PRICES[size] !== undefined);
    return firstAvailableSize || 0;
  };

  const [selectedSize, setSelectedSize] = useState<number>(getInitialSelectableSize());

  useEffect(() => {
    // Reset selectedSize if product changes, especially for fragrances
    setSelectedSize(getInitialSelectableSize());
  }, [product.id, product.category, product.sizes]);


  const currentPrice = useMemo(() => {
    if (!isFragrance && product.manualPrice !== undefined && product.manualPrice > 0) {
      return product.manualPrice;
    }
    if (isFragrance && selectedSize && GLOBAL_SIZE_PRICES[selectedSize] !== undefined) {
      return GLOBAL_SIZE_PRICES[selectedSize];
    }
    return 0; // Default to 0 if no price can be determined
  }, [product, selectedSize, isFragrance]);

  const handleAddToCartClick = () => {
    const priceToAdd = currentPrice;
    if (priceToAdd > 0) {
      // For non-fragrances with manual price, selectedSize can be the first informational size or 0.
      // For fragrances, it's the actual selected size.
      const sizeForCart = isFragrance ? selectedSize : (product.sizes.length > 0 ? product.sizes[0] : 0);
      onAddToCart(product, sizeForCart, priceToAdd);
    }
  };

  const handleDirectOrderClick = () => {
    const priceToAdd = currentPrice;
    if (priceToAdd > 0) {
      const sizeForCart = isFragrance ? selectedSize : (product.sizes.length > 0 ? product.sizes[0] : 0);
      onDirectOrder(product, sizeForCart, priceToAdd);
    }
  };

  // For fragrances, filter sizes that have a price in GLOBAL_SIZE_PRICES
  const availableSizesWithPricesForFragrance = isFragrance
    ? product.sizes.filter(size => GLOBAL_SIZE_PRICES[size] !== undefined)
    : [];

  const canAddToCart = currentPrice > 0;
  const showSizeSelector = isFragrance && availableSizesWithPricesForFragrance.length > 0;

  return (
    <div>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col transition-all duration-300 hover:shadow-2xl h-full">
        <img
          className="w-full h-48 object-cover bg-gray-200 cursor-pointer" // Added cursor-pointer
          src={product.imageUrl || 'https://via.placeholder.com/300x200.png?text=Sin+Imagen'}
          alt={product.name}
          onClick={() => onImageClick(product.imageUrl)} // Added onClick handler
          onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/300x200.png?text=Error+Img')}
          aria-label={`Vista previa de ${product.name}`}
        />
        <div className="p-6 flex flex-col flex-grow">
          <h3 className="text-xl font-semibold text-gray-800 mb-1">{product.name}</h3>
          <p className="text-sm text-gray-500 mb-1">Por: {product.author}</p>
          <p className="text-sm text-gray-500 mb-2">Género: {product.gender}</p>
          {showDescription && <p className="text-sm text-gray-600 flex-grow mb-3">{product.description}</p>}

          <div className="min-h-[70px]"> {/* Contenedor para mantener altura consistente */}
            {showSizeSelector && (
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-1">Tamaño:</p>
                <div className="flex space-x-2 flex-wrap gap-y-2">
                  {availableSizesWithPricesForFragrance.map((size) => (
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
            )}

            {!isFragrance && product.sizes && product.sizes.length > 0 && (
              <p className="text-sm text-gray-500 mb-2">Presentación: {product.sizes.join(', ')}{product.category === "Cosmética" || product.category === "Accesorio" ? " (ej. g/ml/unidad)" : "ml"}</p>
            )}
          </div>

          {isFragrance && availableSizesWithPricesForFragrance.length === 0 && (
            <p className="text-sm text-red-500 mb-4">No hay tamaños con precios definidos para esta fragancia.</p>
          )}
          {!isFragrance && product.manualPrice === undefined && (
            <p className="text-sm text-red-500 mb-4">Precio no definido para este producto.</p>
          )}


          <div className="flex justify-between items-center mt-auto">
            <p className="text-2xl font-bold text-primary">
              {currentPrice > 0 ? `$${currentPrice}` : 'N/D'}
            </p>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleDirectOrderClick}
                disabled={!canAddToCart}
                className="bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary-focus focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                Pedir
              </button>
              <button
                onClick={handleAddToCartClick}
                disabled={!canAddToCart}
                className="bg-accent hover:bg-purple-600 text-white font-semibold py-2 px-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                Añadir
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;