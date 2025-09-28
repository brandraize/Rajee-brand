import { initializeApp, getApps } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// ✅ Firebase Client SDK config (safe to expose)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase app only once
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const storage = getStorage(app);

/**
 * Upload an image to Firebase Storage and return its public URL
 * @param {File} file - File object (from input or drag-drop)
 * @param {string} uid - User ID
 * @param {string} type - "profile" | "cover" | any folder name
 * @returns {Promise<string>} - Download URL
 */
export async function uploadImageToFirebase(file, uid, type = "misc") {
  try {
    // Example path: users/{uid}/profile-16952491234-avatar.png
    const filePath = `users/${uid}/${type}-${Date.now()}-${file.name}`;
    const storageRef = ref(storage, filePath);

    // Upload file
    await uploadBytes(storageRef, file);

    // Get public download URL
    const url = await getDownloadURL(storageRef);

    return url;
  } catch (err) {
    console.error("Error uploading to Firebase:", err);
    throw err;
  }
}
