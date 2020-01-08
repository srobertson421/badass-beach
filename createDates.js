const firebase = require('firebase');

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

const db = firebase.firestore();

const june = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30];
const july = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];
const august = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];

function seedJune() {
  let count = 0;
  const dbInterval = setInterval(() => {
    if(count === june.length) {
      clearInterval(dbInterval);
      console.log('Finished June');
      seedJuly();
      return;
    }

    const newDate = {
      date: firebase.firestore.Timestamp.fromDate(new Date(`6/${june[count]}/2020`)),
      people: [],
      peopleCount: 0,
    }

    count++;

    db.collection('dates').add(newDate);
  }, 1000);
}

function seedJuly() {
  let count = 0;
  const dbInterval = setInterval(() => {
    if(count === july.length) {
      clearInterval(dbInterval);
      console.log('Finished July');
      seedAugust();
      return;
    }

    const newDate = {
      date: firebase.firestore.Timestamp.fromDate(new Date(`7/${july[count]}/2020`)),
      people: [],
      peopleCount: 0,
    }

    count++;

    db.collection('dates').add(newDate);
  }, 1000);
}

function seedAugust() {
  let count = 0;
  const dbInterval = setInterval(() => {
    if(count === august.length) {
      clearInterval(dbInterval);
      console.log('Finished August');
      return;
    }

    const newDate = {
      date: firebase.firestore.Timestamp.fromDate(new Date(`8/${august[count]}/2020`)),
      people: [],
      peopleCount: 0,
    }

    count++;

    db.collection('dates').add(newDate);
  }, 1000);

  count++;
}

seedJune();