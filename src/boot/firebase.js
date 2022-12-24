import { initializeApp } from 'firebase/app'
import { getFirestore } from "firebase/firestore"

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyAwkAYE8qgI-gX4PP1H8rVlXqa1aFMgLWY",
  authDomain: "qweeter-1f3fe.firebaseapp.com",
  projectId: "qweeter-1f3fe",
  storageBucket: "qweeter-1f3fe.appspot.com",
  messagingSenderId: "482550715121",
  appId: "1:482550715121:web:c4760855f7cd01b83b0f50"
}

const app = initializeApp(firebaseConfig)

let db = getFirestore(app)


export default db
