

import React from 'react';
import { Product } from '../../types';
import TrashIcon from '../icons/TrashIcon';
const EditIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-5 w-5"} viewBox="0 0 20 20" fill="currentColor">
    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
  </svg>
);


interface AdminProductListProps {
  products: Product[];
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (product: Product) => void;
  onToggleVisibility: (productId: string, currentVisibility: boolean) => void; // Nueva prop
  disabled?: boolean;
}

const AdminProductList: React.FC<AdminProductListProps> = ({ products, onEditProduct, onDeleteProduct, onToggleVisibility, disabled = false }) => {
  if (products.length === 0) {
    return <p className="text-center text-gray-500 py-10">No hay productos para mostrar. Puede añadir productos nuevos.</p>;
  }

  return (
    <div className="overflow-x-auto bg-white shadow-md rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Imagen
            </th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nombre
            </th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Autor
            </th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Categoría
            </th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Visibilidad
            </th>
            <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {products.map((product) => (
            <tr key={product.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-4 whitespace-nowrap">
                <img
                  src={product.imageUrl || 'https://via.placeholder.com/50x50.png?text=Sin+Img'}
                  alt={product.name}
                  className="w-12 h-12 object-cover rounded-md"
                  onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/50x50.png?text=Error')}
                />
              </td>
              <td className="px-4 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{product.name}</div>
                <div className="text-xs text-gray-500">{product.gender} | Tamaños: {product.sizes.join(', ')}</div>
              </td>
              <td className="px-4 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">{product.author}</div>
              </td>
              <td className="px-4 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">{product.category}</div>
              </td>
              <td className="px-4 py-4 whitespace-nowrap">
                <button
                  onClick={() => onToggleVisibility(product.id, product.isVisible !== undefined ? product.isVisible : true)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed ${product.isVisible !== false
                      ? 'bg-green-100 text-green-700 hover:bg-green-200 focus:ring-green-500'
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300 focus:ring-gray-400'
                    }`}
                  title={product.isVisible !== false ? "Marcar como Oculto" : "Marcar como Visible"}
                  disabled={disabled}
                  aria-pressed={product.isVisible !== false}
                >
                  {product.isVisible !== false ? 'Visible' : 'Oculto'}
                </button>
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => onEditProduct(product)}
                  className="text-indigo-600 hover:text-indigo-900 mr-3 p-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Editar Producto"
                  disabled={disabled}
                >
                  <EditIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => onDeleteProduct(product)}
                  className="text-red-600 hover:text-red-900 p-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Eliminar Producto"
                  disabled={disabled}
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminProductList;