import admin from "firebase-admin";
import serviceAccount from "../firebase-service-account.json" with { type: "json" };

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

export const auth = admin.auth();
export const db = admin.firestore();

export default admin;