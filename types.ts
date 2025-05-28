

// Mock User interface, replacing Firebase User
export interface MockUser {
  uid: string;
  email?: string;
  displayName?: string; // Optional: if you want to display a name
}

export type Gender = 'Masculina' | 'Femenina' | 'Unisex';
export type ProductCategory = 'Fragancia' | 'Cosmética' | 'Accesorio' | 'Bazar' | 'Otra';


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
  | 'admin_product_list'
  | 'admin_product_form';

export interface ScriptErrorDetails {
  name?: string;
  message: string;
  stack?: string;
  inputPreview?: string;
}

export interface AppState {
  products: Product[];
  cart: CartItem[];
  currentView: ViewState;
  isLoadingProducts: boolean;
  isSubmittingOrder: boolean;
  error: string | null; // Error general de la app
  confirmationMessage: { title: string; message: string; orderId?: string } | null;
  searchTerm: string;
  selectedGender: string;
  selectedAuthor: string;
  availableAuthors: string[];
  previewImageUrl: string | null; // Para el modal de vista previa de imagen
  
  // Estados de Admin
  editingProduct: Product | null; 
  productToDelete: Product | null; 
  
  // Estados de Autenticación (Mock)
  currentUser: MockUser | null; // Usuario Mock
  authLoading: boolean; 
  authError: string | null; 

  // Nuevos estados para operaciones de admin con Mock Service
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
  
  // Acciones de Admin (Productos con Mock Service)
  | { type: 'ADMIN_ADD_PRODUCT'; payload: Product } 
  | { type: 'ADMIN_UPDATE_PRODUCT'; payload: Product } 
  | { type: 'ADMIN_DELETE_PRODUCT'; payload: string } // productId
  | { type: 'ADMIN_SELECT_PRODUCT_FOR_EDIT'; payload: Product | null }
  | { type: 'ADMIN_CONFIRM_DELETE_PRODUCT'; payload: Product | null }
  | { type: 'ADMIN_CANCEL_DELETE_PRODUCT' }

  // Acciones de Autenticación (Mock)
  | { type: 'SET_AUTH_LOADING'; payload: boolean } // Puede ser usado para simular carga
  | { type: 'SET_CURRENT_USER'; payload: MockUser | null }
  | { type: 'SET_AUTH_ERROR'; payload: string | null }
  | { type: 'MOCK_LOGIN_REQUEST' } 
  | { type: 'MOCK_LOGIN_SUCCESS'; payload: MockUser }
  | { type: 'MOCK_LOGIN_FAILURE'; payload: string }
  | { type: 'MOCK_LOGOUT_REQUEST' }
  | { type: 'MOCK_LOGOUT_SUCCESS' }

  // Acciones para operaciones de admin con Mock Service
  | { type: 'SET_ADMIN_OPERATION_LOADING'; payload: boolean }
  | { type: 'SET_ADMIN_OPERATION_ERROR'; payload: string | null }
  | { type: 'CLEAR_ADMIN_OPERATION_ERROR' };