


import React, { useState, useMemo } from 'react'; // Añadir useState y useMemo
import { AppState, AppAction, Product, ViewState } from '../../types';
import AdminProductList from './AdminProductList';
import ProductForm from './ProductForm';
import LoadingSpinner from '../LoadingSpinner';

interface AdminViewProps {
  currentView: ViewState;
  products: Product[];
  editingProduct: Product | null;
  dispatch: React.Dispatch<AppAction>;
  onLogout: () => void;
  onSaveProduct: (productData: Product | Omit<Product, 'id'>) => Promise<void>;
  onToggleProductVisibility: (productId: string, currentVisibility: boolean) => Promise<void>; // Nueva prop
  isLoading: boolean;
  error: string | null;
}

const AdminView: React.FC<AdminViewProps> = ({
  currentView,
  products,
  editingProduct,
  dispatch,
  onLogout,
  onSaveProduct,
  onToggleProductVisibility, // Destructurar nueva prop
  isLoading,
  error
}) => {
  const [adminSearchTerm, setAdminSearchTerm] = useState(''); // Estado para la búsqueda en admin

  const handleAddNewProduct = () => {
    dispatch({ type: 'ADMIN_SELECT_PRODUCT_FOR_EDIT', payload: null });
  };

  const filteredAdminProducts = useMemo(() => {
    if (!adminSearchTerm.trim()) {
      return products;
    }
    const searchTermLower = adminSearchTerm.toLowerCase();
    return products.filter(product =>
      product.name.toLowerCase().includes(searchTermLower) ||
      product.author.toLowerCase().includes(searchTermLower)
    );
  }, [products, adminSearchTerm]);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen bg-gray-50">
      <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-300">
        <h1 className="text-3xl font-bold text-gray-800">Administración</h1>
        <button
          onClick={onLogout}
          className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors"
        >
          Cerrar Sesión y Volver
        </button>
      </div>

      {error && currentView !== 'admin_product_form' && (
        <div className="my-4 p-3 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-md shadow-sm">
          <p><strong>Error:</strong> {error}</p>
        </div>
      )}
      {isLoading && currentView !== 'admin_product_form' && <LoadingSpinner />}


      {currentView === 'admin_product_list' && !editingProduct && (
        <>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Lista de Productos</h2>
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-3 sm:space-y-0">
            <input
              type="search"
              placeholder="Buscar productos por nombre o autor..."
              value={adminSearchTerm}
              onChange={(e) => setAdminSearchTerm(e.target.value)}
              className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary w-full sm:w-[420px] text-sm bg-white placeholder-gray-500"
              aria-label="Buscar productos en la lista de administración"
            />
            <button
              onClick={handleAddNewProduct}
              disabled={isLoading}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-colors disabled:opacity-70"
            >
              Añadir Nuevo Producto
            </button>
          </div>
          <AdminProductList
            products={filteredAdminProducts}
            onEditProduct={(product) => dispatch({ type: 'ADMIN_SELECT_PRODUCT_FOR_EDIT', payload: product })}
            onDeleteProduct={(product) => dispatch({ type: 'ADMIN_CONFIRM_DELETE_PRODUCT', payload: product })}
            onToggleVisibility={onToggleProductVisibility} // Pasar la prop
            disabled={isLoading}
          />
        </>
      )}

      {currentView === 'admin_product_form' && (
        <ProductForm
          product={editingProduct}
          onSave={onSaveProduct}
          onCancel={() => {
            dispatch({ type: 'ADMIN_SELECT_PRODUCT_FOR_EDIT', payload: null });
            dispatch({ type: 'SET_VIEW', payload: 'admin_product_list' });
          }}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};

export default AdminView;