import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';


const firebaseConfig = {
    apiKey: "AIzaSyACfecpB0QUU6SIaCo4vosWkPTf2npFLDs",
  authDomain: "reach-out-react.firebaseapp.com",
  projectId: "reach-out-react",
  storageBucket: "reach-out-react.appspot.com",
  messagingSenderId: "441991920419",
  appId: "1:441991920419:web:7e826eb178c76ea8df2a96",
  measurementId: "G-Y3K4SMXNJB"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const firestore = getFirestore(app);
