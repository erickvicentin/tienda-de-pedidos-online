

import { Product, Order, OrderStatus, CartItem } from '../types';
// getProductsFromFirestore is an alias for productService.getProducts
import { getProducts as getProductsFromProductService } from './productService';
import { db } from '../firebaseConfig'; // Import the initialized db instance
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  query,
  orderBy,
  Timestamp
} from 'firebase/firestore';


export const fetchProducts = async (): Promise<Product[]> => {
  // This will call the mocked version of getProducts from productService
  return await getProductsFromProductService();
};

export const submitOrder = async (orderData: Omit<Order, 'id' | 'status'>): Promise<{
  success: boolean;
  message: string;
  orderId?: string;
}> => {
  if (!db) {
    return {
      success: false,
      message: 'La base de datos no está inicializada. Contacte al administrador.'
    };
  }
  console.log('Enviando pedido a Firestore:', orderData);
  try {
    // Ensure optional fields are not undefined
    const customerInfo = {
      name: orderData.customerInfo.name,
      phone: orderData.customerInfo.phone || '', // Default to empty string if undefined
      address: orderData.customerInfo.address,
    };

    // Simplify items to only include essential fields
    const simplifiedItems = orderData.items.map(item => ({
      name: item.name,
      quantity: item.quantity,
      size: item.selectedSize, // Corregido de item.size a item.selectedSize
    }));

    const docData = {
      owner: customerInfo.name,
      phone: customerInfo.phone,
      address: customerInfo.address,
      issue_date: Timestamp.fromDate(new Date(orderData.orderDate)),
      total_amount: orderData.totalAmount,
      status: 'Pendiente' as OrderStatus,
      product_cart: simplifiedItems, // Storing the simplified item array
    };

    const ordersCollection = collection(db, 'orders');
    const docRef = await addDoc(ordersCollection, docData);

    console.log('Pedido enviado con éxito a Firestore con ID:', docRef.id);
    return {
      success: true,

      message: '¡Pedido realizado con éxito! Nos comunicaremos pronto contigo.',
      orderId: docRef.id,
    };

  } catch (error) {
    console.error('Error al enviar el pedido a Firestore:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      success: false,
      message: `No se pudo registrar el pedido en la base de datos. Detalle: ${errorMessage}`,
    };
  }
};


// Function to get orders from Firestore for admin panel
export const getOrders = async (): Promise<Order[]> => {
  if (!db) {
    console.error("getOrders: La base de datos no está inicializada.");
    throw new Error('La base de datos no está inicializada.');
  }
  console.log("orderService: Fetching orders from Firestore");

  const ordersCollection = collection(db, 'orders');
  const q = query(ordersCollection, orderBy('issue_date', 'desc'));
  const querySnapshot = await getDocs(q);

  const orders: Order[] = querySnapshot.docs.map(doc => {
    const data = doc.data();
    const orderDate = data.issue_date instanceof Timestamp
      ? data.issue_date.toDate().toISOString()
      // Fallback for manually entered data that might not be a Timestamp
      : new Date(data.issue_date).toISOString() || new Date().toISOString();

    return {
      id: doc.id,
      status: data.status as OrderStatus,
      customerInfo: {
        name: data.owner,
        phone: data.phone,
        address: data.address,
      },
      totalAmount: data.total_amount,
      orderDate: orderDate,
      items: data.product_cart as CartItem[],
    };
  });
  return orders;
};

// Function to update order status in Firestore
export const updateOrderStatus = async (orderId: string, status: OrderStatus): Promise<void> => {
  if (!db) {
    console.error("updateOrderStatus: La base de datos no está inicializada.");
    throw new Error('La base de datos no está inicializada.');
  }
  console.log(`orderService: Updating order ${orderId} to status ${status} in Firestore`);

  const orderRef = doc(db, 'orders', orderId);
  await updateDoc(orderRef, {
    status: status
  });
};
