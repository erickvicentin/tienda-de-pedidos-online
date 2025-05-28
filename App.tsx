

import React, { useEffect, useCallback, useMemo, useReducer } from 'react';
import { 
  onAuthStateChanged, 
  User as FirebaseUser, 
  signOut as firebaseSignOut
} from 'firebase/auth';
import { auth } from './firebaseConfig'; 
import * as productService from './services/productService'; // Importar productService

import { Product, CartItem, CustomerInfo, Order, ViewState, AppState, AppAction } from './types'; // Import MockUser
import { fetchProducts as fetchProductsFromOrderService, submitOrder } from './services/orderService';
import Navbar from './components/Navbar';
import ProductList from './components/ProductList';
import CartView from './components/CartView';
import LoadingSpinner from './components/LoadingSpinner';
import Modal from './components/Modal';
import ImagePreviewModal from './components/ImagePreviewModal';
import WelcomeModal from './components/WelcomeModal';
import Snackbar from './components/Snackbar'; // Import Snackbar
import WhatsAppIcon from './components/icons/WhatsAppIcon';
import SettingsIcon from './components/icons/SettingsIcon';
import AdminView from './components/admin/AdminView';
import AdminLogin from './components/admin/AdminLogin';

const GENDER_FILTER_OPTIONS: string[] = ['Todos los Géneros', 'Masculina', 'Femenina', 'Unisex'];
const ALL_AUTHORS_OPTION = 'Todos los Autores';
const WHATSAPP_NUMBER = "+543624965665";
const WHATSAPP_MESSAGE = "Hola, estoy interesado/a en sus productos de Millanel.";
const LOCAL_STORAGE_VISITED_KEY = 'millanelResistenciaHasVisited';

