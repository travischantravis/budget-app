import * as firebase from "firebase";
import "firebase/firestore";

const config = {
  apiKey: "AIzaSyC0jvZNdYvolKwoULls3XClaxk0K7XHS6s",
  authDomain: "spendings-138e4.firebaseapp.com",
  databaseURL: "https://spendings-138e4.firebaseio.com",
  projectId: "spendings-138e4",
  storageBucket: "spendings-138e4.appspot.com",
  messagingSenderId: "396385506960",
  appId: "1:396385506960:web:21272430c5fc20039fea15",
};

firebase.initializeApp(config);

export default firebase;
