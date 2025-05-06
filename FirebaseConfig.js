import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDMGiGo4PwYVdPeW_g3hfow_jtLimaqVGg",
    authDomain: "geopin-a0223.firebaseapp.com",
    projectId: "geopin-a0223",
    storageBucket: "geopin-a0223.firebasestorage.app",
    messagingSenderId: "156648651841",
    appId: "1:156648651841:web:31e57ac257cbc74cf59ac0",
    measurementId: "G-6W4B57THL7"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export { db, collection, getDocs };