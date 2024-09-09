import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCf5cgs16N_ewHu6Rvypnt2TOozU3AC2aI",
  authDomain: "apartmentweb-916d6.firebaseapp.com",
  projectId: "apartmentweb-916d6",
  storageBucket: "apartmentweb-916d6.appspot.com",
  messagingSenderId: "285898289407",
  appId: "1:285898289407:web:1128fd11e6f04e659f5cca"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { auth, signInWithEmailAndPassword, signInWithPopup, googleProvider, db };