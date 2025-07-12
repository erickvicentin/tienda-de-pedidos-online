// components/HomeView.tsx
import React from 'react';
import { Product } from '../types';
import ProductCarousel from './ProductCarousel';

interface HomeViewProps {
  products: Product[];
  onGenderSelect: (gender: string) => void;
}

const GENDER_OPTIONS = ['Todos los Géneros', 'Femenina', 'Masculina', 'Unisex', 'Infantil'];

const HomeView: React.FC<HomeViewProps> = ({ products, onGenderSelect }) => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
      <h1 className="text-4xl font-extrabold text-gray-800 mb-4">
        ¿Qué fragancias te gustaría ver?
      </h1>
      <p className="text-lg text-gray-600 mb-10">
        Selecciona una categoría para empezar o descubre productos populares a continuación.
      </p>

      <div className="flex justify-center flex-wrap gap-4 mb-12">
        {GENDER_OPTIONS.map(gender => (
          <button
            key={gender}
            onClick={() => onGenderSelect(gender)}
            className="px-8 py-4 bg-white border-2 border-gray-300 rounded-lg shadow-md hover:shadow-xl hover:border-primary transition-all duration-300 ease-in-out transform hover:-translate-y-1"
          >
            <span className="text-xl font-semibold text-gray-700">{gender}</span>
          </button>
        ))}
      </div>

      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Descubre nuestros productos</h2>
        <ProductCarousel products={products} />
      </div>
    </div>
  );
};

export default HomeView;
