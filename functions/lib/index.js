"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOrderNumber = void 0;
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();
exports.generateOrderNumber = functions.firestore
    .document("orders/{orderId}")
    .onCreate(async (snap, context) => {
    const counterRef = db.collection("internal").doc("orderCounter");
    try {
        const newOrderNumber = await db.runTransaction(async (transaction) => {
            var _a;
            const counterDoc = await transaction.get(counterRef);
            let nextNumber = 1;
            if (counterDoc.exists) {
                const currentNumber = ((_a = counterDoc.data()) === null || _a === void 0 ? void 0 : _a.currentNumber) || 0;
                nextNumber = currentNumber + 1;
            }
            transaction.set(counterRef, { currentNumber: nextNumber });
            return nextNumber;
        });
        await snap.ref.update({ orderNumber: newOrderNumber });
        functions.logger.log(`Assigned order number ${newOrderNumber} to order ${context.params.orderId}`);
    }
    catch (error) {
        functions.logger.error("Failed to generate order number for order", context.params.orderId, error);
    }
});
//# sourceMappingURL=index.js.map