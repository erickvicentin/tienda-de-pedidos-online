
import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'; // Import Firestore

// TODO: Reemplaza esto con tu configuración real de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBUv0GHD-JOVo-QOJKKe411BVaVhdS9MfE",
  authDomain: "appauth-252bc.firebaseapp.com",
  projectId: "appauth-252bc",
  storageBucket: "appauth-252bc.firebasestorage.app",
  messagingSenderId: "742248457265",
  appId: "1:742248457265:web:81ebad55e7905591a8a110",
  measurementId: "G-LTGXWX16HQ"
};

// Inicializar Firebase
const app: FirebaseApp = initializeApp(firebaseConfig);
const auth: Auth = getAuth(app);
const db = getFirestore(app); // Initialize Firestore, type will be inferred

export { app, auth, db }; // Exportar app, auth y db