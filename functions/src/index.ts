import * as functions from "firebase-functions";
import * as https from "https";

// Define la estructura de los datos del pedido que se esperan
interface OrderData {
  orderId: string;
  customerName: string;
  totalAmount: number;
  address: string;
  itemsSummary: string;
}

// Función para enviar un mensaje de WhatsApp a través de CallMeBot
const sendWhatsApp = (
  phoneNumber: string,
  apiKey: string,
  message: string
): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!phoneNumber || !apiKey) {
      // Mensaje acortado para cumplir con el max-len
      console.warn("Teléfono o API key no proporcionados. Omitiendo.");
      // Resuelve la promesa para no detener el proceso si una credencial falta
      resolve();
      return;
    }

    const encodedMessage = encodeURIComponent(message);
    const url =
      `https://api.callmebot.com/whatsapp.php?phone=${phoneNumber}` +
      `&text=${encodedMessage}&apikey=${apiKey}`;

    const req = https.get(url, (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        console.log("Respuesta de CallMeBot:", data);
        if (res.statusCode === 200) {
          resolve();
        } else {
          // Rechaza solo si hay un error real de la API
          reject(
            new Error(
              `Error de CallMeBot - Status: ${res.statusCode}, Body: ${data}`
            )
          );
        }
      });
    });

    req.on("error", (err) => {
      console.error("Error al enviar WhatsApp:", err.message);
      reject(err);
    });
  });
};

// Cloud Function (callable) para enviar la notificación del pedido
export const sendOrderNotification = functions.https.onCall(
  // Se restaura el parámetro 'context' (como _context) para arreglar el tipado
  async (data: OrderData, _context) => {
    // Recupera las credenciales de forma segura desde las variables de entorno
    const config = functions.config();
    const numberErick = config.callmebot.number_erick;
    const keyErick = config.callmebot.key_erick;
    const numberMelisa = config.callmebot.number_melisa;
    const keyMelisa = config.callmebot.key_melisa;

    // Valida los datos de entrada
    if (
      !data.orderId ||
      !data.customerName ||
      !data.totalAmount ||
      !data.address ||
      !data.itemsSummary
    ) {
      console.error("Error: Faltan datos en la solicitud.", data);
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Faltan datos en la solicitud. Asegúrate de enviar orderId, " +
        "customerName, totalAmount, address y itemsSummary."
      );
    }

    // Formatea el mensaje de WhatsApp
    const message =
      `📦 *¡Nuevo pedido recibido!* 📦

` +
      `*ID:* ${data.orderId}
` +
      `*Cliente:* ${data.customerName}
` +
      `*Total:* ${data.totalAmount.toFixed(2)}
` +
      `*Dirección:* ${data.address}

` +
      `*Productos:*
${data.itemsSummary}`;

    try {
      // Envía los mensajes de WhatsApp en paralelo
      await Promise.all([
        sendWhatsApp(numberErick, keyErick, message),
        sendWhatsApp(numberMelisa, keyMelisa, message),
      ]);

      console.log("Notificaciones de WhatsApp enviadas con éxito.");
      return {
        success: true,
        message: "Notificaciones enviadas correctamente.",
      };
    } catch (error) {
      console.error(
        "Ocurrió un error al intentar enviar las notificaciones:",
        error
      );
      // Lanza un error HttpsError para que el cliente lo pueda manejar
      throw new functions.https.HttpsError(
        "internal",
        "No se pudieron enviar las notificaciones de WhatsApp.",
        error
      );
    }
  }
);

