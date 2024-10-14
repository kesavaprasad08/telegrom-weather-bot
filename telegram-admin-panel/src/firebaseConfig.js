
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDaENgn80XpjomSv7dlgjfc-dreLStkGYY",
  authDomain: "weather-app-9efc6.firebaseapp.com",
  projectId: "weather-app-9efc6",
  storageBucket: "weather-app-9efc6.appspot.com",
  messagingSenderId: "253525154670",
  appId: "1:253525154670:web:34189d06e353b6b7c93f7f"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
