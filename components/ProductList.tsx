
import React from 'react';
import { Product } from '../types';
import ProductCard from './ProductCard';

interface ProductListProps {
  products: Product[];
  onAddToCart: (product: Product, selectedSize: number, priceForSize: number) => void;
  onImageClick: (imageUrl: string) => void; // Nueva prop
}

const ProductList: React.FC<ProductListProps> = ({ products, onAddToCart, onImageClick }) => {
  if (products.length === 0) {
    return <p className="text-center text-gray-500 py-10 text-lg">No se encontraron productos que coincidan con tu búsqueda o filtros.</p>;
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Nuestras Fragancias</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
            onImageClick={onImageClick} // Pasar la prop
          />
        ))}
      </div>
    </div>
  );
};

export default ProductList;