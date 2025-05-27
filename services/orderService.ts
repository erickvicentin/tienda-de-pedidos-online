
import { Product, Order, ScriptErrorDetails } from '../types';
// import { MOCK_PRODUCTS } from '../constants'; // Ya no se usa MOCK_PRODUCTS
import { getProducts as getProductsFromFirestore } from './productService';


// URL del Google Apps Script desplegado como aplicación web
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzadV7VtzQdtCnuZBOhHQjp6gbS1IsBfDAYfLWFnV-N0pQCRonLYRfuSuZifx74QEzNZQ/exec";

export const fetchProducts = async (): Promise<Product[]> => {
  // return new Promise((resolve) => {
  //   setTimeout(() => {
  //     resolve(MOCK_PRODUCTS);
  //   }, 500); // Simular retraso de red
  // });
  return await getProductsFromFirestore();
};

export const submitOrder = async (order: Order): Promise<{ 
  success: boolean; 
  message: string; 
  orderId?: string;
  scriptErrorDetails?: ScriptErrorDetails; 
}> => {
  console.log('Enviando pedido a Google Apps Script:', order);
  try {
    const response = await fetch(SCRIPT_URL, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({ data: JSON.stringify(order) }).toString(),
    });

    const resultText = await response.text();
    let resultData;
    try {
        resultData = JSON.parse(resultText);
    } catch (e) {
        console.error("Respuesta de Apps Script no es JSON válido:", resultText);
        return { 
            success: false, 
            message: `Error de comunicación con el servidor de pedidos. Respuesta (primeros 150 caracteres): ${resultText.substring(0,150)}...`
        };
    }

    if (response.ok && resultData.success) {
      console.log('Pedido enviado con éxito a Google Sheets:', resultData);
      return { 
        success: true, 
        message: resultData.message || '¡Pedido realizado con éxito! Nos comunicaremos pronto contigo.', 
        orderId: resultData.orderId 
      };
    } else {
      console.error('Error al enviar el pedido a Google Sheets. Respuesta del script:', resultData);
      return { 
        success: false, 
        message: resultData.message || 'Hubo un problema al procesar tu pedido con el servidor.',
        scriptErrorDetails: resultData.scriptErrorDetails // Asegúrate de pasar esto
      };
    }
  } catch (error) {
    console.error('Error de red al enviar el pedido:', error);
    const errorDetails = error instanceof Error ? error.message : String(error);
    let userMessage = `No se pudo conectar con el servidor de pedidos. Verifica tu conexión a internet. Detalle: ${errorDetails}`;

    if (errorDetails.toLowerCase().includes('failed to fetch')) {
      userMessage = "Error crítico al contactar el servidor de pedidos. El servidor podría estar inaccesible o hay un problema de CORS no manejado por el servidor para errores."
    }
    return { 
        success: false, 
        message: userMessage
    };
  }
};
