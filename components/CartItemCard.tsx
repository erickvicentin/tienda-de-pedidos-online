import React from 'react';
import { CartItem } from '../types';
import PlusIcon from './icons/PlusIcon';
import MinusIcon from './icons/MinusIcon';
import TrashIcon from './icons/TrashIcon';

interface CartItemCardProps {
  item: CartItem;
  onUpdateQuantity: (productId: string, selectedSize: number, quantity: number) => void;
  onRemoveItem: (productId: string, selectedSize: number) => void;
}

const CartItemCard: React.FC<CartItemCardProps> = ({ item, onUpdateQuantity, onRemoveItem }) => {
  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1) {
      onUpdateQuantity(item.id, item.selectedSize, newQuantity);
    } else if (newQuantity === 0) {
        onRemoveItem(item.id, item.selectedSize);
    }
  };

  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white rounded-lg shadow mb-2">
      <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover rounded-md mr-4" />
      <div className="flex-grow">
        <h4 className="text-md font-semibold text-gray-800">{item.name}</h4>
        <p className="text-sm text-gray-500">Tamaño: {item.selectedSize}ml</p>
        <p className="text-sm text-gray-500">${item.price.toFixed(2)} c/u</p>
      </div>
      <div className="flex items-center mx-4">
        <button
          onClick={() => handleQuantityChange(item.quantity - 1)}
          className="p-1 rounded-full text-primary hover:bg-gray-200 disabled:opacity-50"
          disabled={item.quantity <= 1 && item.quantity !==0} // Allow decreasing to 0 to trigger removal
          aria-label="Disminuir cantidad"
        >
          <MinusIcon />
        </button>
        <span className="mx-2 text-md w-8 text-center">{item.quantity}</span>
        <button
          onClick={() => handleQuantityChange(item.quantity + 1)}
          className="p-1 rounded-full text-primary hover:bg-gray-200"
          aria-label="Aumentar cantidad"
        >
          <PlusIcon />
        </button>
      </div>
      <p className="text-md font-semibold text-gray-700 w-24 text-right">${(item.price * item.quantity).toFixed(2)}</p>
      <button
        onClick={() => onRemoveItem(item.id, item.selectedSize)}
        className="ml-4 text-red-500 hover:text-red-700"
        aria-label="Eliminar item"
      >
        <TrashIcon className="h-6 w-6" />
      </button>
    </div>
  );
};

export default CartItemCard;