import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyCDCwceZdXA_hSmh8QveZmCakhRyQXbp3A",
  authDomain: "trackflow-c6ced.firebaseapp.com",
  projectId: "trackflow-c6ced",
  storageBucket: "trackflow-c6ced.firebasestorage.app",
  messagingSenderId: "420841511603",
  appId: "1:420841511603:web:bef627f2add37c1c922ec6"
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
