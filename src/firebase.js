import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyBtPvjsYv8JrbHpSSjL0yg0oYcclNz7S5U",
  authDomain: "clone-34c38.firebaseapp.com",
  projectId: "clone-34c38",
  storageBucket: "clone-34c38.firebasestorage.app",
  messagingSenderId: "801084294706",
  appId: "1:801084294706:web:482a09ef65e34704b55e2b",
  measurementId: "G-VF3LRW1J5J",
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const provider = new GoogleAuthProvider();
export default app;