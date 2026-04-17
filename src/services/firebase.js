import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyCS3ujocu-Baw4nhKePQulaTbscZtlODhc",
  authDomain: "base-dados-programa-metas.firebaseapp.com",
  projectId: "base-dados-programa-metas",
  storageBucket: "base-dados-programa-metas.firebasestorage.app",
  messagingSenderId: "41685993854",
  appId: "1:41685993854:web:925ae5b8070b39c330cb2f"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);