import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {

  apiKey: "Api Key",

  authDomain: "resumeapp-8e1da.firebaseapp.com",

  projectId: "resumeapp-8e1da",

  storageBucket: "resumeapp-8e1da.firebasestorage.app",

  messagingSenderId: "609394334420",

  appId: "1:609394334420:web:9669b8a6e2ff986f1cf941",

  measurementId: "G-DXHK8Y68CF"

};


// ✅ Prevent duplicate app
const app = getApps().length === 0
  ? initializeApp(firebaseConfig)
  : getApp();

// ✅ SIMPLE AUTH (no errors)
const auth = getAuth(app);

export { app, auth };
