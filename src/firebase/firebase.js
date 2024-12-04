// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCDTXF6ENp3CZ-jti1xp853zRzWdGzOVmg",
  authDomain: "abzikel-taskscloud.firebaseapp.com",
  projectId: "abzikel-taskscloud",
  storageBucket: "abzikel-taskscloud.firebasestorage.app",
  messagingSenderId: "255824825520",
  appId: "1:255824825520:web:6aad19b7e5caa2858e7f75",
  measurementId: "G-71H4M1KRHG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Export Authentication
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();