import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyCJvLQZBZrnseFt8emA11T86ZReLoucBFA",
  authDomain: "farm-management-7be85.firebaseapp.com",
  projectId: "farm-management-7be85",
  storageBucket: "farm-management-7be85.appspot.com",
  messagingSenderId: "577175197106",
  appId: "1:577175197106:web:5f25a2790611f694f840ab",
  measurementId: "G-71JQSW2F4H"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

let analytics = null;
isSupported().then(yes => yes && (analytics = getAnalytics(app)));

export { analytics };
export default app;