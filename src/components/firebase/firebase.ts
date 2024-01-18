import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyBpSWX1VcnAcck5fGeNlsauf-NfJdTMWto',
  authDomain: 'study-vue-1b3bd.firebaseapp.com',
  projectId: 'study-vue-1b3bd',
  storageBucket: 'study-vue-1b3bd.appspot.com',
  messagingSenderId: '527740162063',
  appId: '1:527740162063:web:a7218d60b972c984e8137a'
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

const db = getFirestore(app)
export default db
export const auth = getAuth()