const initialAppState: AppState = {
  products: [],
  cart: [],
  currentView: 'products',
  isLoadingProducts: true,
  isSubmittingOrder: false,
  error: null,
  confirmationMessage: null,
  searchTerm: '',
  selectedGender: GENDER_FILTER_OPTIONS[0],
  selectedAuthor: ALL_AUTHORS_OPTION,
  availableAuthors: [ALL_AUTHORS_OPTION],
  previewImageUrl: null,
  showWelcomeModal: false,
  snackbarMessage: null, // Initial state for snackbar
  editingProduct: null,
  productToDelete: null,
  currentUser: null,
  authLoading: true,
  authError: null,
  isAdminOperationLoading: false,
  adminOperationError: null,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_PRODUCTS_LOADING':
      return { ...state, isLoadingProducts: action.payload, error: null };
    case 'SET_PRODUCTS_SUCCESS': {
      const uniqueAuthors = Array.from(new Set(action.payload.map(p => p.author))).sort();
      const availableAuthors = [ALL_AUTHORS_OPTION, ...uniqueAuthors];
      return {
        ...state,
        products: action.payload,
        isLoadingProducts: false,
        availableAuthors,
        adminOperationError: null
      };
    }
    case 'SET_PRODUCTS_ERROR':
      return { ...state, error: action.payload, isLoadingProducts: false, currentView: 'error' };
    case 'ADD_TO_CART': {
      const { product, selectedSize, priceForSize } = action.payload;
      const existingItem = state.cart.find(
        (item) => item.id === product.id && item.selectedSize === selectedSize
      );
      if (existingItem) {
        return {
          ...state,
          cart: state.cart.map((item) =>
            item.id === product.id && item.selectedSize === selectedSize
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
      return {
        ...state,
        cart: [...state.cart, { ...product, quantity: 1, selectedSize, price: priceForSize }],
      };
    }
    case 'UPDATE_CART_QUANTITY': {
      const { productId, selectedSize, quantity } = action.payload;
      if (quantity <= 0) {
        return {
          ...state,
          cart: state.cart.filter((item) => !(item.id === productId && item.selectedSize === selectedSize)),
        };
      }
      return {
        ...state,
        cart: state.cart.map((item) =>
          item.id === productId && item.selectedSize === selectedSize
            ? { ...item, quantity }
            : item
        ),
      };
    }
    case 'REMOVE_FROM_CART': {
      const { productId, selectedSize } = action.payload;
      return {
        ...state,
        cart: state.cart.filter((item) => !(item.id === productId && item.selectedSize === selectedSize)),
      };
    }
    case 'CLEAR_CART':
      return { ...state, cart: [] };
    case 'SET_VIEW': {
      const isAdminViewExiting = state.currentView.startsWith('admin_') && !action.payload.startsWith('admin_');
      if (action.payload.startsWith('admin_') &&
        action.payload !== 'admin_login' &&
        !state.currentUser) {
        return { ...state, currentView: 'admin_login', authError: 'Debes iniciar sesión para acceder.' };
      }
      return {
        ...state,
        currentView: action.payload,
        error: state.currentView === 'cart' && action.payload !== 'cart' ? null : state.error,
        confirmationMessage: action.payload === 'products' ? null : state.confirmationMessage,
        editingProduct: isAdminViewExiting ? null : state.editingProduct,
        productToDelete: isAdminViewExiting ? null : state.productToDelete,
        authError: (action.payload === 'admin_login') ? null : state.authError, // Clear auth error when navigating to login
        adminOperationError: null,
      };
    }
    case 'SET_ORDER_SUBMITTING':
      return { ...state, isSubmittingOrder: action.payload, error: null };
    case 'SET_ORDER_SUCCESS':
      return { ...state, confirmationMessage: action.payload, currentView: 'confirmation', cart: [] };
    case 'SET_ORDER_ERROR':
      return { ...state, error: action.payload };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'CLEAR_CONFIRMATION':
      return { ...state, confirmationMessage: null, currentView: 'products' };
    case 'SET_SEARCH_TERM':
      return { ...state, searchTerm: action.payload };
    case 'SET_SELECTED_GENDER':
      return { ...state, selectedGender: action.payload };
    case 'SET_SELECTED_AUTHOR':
      return { ...state, selectedAuthor: action.payload };
    case 'RESET_AUTHOR_FILTER_IF_NEEDED':
      if (state.selectedAuthor !== ALL_AUTHORS_OPTION && !state.availableAuthors.includes(state.selectedAuthor)) {
        return { ...state, selectedAuthor: ALL_AUTHORS_OPTION };
      }
      return state;
    case 'SET_PREVIEW_IMAGE_URL':
      return { ...state, previewImageUrl: action.payload };
    case 'SET_SHOW_WELCOME_MODAL':
      return { ...state, showWelcomeModal: action.payload };
    case 'SHOW_SNACKBAR':
      return { ...state, snackbarMessage: action.payload };
    case 'HIDE_SNACKBAR':
      return { ...state, snackbarMessage: null };

    case 'ADMIN_ADD_PRODUCT':
      return {
        ...state, products: [...state.products, action.payload],
        currentView: 'admin_product_list', editingProduct: null,
        isAdminOperationLoading: false, adminOperationError: null,
      };
    case 'ADMIN_UPDATE_PRODUCT': {
      // Make sure to update availableAuthors if an author name changes or a new one is added via update
      const updatedProducts = state.products.map(p => p.id === action.payload.id ? action.payload : p);
      const uniqueAuthors = Array.from(new Set(updatedProducts.map(p => p.author))).sort();
      const availableAuthors = [ALL_AUTHORS_OPTION, ...uniqueAuthors];
      return {
        ...state, products: updatedProducts,
        availableAuthors,
        currentView: 'admin_product_list', editingProduct: null,
        isAdminOperationLoading: false, adminOperationError: null,
      };
    }
    case 'ADMIN_DELETE_PRODUCT': {
      const updatedProducts = state.products.filter(p => p.id !== action.payload);
      const uniqueAuthors = Array.from(new Set(updatedProducts.map(p => p.author))).sort();
      const availableAuthors = [ALL_AUTHORS_OPTION, ...uniqueAuthors];
      return {
        ...state, products: updatedProducts,
        availableAuthors,
        productToDelete: null, isAdminOperationLoading: false, adminOperationError: null,
      };
    }
    case 'ADMIN_SELECT_PRODUCT_FOR_EDIT':
      return { ...state, editingProduct: action.payload, currentView: 'admin_product_form', adminOperationError: null };
    case 'ADMIN_CONFIRM_DELETE_PRODUCT':
      return { ...state, productToDelete: action.payload };
    case 'ADMIN_CANCEL_DELETE_PRODUCT':
      return { ...state, productToDelete: null };

    // Mock Authentication actions
    case 'SET_AUTH_LOADING': // Can still be used for UI purposes if needed
      return { ...state, authLoading: action.payload };
    case 'SET_CURRENT_USER': // Generic action to set user, could be used by mock system
      return { ...state, currentUser: action.payload, authLoading: false, authError: null };
    case 'SET_AUTH_ERROR':
      return { ...state, authError: action.payload, authLoading: false };
    case 'FIREBASE_LOGIN_REQUEST':
      return { ...state, authLoading: true, authError: null };
    case 'FIREBASE_LOGIN_SUCCESS':
      return { ...state, currentUser: action.payload, currentView: 'admin_product_list', authLoading: false, authError: null };
    case 'FIREBASE_LOGIN_FAILURE':
      return { ...state, currentUser: null, authError: action.payload, authLoading: false };
    case 'FIREBASE_LOGOUT_REQUEST':
      return { ...state, authLoading: true };
    case 'FIREBASE_LOGOUT_SUCCESS':
      return {
        ...state, currentUser: null, currentView: 'products',
        authLoading: false, authError: null,
        editingProduct: null, productToDelete: null,
        isAdminOperationLoading: false, adminOperationError: null,
      };

    case 'SET_ADMIN_OPERATION_LOADING':
      return { ...state, isAdminOperationLoading: action.payload, adminOperationError: action.payload ? null : state.adminOperationError };
    case 'SET_ADMIN_OPERATION_ERROR':
      return { ...state, adminOperationError: action.payload, isAdminOperationLoading: false };
    case 'CLEAR_ADMIN_OPERATION_ERROR':
      return { ...state, adminOperationError: null };
    default:
      return state;
  }
}

const App: React.FC = () => {
  const [state, dispatch] = useReducer(appReducer, initialAppState);

  useEffect(() => {
    dispatch({ type: 'SET_AUTH_LOADING', payload: true });
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        dispatch({ type: 'SET_CURRENT_USER', payload: user as FirebaseUser | null });
       if (!user && state.currentView.startsWith('admin_') && state.currentView !== 'admin_login') {
         dispatch({ type: 'SET_VIEW', payload: 'admin_login' });
       }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Check for first visit to show welcome modal
    try {
      const hasVisited = localStorage.getItem(LOCAL_STORAGE_VISITED_KEY);
      if (!hasVisited) {
        dispatch({ type: 'SET_SHOW_WELCOME_MODAL', payload: true });
        localStorage.setItem(LOCAL_STORAGE_VISITED_KEY, 'true');
      }
    } catch (error) {
      console.warn("Could not access localStorage for welcome modal:", error);
      // Potentially dispatch to show welcome modal anyway if localStorage fails,
      // or log this and proceed without. For now, just log and proceed.
    }

    loadProducts();
  }, []);

  useEffect(() => {
    if (state.snackbarMessage) {
      const timer = setTimeout(() => {
        dispatch({ type: 'HIDE_SNACKBAR' });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [state.snackbarMessage]);

  const loadProducts = useCallback(async () => {
    dispatch({ type: 'SET_PRODUCTS_LOADING', payload: true });
    try {
      const fetchedProducts = await fetchProductsFromOrderService();
      dispatch({ type: 'SET_PRODUCTS_SUCCESS', payload: fetchedProducts });
    } catch (err) {
      console.error("Error al cargar productos:", err);
      const errorMessage = err instanceof Error ? err.message : 'No se pudieron cargar los productos. Inténtalo de nuevo más tarde.';
      dispatch({ type: 'SET_PRODUCTS_ERROR', payload: errorMessage });
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    dispatch({ type: 'RESET_AUTHOR_FILTER_IF_NEEDED' });
  }, [state.availableAuthors]);

  const filteredProducts = useMemo(() => {
    let currentProducts = state.products;
    if (state.searchTerm.trim() !== '') {
      currentProducts = currentProducts.filter(product =>
        product.name.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
        product.author.toLowerCase().includes(state.searchTerm.toLowerCase())
      );
    }
    if (state.selectedGender !== GENDER_FILTER_OPTIONS[0]) {
      currentProducts = currentProducts.filter(product => product.gender === state.selectedGender);
    }
    if (state.selectedAuthor !== ALL_AUTHORS_OPTION) {
      currentProducts = currentProducts.filter(product => product.author === state.selectedAuthor);
    }
    return currentProducts;
  }, [state.products, state.searchTerm, state.selectedGender, state.selectedAuthor]);

  const handleAddToCart = (product: Product, selectedSize: number, priceForSize: number) => {
    dispatch({ type: 'ADD_TO_CART', payload: { product, selectedSize, priceForSize } });
  };

  const handleRemoveFromCart = (productId: string, selectedSize: number) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: { productId, selectedSize } });
  };

  const handleUpdateQuantity = (productId: string, selectedSize: number, quantity: number) => {
    dispatch({ type: 'UPDATE_CART_QUANTITY', payload: { productId, selectedSize, quantity } });
  };

  const handleOpenImagePreview = (imageUrl: string) => {
    dispatch({ type: 'SET_PREVIEW_IMAGE_URL', payload: imageUrl });
  };

  const handleCloseImagePreview = () => {
    dispatch({ type: 'SET_PREVIEW_IMAGE_URL', payload: null });
  };

  const handlePlaceOrder = async (customerInfo: CustomerInfo) => {
    dispatch({ type: 'SET_ORDER_SUBMITTING', payload: true });
    const order: Order = {
      items: state.cart, customerInfo,
      totalAmount: state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
      orderDate: new Date().toISOString(),
    };
    try {
      const result = await submitOrder(order);
      if (result.success) {
        const successMessage = `Tu pedido ha sido registrado con éxito.\nID de Pedido: ${result.orderId || 'N/A'}\n\nNos pondremos en contacto contigo a la brevedad para coordinar la entrega.`;
        dispatch({
          type: 'SET_ORDER_SUCCESS',
          payload: { title: '¡Pedido Confirmado!', message: successMessage, orderId: result.orderId }
        });
      } else {
        let detailedErrorMessage = result.message || 'Ocurrió un error al realizar el pedido.';
        if (result.scriptErrorDetails) {
          detailedErrorMessage += `\nDetalles del error del script: Nombre: ${result.scriptErrorDetails.name || 'N/A'}, Mensaje: ${result.scriptErrorDetails.message || 'N/A'}`;
        }
        dispatch({ type: 'SET_ORDER_ERROR', payload: detailedErrorMessage });
      }
    } catch (err) {
      const error = err as Error;
      dispatch({ type: 'SET_ORDER_ERROR', payload: error.message || 'Error de conexión al realizar el pedido.' });
    }
    finally {
      dispatch({ type: 'SET_ORDER_SUBMITTING', payload: false });
    }
  };

  const cartItemCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleAdminAccess = () => {
    if (state.currentUser) {
      dispatch({ type: 'SET_VIEW', payload: 'admin_product_list' });
    } else {
      dispatch({ type: 'SET_VIEW', payload: 'admin_login' });
    }
  };

  const whatsAppUrl = `https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, '')}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

  const handleLogout = async () => {
    dispatch({ type: 'FIREBASE_LOGOUT_REQUEST' });
    try {
      await firebaseSignOut(auth);
      dispatch({ type: 'FIREBASE_LOGOUT_SUCCESS' });
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      dispatch({ type: 'FIREBASE_LOGOUT_SUCCESS' }); 
      dispatch({ type: 'SET_AUTH_ERROR', payload: 'Error al cerrar sesión. Intenta de nuevo.'});
    }
  };

  const handleSaveProductInAdmin = async (productData: Product | Omit<Product, 'id'>) => {
    dispatch({ type: 'SET_ADMIN_OPERATION_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ADMIN_OPERATION_ERROR' });
    try {
      if ('id' in productData && productData.id) {
        await productService.updateProduct(productData.id, productData as Product);
        dispatch({ type: 'ADMIN_UPDATE_PRODUCT', payload: productData as Product });
      } else {
        const newProductWithId = await productService.addProduct(productData as Omit<Product, 'id'>);
        dispatch({ type: 'ADMIN_ADD_PRODUCT', payload: newProductWithId });
      }
      dispatch({ type: 'SHOW_SNACKBAR', payload: '¡Producto guardado exitosamente!' });
    } catch (error) {
        console.error("Error guardando producto:", error);
      const message = error instanceof Error ? error.message : 'No se pudo guardar el producto.';
      dispatch({ type: 'SET_ADMIN_OPERATION_ERROR', payload: message });
    }
  };

  const handleDeleteProductInAdmin = async (productId: string) => {
    dispatch({ type: 'SET_ADMIN_OPERATION_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ADMIN_OPERATION_ERROR' });
    try {
      await productService.deleteProduct(productId);
      dispatch({ type: 'ADMIN_DELETE_PRODUCT', payload: productId });
      dispatch({ type: 'SHOW_SNACKBAR', payload: '¡Producto eliminado exitosamente!' }); // Snackbar for delete
    } catch (error) {
        console.error("Error eliminando producto:", error);
      const message = error instanceof Error ? error.message : 'No se pudo eliminar el producto.';
      dispatch({ type: 'SET_ADMIN_OPERATION_ERROR', payload: message });
    } finally {
      dispatch({ type: 'ADMIN_CANCEL_DELETE_PRODUCT' });
    }
  };

  const renderContent = () => {
    if (state.authLoading && !state.currentUser && (state.currentView === 'admin_login' || state.currentView.startsWith('admin_'))) {
      return <LoadingSpinner />;
    }

    if (state.currentView === 'admin_login') {
      return <AdminLogin dispatch={dispatch} authError={state.authError} authLoading={state.authLoading} />;
    }

    if (state.currentView.startsWith('admin_')) {
      if (!state.currentUser) {
        dispatch({ type: 'SET_VIEW', payload: 'admin_login' });
        return <AdminLogin dispatch={dispatch} authError={"Acceso denegado. Por favor, inicie sesión."} authLoading={false} />;
      }
      return (
        <AdminView
          currentView={state.currentView}
          products={state.products}
          editingProduct={state.editingProduct}
          dispatch={dispatch}
          onLogout={handleLogout}
          onSaveProduct={handleSaveProductInAdmin}
          isLoading={state.isAdminOperationLoading}
          error={state.adminOperationError}
        />
      );
    }

    if (state.isLoadingProducts && state.products.length === 0 && state.currentView !== 'error') {
      return <LoadingSpinner />;
    }

    switch (state.currentView) {
      case 'products':
      case 'error':
        return <ProductList products={filteredProducts} onAddToCart={handleAddToCart} onImageClick={handleOpenImagePreview} />;
      default:
        return <ProductList products={filteredProducts} onAddToCart={handleAddToCart} onImageClick={handleOpenImagePreview} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral">
      {!state.currentView.startsWith('admin_') && (
        <Navbar
          cartItemCount={cartItemCount}
          onCartClick={() => dispatch({ type: 'SET_VIEW', payload: 'cart' })}
          onLogoClick={() => dispatch({ type: 'SET_VIEW', payload: 'products' })}
          searchTerm={state.searchTerm}
          onSearchChange={(term) => dispatch({ type: 'SET_SEARCH_TERM', payload: term })}
          genderOptions={GENDER_FILTER_OPTIONS}
          selectedGender={state.selectedGender}
          onGenderChange={(gender) => dispatch({ type: 'SET_SELECTED_GENDER', payload: gender })}
          authorOptions={state.availableAuthors}
          selectedAuthor={state.selectedAuthor}
          onAuthorChange={(author) => dispatch({ type: 'SET_SELECTED_AUTHOR', payload: author })}
        />
      )}
      <main className="flex-grow">
        {renderContent()}
      </main>

      {!state.currentView.startsWith('admin_') && (
        <footer className="bg-gray-800 text-gray-300 p-6">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <p>&copy; {new Date().getFullYear()} Millanel Resistencia.</p>
              <p>Todos los derechos reservados.</p>
            </div>
            <div className="flex items-center space-x-3">
              <WhatsAppIcon className="h-5 w-5 text-green-400" />
              <a href={whatsAppUrl} target="_blank" rel="noopener noreferrer" className="hover:text-green-300 transition-colors">
                {WHATSAPP_NUMBER}
              </a>
            </div>
            <button
              onClick={handleAdminAccess}
              className="p-2 rounded-full hover:bg-gray-700 transition-colors"
              aria-label="Acceso de Administrador" title="Acceso de Administrador"
            >
              <SettingsIcon className="h-6 w-6 text-gray-400 hover:text-white" />
            </button>
          </div>
        </footer>
      )}

      {state.currentView === 'cart' && (
        <CartView
          cartItems={state.cart}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveFromCart}
          onPlaceOrder={handlePlaceOrder}
          onClose={() => dispatch({ type: 'SET_VIEW', payload: 'products' })}
          isSubmittingOrder={state.isSubmittingOrder}
        />
      )}

      {state.currentView === 'confirmation' && state.confirmationMessage && (
        <Modal title={state.confirmationMessage.title} message={state.confirmationMessage.message} type="success" onClose={() => dispatch({ type: 'CLEAR_CONFIRMATION' })} />
      )}

      {state.previewImageUrl && (
        <ImagePreviewModal imageUrl={state.previewImageUrl} onClose={handleCloseImagePreview} />
      )}

      {state.showWelcomeModal && (
        <WelcomeModal onClose={() => dispatch({ type: 'SET_SHOW_WELCOME_MODAL', payload: false })} />
      )}

      {state.snackbarMessage && (
        <Snackbar message={state.snackbarMessage} />
      )}

      {state.error && state.currentView !== 'cart' && state.currentView !== 'error' && !state.isSubmittingOrder && (
        <Modal title="Error" message={state.error} type="error" onClose={() => {
          dispatch({ type: 'CLEAR_ERROR' });
          if (state.products.length === 0 && !state.isLoadingProducts) {
            loadProducts();
          } else if (state.currentView !== 'products' && state.currentView !== 'confirmation') {
            dispatch({ type: 'SET_VIEW', payload: 'products' });
          }
        }} />
      )}
      {state.error && state.currentView === 'error' && !state.isLoadingProducts && state.products.length === 0 && !state.isSubmittingOrder && (
        <Modal title="Error de Carga de Productos" message={state.error} type="error"
          confirmText="Reintentar Carga"
          onConfirm={() => {
            dispatch({ type: 'CLEAR_ERROR' });
            dispatch({ type: 'SET_VIEW', payload: 'products' });
            loadProducts();
          }}
          onClose={() => {
            dispatch({ type: 'CLEAR_ERROR' });
          }}
        />
      )}
      {state.error && state.currentView === 'cart' && !state.isSubmittingOrder && (
        <Modal title="Error en el Pedido" message={state.error} type="error" onClose={() => dispatch({ type: 'CLEAR_ERROR' })} />
      )}

      {state.adminOperationError && state.currentView.startsWith('admin_') && (
        <Modal
          title="Error de Administración"
          message={state.adminOperationError}
          type="error"
          onClose={() => dispatch({ type: 'CLEAR_ADMIN_OPERATION_ERROR' })}
        />
      )}

      {state.productToDelete && state.currentView.startsWith('admin_') && state.currentUser && (
        <Modal
          title="Confirmar Eliminación"
          message={`¿Estás seguro de que deseas eliminar el producto "${state.productToDelete.name}"? Esta acción no se puede deshacer.`}
          type="warning"
          onClose={() => dispatch({ type: 'ADMIN_CANCEL_DELETE_PRODUCT' })}
          onConfirm={() => {
            if (state.productToDelete) {
              handleDeleteProductInAdmin(state.productToDelete.id);
            }
          }}
          confirmText="Eliminar"
        />
      )}
    </div>
  );
};

export default App;
