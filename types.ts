import type { User } from 'firebase/auth'; // Importar User de Firebase

export type Gender = 'Masculina' | 'Femenina' | 'Unisex';
export type ProductCategory = 'Fragancia' | 'Cosmética' | 'Accesorio' | 'Bazar' | 'Otra';
export type OrderStatus = 'Pendiente' | 'Confirmado' | 'Retirado' | 'Entregado' | 'Pagado' | 'Cancelado';


export interface Product {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  category: ProductCategory;
  gender: Gender;
  author: string;
  sizes: number[];
  manualPrice?: number; // Added for manual pricing
  isVisible?: boolean; // Nuevo campo para la visibilidad del producto
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize: number;
  price: number;
}

export interface CustomerInfo {
  name: string;
  phone: string;
  email?: string;
  address: string;
}

export interface Order {
  id: string;
  orderNumber?: number;
  status: OrderStatus;
  items: CartItem[];
  customerInfo: CustomerInfo;
  totalAmount: number;
  orderDate: string;
}

export type ViewState =
  | 'products'
  | 'cart'
  | 'confirmation'
  | 'error'
  | 'admin_login' // Vista para login
  | 'admin_dashboard'
  | 'admin_product_list'
  | 'admin_product_form'
  | 'admin_order_list';


export interface ScriptErrorDetails {
  name?: string;
  message: string;
  stack?: string;
  inputPreview?: string;
}

export interface AppState {
  products: Product[];
  orders: Order[];
  cart: CartItem[];
  currentView: ViewState;
  isLoadingProducts: boolean;
  isLoadingOrders: boolean;
  isSubmittingOrder: boolean;
  error: string | null; // Error general de la app
  confirmationMessage: { title: string; message: string; orderId?: string } | null;
  searchTerm: string;
  selectedGender: string;
  selectedAuthor: string;
  availableAuthors: string[];
  previewImageUrl: string | null; // Para el modal de vista previa de imagen
  showWelcomeModal: boolean; // Para el modal de bienvenida
  snackbarMessage: string | null; // For snackbar notifications

  // Estados de Admin
  editingProduct: Product | null;
  productToDelete: Product | null;
  orderToDelete: Order | null;

  // Estados de Autenticación de Firebase
  currentUser: User | null; // Usuario de Firebase
  authLoading: boolean; // Para saber si se está cargando el estado de auth
  authError: string | null; // Errores de login

   // Nuevos estados para operaciones de admin con Firebase
  isAdminOperationLoading: boolean;
  adminOperationError: string | null;
}

export type AppAction =
  | { type: 'SET_PRODUCTS_LOADING'; payload: boolean }
  | { type: 'SET_PRODUCTS_SUCCESS'; payload: Product[] }
  | { type: 'SET_PRODUCTS_ERROR'; payload: string }
  | { type: 'ADD_TO_CART'; payload: { product: Product; selectedSize: number; priceForSize: number } }
  | { type: 'UPDATE_CART_QUANTITY'; payload: { productId: string; selectedSize: number; quantity: number } }
  | { type: 'REMOVE_FROM_CART'; payload: { productId: string; selectedSize: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_VIEW'; payload: ViewState }
  | { type: 'SET_ORDER_SUBMITTING'; payload: boolean }
  | { type: 'SET_ORDER_SUCCESS'; payload: { title: string; message: string; orderId?: string } }
  | { type: 'SET_ORDER_ERROR'; payload: string }
  | { type: 'CLEAR_ERROR' }
  | { type: 'CLEAR_CONFIRMATION' }
  | { type: 'SET_SEARCH_TERM'; payload: string }
  | { type: 'SET_SELECTED_GENDER'; payload: string }
  | { type: 'SET_SELECTED_AUTHOR'; payload: string }
  | { type: 'RESET_AUTHOR_FILTER_IF_NEEDED' }
  | { type: 'SET_PREVIEW_IMAGE_URL', payload: string | null } // Para el modal de vista previa
  | { type: 'SET_SHOW_WELCOME_MODAL', payload: boolean } // Para el modal de bienvenida
  | { type: 'SHOW_SNACKBAR'; payload: string } // For snackbar
  | { type: 'HIDE_SNACKBAR' } // For snackbar

  // Acciones de Admin (Productos)
  // Estas acciones ahora actualizarán el estado local DESPUÉS de una operación exitosa en Firestore
  | { type: 'ADMIN_ADD_PRODUCT'; payload: Product } // Payload es el producto con ID de Firestore
  | { type: 'ADMIN_UPDATE_PRODUCT'; payload: Product } // Payload es el producto actualizado
  | { type: 'ADMIN_DELETE_PRODUCT'; payload: string } // productId
  | { type: 'ADMIN_SELECT_PRODUCT_FOR_EDIT'; payload: Product | null }
  | { type: 'ADMIN_CONFIRM_DELETE_PRODUCT'; payload: Product | null }
  | { type: 'ADMIN_CANCEL_DELETE_PRODUCT' }
  | { type: 'ADMIN_TOGGLE_PRODUCT_VISIBILITY'; payload: { productId: string; isVisible: boolean } }

  // Acciones de Admin (Pedidos con Mock Service)
  | { type: 'SET_ORDERS_LOADING'; payload: boolean }
  | { type: 'SET_ORDERS_SUCCESS'; payload: Order[] }
  | { type: 'SET_ORDERS_ERROR'; payload: string }
  | { type: 'ADMIN_UPDATE_ORDER_STATUS'; payload: { orderId: string; status: OrderStatus } }
  | { type: 'ADMIN_CONFIRM_DELETE_ORDER'; payload: Order | null }
  | { type: 'ADMIN_CANCEL_DELETE_ORDER' }
  | { type: 'ADMIN_DELETE_ORDER_SUCCESS'; payload: string } // orderId

  // Acciones de Autenticación de Firebase
  | { type: 'SET_AUTH_LOADING'; payload: boolean }
  | { type: 'SET_CURRENT_USER'; payload: User | null }
  | { type: 'SET_AUTH_ERROR'; payload: string | null }
  | { type: 'FIREBASE_LOGIN_REQUEST' }
  | { type: 'FIREBASE_LOGIN_SUCCESS'; payload: User }
  | { type: 'FIREBASE_LOGIN_FAILURE'; payload: string }
  | { type: 'FIREBASE_LOGOUT_REQUEST' }
  | { type: 'FIREBASE_LOGOUT_SUCCESS' }

  // Nuevas acciones para operaciones de admin con Firebase
  | { type: 'SET_ADMIN_OPERATION_LOADING'; payload: boolean }
  | { type: 'SET_ADMIN_OPERATION_ERROR'; payload: string | null }
  | { type: 'CLEAR_ADMIN_OPERATION_ERROR' };
