import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyB02kFFRB0DbyonX-t677riQKuHQTICmlM",
  authDomain: "shop-vid.firebaseapp.com",
  projectId: "shop-vid",
  storageBucket: "shop-vid.appspot.com",
  messagingSenderId: "999284581105",
  appId: "1:999284581105:web:542b493f0a5934399bbf50"
};

const firebaseApp = initializeApp(firebaseConfig);

export default firebaseApp