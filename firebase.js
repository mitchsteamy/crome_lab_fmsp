// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence, getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// import { getAnalytics } from "firebase/analytics";

import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from "react-native";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCqSIM_sS5LYO0h47WiOX-qVPLHIW3VB44",
  authDomain: "fmsp-crome-lab.firebaseapp.com",
  projectId: "fmsp-crome-lab",
  storageBucket: "fmsp-crome-lab.firebasestorage.app",
  messagingSenderId: "42428224215",
  appId: "1:42428224215:web:a17dd2937c41bef8435692",
  measurementId: "G-SY463LCM5F"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);


// initialize auth (getAuth does not persist logins in mobile app but my be used to view app in web view)
let auth;

if (Platform.OS === 'web') {
  auth = getAuth(app);
} else {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
  });
}


//initialize firestore db
const db = getFirestore(app);

// initialize storage (not currently using storage)
const storage = getStorage(app);


// initialize analytics and log recieved notificaitons
// const analytics = getAnalytics(app);

export { auth, db, storage };