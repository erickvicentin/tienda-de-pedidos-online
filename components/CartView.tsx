
import React from 'react';
import { CartItem, CustomerInfo } from '../types';
import CartItemCard from './CartItemCard';
import OrderForm from './OrderForm';
import LoadingSpinner from './LoadingSpinner';

interface CartViewProps {
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, selectedSize: number, quantity: number) => void;
  onRemoveItem: (productId: string, selectedSize: number) => void;
  onPlaceOrder: (customerInfo: CustomerInfo) => void;
  onClose: () => void;
  isSubmittingOrder: boolean;
}

const CartView: React.FC<CartViewProps> = ({
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onPlaceOrder,
  onClose,
  isSubmittingOrder,
}) => {
  const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-neutral rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-gray-300">
          <h2 className="text-2xl font-bold text-gray-800">Tu Carrito</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors text-2xl"
            aria-label="Cerrar carrito"
          >
            &times;
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-grow">
          {isSubmittingOrder && <LoadingSpinner />}
          {!isSubmittingOrder && (
            <>
              {cartItems.length === 0 ? (
                <p className="text-center text-gray-600 py-8 text-lg">Tu carrito está vacío.</p>
              ) : (
                <>
                  <div className="space-y-3 mb-6">
                    {cartItems.map((item) => (
                      <CartItemCard
                        key={`${item.id}-${item.selectedSize}`} // Ensure unique key for item + size
                        item={item}
                        onUpdateQuantity={onUpdateQuantity}
                        onRemoveItem={onRemoveItem}
                      />
                    ))}
                  </div>
                  <div className="py-4 border-t border-gray-200">
                    <div className="flex justify-between items-center text-xl font-semibold text-gray-800">
                      <span>Total:</span>
                      <span>${totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  {/* Aviso sobre revisión de stock y contacto */}
                  <div className="my-4 p-3 bg-blue-100 border-l-4 border-blue-500 text-blue-700 rounded-md shadow-sm">
                    <p className="text-sm">
                      <strong>Importante:</strong> Una vez realizado el pedido, revisaremos el stock disponible de los productos seleccionados. 
                      Nos pondremos en contacto contigo a la brevedad para confirmar y coordinar la entrega.
                    </p>
                  </div>

                  <OrderForm onSubmit={onPlaceOrder} />
                </>
              )}
            </>
          )}
        </div>
        
        {!isSubmittingOrder && cartItems.length > 0 && ( // Only show "Seguir Comprando" if form is not submitted and cart has items
          <div className="p-6 border-t border-gray-300 bg-gray-50 rounded-b-xl">
            <button
              onClick={onClose}
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-4 rounded-lg transition-colors"
            >
              Seguir Comprando
            </button>
          </div>
        )}
         {!isSubmittingOrder && cartItems.length === 0 && ( // Show a different button or message if cart is empty
          <div className="p-6 border-t border-gray-300 bg-gray-50 rounded-b-xl text-center">
             <button
              onClick={onClose}
              className="bg-primary hover:opacity-80 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Ver Productos
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartView;
