
import { auth } from './firebase';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';

export const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
  
    // After successful authentication, check Firestore collection
    const userEmail = result.user.email;
  
    // Use your Firestore collection reference here
    const firestore = getFirestore();
    const emailsCollection = collection(firestore, 'volunteers');
  
    try {
      const querySnapshot = await getDocs(query(emailsCollection, where('email', '==', userEmail)));
  
      if (!querySnapshot.empty) {
        // Email found in Firestore collection, redirect to another page
        window.location.href = '/mainPage'; // Replace with your desired page
        
      } else {
        alert('no');
      }
    } catch (error) {
      console.error('Error querying Firestore:', error.message);
    }
    
  };

export const signOutUser = () => {
  return signOut(auth);
};
