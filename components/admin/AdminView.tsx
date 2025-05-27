
import React from 'react';
import { AppState, AppAction, Product, ViewState } from '../../types';
import AdminProductList from './AdminProductList';
import ProductForm from './ProductForm';
import LoadingSpinner from '../LoadingSpinner'; // Importar LoadingSpinner

interface AdminViewProps {
  currentView: ViewState;
  products: Product[];
  editingProduct: Product | null;
  dispatch: React.Dispatch<AppAction>;
  onLogout: () => void; 
  onSaveProduct: (productData: Product | Omit<Product, 'id'>) => Promise<void>; // Nueva prop
  isLoading: boolean; // Nueva prop para el estado de carga de operaciones de admin
  error: string | null; // Nueva prop para errores de operaciones de admin
}

const AdminView: React.FC<AdminViewProps> = ({ 
  currentView, 
  products, 
  editingProduct, 
  dispatch, 
  onLogout,
  onSaveProduct, // Usar nueva prop
  isLoading,     // Usar nueva prop
  error          // Usar nueva prop
}) => {
  
  const handleAddNewProduct = () => {
    dispatch({ type: 'ADMIN_SELECT_PRODUCT_FOR_EDIT', payload: null });
    // La vista cambiará a 'admin_product_form' a través de la acción ADMIN_SELECT_PRODUCT_FOR_EDIT en el reducer si se necesita
  };

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

      {/* Mostrar error de operación de admin si existe */}
      {error && currentView !== 'admin_product_form' && ( // No mostrar en el form, el form tiene su propio manejo (o podría)
          <div className="my-4 p-3 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-md shadow-sm">
              <p><strong>Error:</strong> {error}</p>
          </div>
      )}
      {/* Mostrar spinner global para operaciones de admin si no estamos en el formulario de producto */}
      {isLoading && currentView !== 'admin_product_form' && <LoadingSpinner />}


      {currentView === 'admin_product_list' && !editingProduct && (
        <>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Lista de Productos</h2>
          <button
            onClick={handleAddNewProduct}
            disabled={isLoading}
            className="mb-6 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-colors disabled:opacity-70"
          >
            Añadir Nuevo Producto
          </button>
          <AdminProductList
            products={products}
            onEditProduct={(product) => dispatch({ type: 'ADMIN_SELECT_PRODUCT_FOR_EDIT', payload: product })}
            onDeleteProduct={(product) => dispatch({ type: 'ADMIN_CONFIRM_DELETE_PRODUCT', payload: product })}
            disabled={isLoading} // Deshabilitar acciones si una operación está en curso
          />
        </>
      )}

      {currentView === 'admin_product_form' && (
        <ProductForm
          product={editingProduct}
          onSave={onSaveProduct} // Pasar la función onSaveProduct
          onCancel={() => {
            dispatch({ type: 'ADMIN_SELECT_PRODUCT_FOR_EDIT', payload: null }); 
            dispatch({ type: 'SET_VIEW', payload: 'admin_product_list' });
          }}
          isLoading={isLoading} // Pasar el estado de carga
        />
      )}
    </div>
  );
};

export default AdminView;
