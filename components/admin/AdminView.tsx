



import React, { useState, useMemo } from 'react';
import { AppState, AppAction, Product, ViewState, Order, OrderStatus } from '../../types';
import AdminProductList from './AdminProductList';
import ProductForm from './ProductForm';
import LoadingSpinner from '../LoadingSpinner';
import AdminOrderList from './AdminOrderList';

interface AdminViewProps {
  currentView: ViewState;
  products: Product[];
  orders: Order[];
  editingProduct: Product | null;
  dispatch: React.Dispatch<AppAction>;
  onLogout: () => void;
  onSaveProduct: (productData: Product | Omit<Product, 'id'>) => Promise<void>;
  onToggleProductVisibility: (productId: string, currentVisibility: boolean) => Promise<void>;
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  onDeleteOrder: (order: Order) => void;
  isLoading: boolean;
  isOrdersLoading: boolean;
  error: string | null;
}

const AdminDashboard: React.FC<{ dispatch: React.Dispatch<AppAction> }> = ({ dispatch }) => (
  <div className="text-center">
    <h2 className="text-2xl font-semibold text-gray-700 mb-8">Panel de Administración</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
      <button
        onClick={() => dispatch({ type: 'SET_VIEW', payload: 'admin_product_list' })}
        className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow text-left focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        aria-label="Gestionar productos"
      >
        <h3 className="text-xl font-bold text-primary mb-2">Gestionar Productos</h3>
        <p className="text-gray-600">Añadir, editar, eliminar y cambiar la visibilidad de los productos de la tienda.</p>
      </button>
      <button
        onClick={() => dispatch({ type: 'SET_VIEW', payload: 'admin_order_list' })}
        className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow text-left focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent"
        aria-label="Gestionar pedidos"
      >
        <h3 className="text-xl font-bold text-accent mb-2">Gestionar Pedidos</h3>
        <p className="text-gray-600">Visualizar los pedidos de los clientes y actualizar su estado (pendiente, enviado, etc.).</p>
      </button>
    </div>
  </div>
);

const BackArrowIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-6 w-6"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
  </svg>
);


const AdminView: React.FC<AdminViewProps> = ({
  currentView,
  products,
  orders,
  editingProduct,
  dispatch,
  onLogout,
  onSaveProduct,
  onToggleProductVisibility,
  onUpdateOrderStatus,
  onDeleteOrder,
  isLoading,
  isOrdersLoading,
  error
}) => {
  const [adminSearchTerm, setAdminSearchTerm] = useState('');

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

  const showBackButton = currentView !== 'admin_dashboard';

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen bg-gray-50">
      <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-300">
        <div className="flex items-center space-x-4">
          {showBackButton && (
            <button
              onClick={() => dispatch({ type: 'SET_VIEW', payload: 'admin_dashboard' })}
              className="text-gray-600 hover:text-primary p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              title="Volver al panel"
              aria-label="Volver al panel de administración"
            >
              <BackArrowIcon />
            </button>
          )}
          <h1 className="text-3xl font-bold text-gray-800">Administración</h1>
        </div>
        <button
          onClick={onLogout}
          className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors"
        >
          Cerrar Sesión y Volver
        </button>
      </div>

      {error && !currentView.startsWith('admin_product') && (
        <div className="my-4 p-3 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-md shadow-sm">
          <p><strong>Error:</strong> {error}</p>
        </div>
      )}

      {currentView === 'admin_dashboard' && <AdminDashboard dispatch={dispatch} />}

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
          {isLoading && <LoadingSpinner />}
          <AdminProductList
            products={filteredAdminProducts}
            onEditProduct={(product) => dispatch({ type: 'ADMIN_SELECT_PRODUCT_FOR_EDIT', payload: product })}
            onDeleteProduct={(product) => dispatch({ type: 'ADMIN_CONFIRM_DELETE_PRODUCT', payload: product })}
            onToggleVisibility={onToggleProductVisibility}
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

      {currentView === 'admin_order_list' && (
        <>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Gestión de Pedidos</h2>
          {isOrdersLoading ? <LoadingSpinner /> : (
            <AdminOrderList
              orders={orders}
              onUpdateStatus={onUpdateOrderStatus}
              onDeleteOrder={onDeleteOrder}
              disabled={isLoading} // disable select while any admin op is running
            />
          )}
        </>
      )}
    </div>
  );
};

export default AdminView;