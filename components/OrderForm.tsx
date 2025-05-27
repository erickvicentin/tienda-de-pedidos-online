
import React, { useState } from 'react';
import { CustomerInfo } from '../types';

interface OrderFormProps {
  onSubmit: (customerInfo: CustomerInfo) => void;
}

const OrderForm: React.FC<OrderFormProps> = ({ onSubmit }) => {
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    phone: '',
    email: '',
    address: '',
  });
  const [errors, setErrors] = useState<Partial<CustomerInfo>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCustomerInfo({ ...customerInfo, [e.target.name]: e.target.value });
    if (errors[e.target.name as keyof CustomerInfo]) {
        setErrors({ ...errors, [e.target.name]: undefined });
    }
  };
  
  const validateForm = (): boolean => {
    const newErrors: Partial<CustomerInfo> = {};
    if (!customerInfo.name.trim()) newErrors.name = "El nombre es obligatorio.";
    if (!customerInfo.phone.trim()) {
        newErrors.phone = "El teléfono es obligatorio.";
    } else if (!/^\+?[0-9\s-()]{7,20}$/.test(customerInfo.phone)) {
        newErrors.phone = "El formato del teléfono no es válido.";
    }
    if (!customerInfo.email.trim()) {
        newErrors.email = "El correo electrónico es obligatorio.";
    } else if (!/\S+@\S+\.\S+/.test(customerInfo.email)) {
        newErrors.email = "El formato del correo electrónico no es válido.";
    }
    if (!customerInfo.address.trim()) newErrors.address = "La dirección es obligatoria.";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
        onSubmit(customerInfo);
    }
  };

  const inputClass = "mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm";
  const errorClass = "text-red-500 text-xs mt-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-6 p-6 bg-gray-50 rounded-lg shadow">
      <h3 className="text-xl font-semibold text-gray-700 mb-4">Información de Contacto y Envío</h3>
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre Completo</label>
        <input type="text" name="name" id="name" value={customerInfo.name} onChange={handleChange} className={inputClass} required />
        {errors.name && <p className={errorClass}>{errors.name}</p>}
      </div>
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Teléfono</label>
        <input type="tel" name="phone" id="phone" value={customerInfo.phone} onChange={handleChange} className={inputClass} required />
        {errors.phone && <p className={errorClass}>{errors.phone}</p>}
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
        <input type="email" name="email" id="email" value={customerInfo.email} onChange={handleChange} className={inputClass} required />
        {errors.email && <p className={errorClass}>{errors.email}</p>}
      </div>
      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700">Dirección de Entrega</label>
        <textarea name="address" id="address" rows={3} value={customerInfo.address} onChange={handleChange} className={inputClass} required />
        {errors.address && <p className={errorClass}>{errors.address}</p>}
      </div>
      <button 
        type="submit" 
        className="w-full bg-primary hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
      >
        Realizar Pedido
      </button>
    </form>
  );
};

export default OrderForm;
    