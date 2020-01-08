import firebase from 'firebase/app';
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDieRFWQXxWZNTSpQrytQ7muWgh_IRcndo",
  authDomain: "badass-summer-2020.firebaseapp.com",
  databaseURL: "https://badass-summer-2020.firebaseio.com",
  projectId: "badass-summer-2020",
  storageBucket: "badass-summer-2020.appspot.com",
  messagingSenderId: "999778934531",
  appId: "1:999778934531:web:1ccfb5698d216e6bd6d336"
};

firebase.initializeApp(firebaseConfig);

export const db = firebase.firestore();