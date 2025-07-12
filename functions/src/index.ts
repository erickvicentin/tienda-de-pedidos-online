import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

const db = admin.firestore();

export const generateOrderNumber = functions.firestore
  .document("orders/{orderId}")
  .onCreate(async (snap, context) => {
    const counterRef = db.collection("internal").doc("orderCounter");

    try {
      const newOrderNumber = await db.runTransaction(async (transaction) => {
        const counterDoc = await transaction.get(counterRef);

        let nextNumber = 1;
        if (counterDoc.exists) {
          const currentNumber = counterDoc.data()?.currentNumber || 0;
          nextNumber = currentNumber + 1;
        }

        transaction.set(counterRef, { currentNumber: nextNumber });
        return nextNumber;
      });

      await snap.ref.update({ orderNumber: newOrderNumber });
      functions.logger.log(
        `Assigned order number ${newOrderNumber} to order ${context.params.orderId}`
      );
    } catch (error) {
      functions.logger.error(
        "Failed to generate order number for order",
        context.params.orderId,
        error
      );
    }
  });
