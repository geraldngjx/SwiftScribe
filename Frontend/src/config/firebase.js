import firebase from 'firebase/compat/app'
import 'firebase/compat/auth';

const firebaseConfig = {
    apiKey: "AIzaSyByQYT-Hzc_xlReQQKa59ToWGElLSAIi-0",
    authDomain: "swiftscribe-2dc40.firebaseapp.com",
    projectId: "swiftscribe-2dc40",
    storageBucket: "swiftscribe-2dc40.appspot.com",
    messagingSenderId: "172918938959",
    appId: "1:172918938959:web:fe6e32e3c0829a48fd793a",
    measurementId: "G-3XY0L971VX"
}

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
  
  export const auth = firebase.auth();