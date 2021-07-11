import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/storage'

const config = {
  apiKey: "AIzaSyDyWSlLfn4xaHa2vDVP-ndkHgdC-VUli3g",
  authDomain: "petfinder-b4ec4.firebaseapp.com",
  projectId: "petfinder-b4ec4",
  storageBucket: "petfinder-b4ec4.appspot.com",
  messagingSenderId: "347902170293",
  appId: "1:347902170293:web:82ad3b56ba3a0df6bedafc"

};


const fire = firebase.initializeApp(config)
const storage = firebase.storage()

const auth = firebase.auth()
var provider = new firebase.auth.GoogleAuthProvider();
firebase.auth().useDeviceLanguage();

export { storage, fire, config, auth, provider }