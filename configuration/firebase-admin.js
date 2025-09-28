import admin from "firebase-admin";

if (!admin.apps.length) {
  try {
    const rawKey =
      process.env.FIREBASE_SERVICE_ACCOUNT_KEY ||
      process.env.NEXT_PUBLIC_FIREBASE_SERVICE_ACCOUNT_KEY ||
      "";

    const hasKey = typeof rawKey === "string" && rawKey.trim().length > 0;

    let serviceAccount = undefined;
    if (hasKey) {
      try {
        serviceAccount = JSON.parse(rawKey);
      } catch (parseError) {
        console.error("Error parsing FIREBASE_SERVICE_ACCOUNT_KEY JSON:", parseError.message);
        throw parseError;
      }
    }

    if (serviceAccount && typeof serviceAccount.private_key === "string") {
      serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, "\n");
    }

    if (serviceAccount && serviceAccount.private_key && serviceAccount.client_email) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: serviceAccount.project_id,
      });
    } else {
      throw new Error(
        "Missing valid service account credentials. Set FIREBASE_SERVICE_ACCOUNT_KEY in .env.local"
      );
    }
  } catch (error) {
    console.error('Firebase Admin initialization error:', error);
    console.error('Error details:', error.message);
    throw error;
  }
}

export const authAdmin = admin.auth();
export const firestoreAdmin = admin.firestore();
export const serverTimestamp = admin.firestore.FieldValue.serverTimestamp;