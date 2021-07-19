import firebase from 'firebase'
//import firestore from 'firebase/firestore'
  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyBb4WwUjY3P3H1yHJ5qwlPVjkN9bGQVp3M",
    authDomain: "unalmanaque.firebaseapp.com",
    projectId: "unalmanaque",
    storageBucket: "unalmanaque.appspot.com",
    messagingSenderId: "504963672073",
    appId: "1:504963672073:web:bdf6600bb1fc2a2ddb70d8"
  };
  // Initialize Firebase
  const firebaseApp = firebase.initializeApp(firebaseConfig);
  firebaseApp.firestore().settings({ timestampsInSnapshots: true});

  export default firebaseApp.firestore();