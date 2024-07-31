import { initializeApp } from "firebase/app";
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  storageBucket: 'gs://elysian-mirago.appspot.com',
  apiKey: "AIzaSyBWNt43Uqc7_DWyM41qQOBmhUp2CYIvMhA",
  authDomain: "elysian-mirago.firebaseapp.com",
  projectId: "elysian-mirago",
  messagingSenderId: "486030950411",
  appId: "1:486030950411:web:b266bd72124fc1cf53c70e",
  measurementId: "G-BQ65CHPNM4"
};

export const setupFirebase = initializeApp(firebaseConfig);

export const storage = getStorage(setupFirebase); 
export const db = getFirestore(setupFirebase);