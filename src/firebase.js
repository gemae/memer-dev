import firebase from 'firebase';

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyBiQTZS1fb7n5xNd1kKS-PSuGGk01snbPw",
  authDomain: "memer-app-db5f8.firebaseapp.com",
  projectId: "memer-app-db5f8",
  storageBucket: "memer-app-db5f8.appspot.com",
  messagingSenderId: "540830499376",
  appId: "1:540830499376:web:303391a8a6102d1f1463f5",
  measurementId: "G-65MM1MSFZ0"
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db,auth,storage };