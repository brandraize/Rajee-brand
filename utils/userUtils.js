
import { doc, setDoc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../configuration/firebase-config';
export const getUserData = async (userId) => {
  try {
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists()) {
      return userDoc.data();
    }
    return null;
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
};
export const updateUserProfile = async (userId, userData) => {
  try {
    const userDocRef = doc(db, 'users', userId);
    await setDoc(userDocRef, userData, { merge: true });
    return true;
  } catch (error) {
    console.error('Error updating user profile:', error);
    return false;
  }
};
export const addUserPost = async (userId, post) => {
  try {
    const userDocRef = doc(db, 'users', userId);
    await updateDoc(userDocRef, {
      posts: arrayUnion(post)
    });
    return true;
  } catch (error) {
    console.error('Error adding user post:', error);
    return false;
  }
};