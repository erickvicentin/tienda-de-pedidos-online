
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
  disabled?: boolean; // Nueva prop
}

const AdminProductList: React.FC<AdminProductListProps> = ({ products, onEditProduct, onDeleteProduct, disabled = false }) => {
  if (products.length === 0) {
    return <p className="text-center text-gray-500 py-10">No hay productos para mostrar. Puede añadir productos nuevos.</p>;
  }

  return (
    <div className="overflow-x-auto bg-white shadow-md rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Imagen
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nombre
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Autor
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Categoría
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Género
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tamaños (ml)
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {products.map((product) => (
            <tr key={product.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <img 
                  src={product.imageUrl || 'https://via.placeholder.com/50x50.png?text=Sin+Img'} 
                  alt={product.name} 
                  className="w-12 h-12 object-cover rounded-md"
                  onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/50x50.png?text=Error')}
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{product.name}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">{product.author}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">{product.category}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">{product.gender}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">{product.sizes.join(', ')}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
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
