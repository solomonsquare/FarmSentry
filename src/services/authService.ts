import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  AuthError
} from 'firebase/auth';
import { auth } from '../config/firebase';

export class AuthService {
  static async register(email: string, password: string) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      const authError = error as AuthError;
      throw new Error(authError.message || 'Failed to create account');
    }
  }

  static async login(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      const authError = error as AuthError;
      throw new Error(authError.message || 'Failed to sign in');
    }
  }

  static async logout() {
    try {
      await signOut(auth);
    } catch (error) {
      const authError = error as AuthError;
      throw new Error(authError.message || 'Failed to sign out');
    }
  }
}