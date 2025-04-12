import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBOcNS2PsLHk9-FpB1AESSGi4SKLdHJL9U",
  authDomain: "lab04-rn-c81f8.firebaseapp.com",
  projectId: "lab04-rn-c81f8",
  storageBucket: "lab04-rn-c81f8.firebasestorage.app",
  messagingSenderId: "989915623862",
  appId: "1:989915623862:web:0d4c92551761e595d6d117"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
