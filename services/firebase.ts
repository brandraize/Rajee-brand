import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  updateProfile,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../configuration/firebase-config';
import { ROLES, Role, isRoleValid } from '../constants/roles';

export interface UserData {
  uid: string;
  email: string;
  displayName?: string;
  role: Role;
  createdAt: any;
  updatedAt: any;
}

export class FirebaseAuthService {
  static async signIn(email: string, password: string): Promise<User> {
    try {

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      await userCredential.user.getIdToken(true);
      return userCredential.user;
    } catch (error: any) {
      console.error('Sign in error:', error);
      throw new Error(error.message || 'Failed to sign in');
    }
  }

  static async signUp(email: string, password: string, displayName?: string): Promise<User> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      if (displayName) {
        await updateProfile(userCredential.user, { displayName });
      }

      await this.createUserDocument(userCredential.user, ROLES.USER);
      return userCredential.user;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to create account');
    }
  }

  static async signOut(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error: any) {
      throw new Error(error.message || 'Failed to sign out');
    }
  }

  static async getUserData(uid: string): Promise<UserData | null> {
    try {


      const userDoc = await getDoc(doc(db, 'users', uid));

      if (!userDoc.exists()) {
        return null;
      }

      const userData = userDoc.data() as UserData;

      if (!isRoleValid(userData.role)) {
        throw new Error('Invalid role assigned to user');
      }

      return userData;
    } catch (error: any) {
      console.error('Error fetching user data:', error);
      console.error('Error details:', {
        code: error.code,
        message: error.message,
        stack: error.stack
      });
      throw new Error(error.message || 'Failed to fetch user data');
    }
  }

  static async createUserDocument(user: User, role: Role): Promise<void> {
    try {

      const userData: Omit<UserData, 'uid'> = {
        email: user.email!,
        displayName: user.displayName || '',
        role,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await setDoc(doc(db, 'users', user.uid), userData);
    } catch (error: any) {
      console.error('Error creating user document:', error);
      console.error('Error details:', {
        code: error.code,
        message: error.message,
        stack: error.stack
      });
      throw new Error(error.message || 'Failed to create user document');
    }
  }

  static async updateUserRole(uid: string, role: Role): Promise<void> {
    try {
      if (!isRoleValid(role)) {
        throw new Error('Invalid role provided');
      }

      await setDoc(
        doc(db, 'users', uid),
        { role, updatedAt: serverTimestamp() },
        { merge: true }
      );
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update user role');
    }
  }

  static onAuthStateChange(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(auth, callback);
  }

  static getCurrentUser(): User | null {
    return auth.currentUser;
  }
}
