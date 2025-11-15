import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyAGwqhSOMvPRWjzQjHuFWEQ2GjUevfc1T8",
  authDomain: "omni-flow-49d0d.firebaseapp.com",
  projectId: "omni-flow-49d0d",
  storageBucket: "omni-flow-49d0d.firebasestorage.app",
  messagingSenderId: "451070407318",
  appId: "1:451070407318:web:310042b7b2711cd71c88b7",
  measurementId: "G-3CXW4BGP2L"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const analytics = getAnalytics(app);