

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
  Timestamp,
  deleteDoc
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
      size: item.selectedSize,
      price: item.price // Añadir el precio unitario
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
    let orderDate: string;

    // Defensive check for issue_date
    if (data.issue_date) {
      orderDate = data.issue_date instanceof Timestamp
        ? data.issue_date.toDate().toISOString()
        : new Date(data.issue_date).toISOString();
    } else {
      console.warn(`El pedido con ID ${doc.id} no tiene fecha (issue_date). Usando fecha actual como fallback.`);
      orderDate = new Date().toISOString();
    }
    
    // Defensive check for product_cart and its items
    const items = (data.product_cart || []).map((item: any, index: number) => {
      if (!item || typeof item !== 'object') {
        console.warn(`Elemento inválido en product_cart para el pedido ${doc.id} en el índice ${index}. Omitiendo.`);
        return null; // Será filtrado más abajo
      }
      return {
        id: item.id || `temp-id-${index}`, // Provide a temporary unique ID
        name: item.name || 'Producto Desconocido',
        quantity: item.quantity || 0,
        selectedSize: item.size !== undefined ? item.size : 0, // Map size to selectedSize with fallback
        price: item.price || 0,
        // Fill with default values to satisfy the CartItem type
        description: item.description || '',
        imageUrl: item.imageUrl || '',
        category: item.category || 'Otra',
        gender: item.gender || 'Unisex',
        author: item.author || '',
        sizes: item.sizes || [],
      };
    }).filter((item): item is CartItem => item !== null);


    return {
      id: doc.id,
      orderNumber: data.orderNumber, // Añadir el nuevo campo
      status: data.status as OrderStatus || 'Pendiente',
      customerInfo: {
        name: data.owner || 'Sin nombre',
        phone: data.phone || 'Sin teléfono',
        address: data.address || 'Sin dirección',
      },
      totalAmount: data.total_amount || 0,
      orderDate: orderDate,
      items: items,
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

// Function to delete an order from Firestore
export const deleteOrder = async (orderId: string): Promise<void> => {
  if (!db) {
    console.error("deleteOrder: La base de datos no está inicializada.");
    throw new Error('La base de datos no está inicializada.');
  }
  console.log(`orderService: Deleting order ${orderId} from Firestore`);

  const orderRef = doc(db, 'orders', orderId);
  await deleteDoc(orderRef);
};
