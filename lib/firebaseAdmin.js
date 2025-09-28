import admin from "firebase-admin";

if (!admin.apps.length) {
  try {
    let serviceAccount;

    if (process.env.NEXT_PUBLIC_FIREBASE_SERVICE_ACCOUNT_KEY) {
      serviceAccount = JSON.parse(process.env.NEXT_PUBLIC_FIREBASE_SERVICE_ACCOUNT_KEY);

      if (serviceAccount.private_key) {
        serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, "\n");
      }
    } else {
      serviceAccount = require("../firebase.json");
    }

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`,
    });

  } catch (error) {
    console.error("Firebase admin initialization error:", error);

    if (error.code === "ENOENT") {
      console.error("firebase.json file not found");
    } else if (error instanceof SyntaxError) {
      console.error("Invalid JSON in NEXT_PUBLIC_FIREBASE_SERVICE_ACCOUNT_KEY environment variable");
    } else {
      console.error("Unknown error:", error.message);
    }
  }
}

const auth = admin.auth();
const db = admin.firestore();

export { auth, db };
export default admin;
