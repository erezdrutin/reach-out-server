// src/App.js
import React from 'react';
import { signInWithGoogle, signOutUser } from './components/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './components/firebase';
import { FaGoogle } from 'react-icons/fa';

function App() {
  const [user] = useAuthState(auth);
  

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <img src="/logo.png" alt="Logo" style={{ width: '300px', height: '300px', marginBottom: '20px' }} />
      <h1>מרכז מתנדבים</h1>
      {user ? (
        <>
          <p>Welcome, {user.displayName}!</p>
          <button onClick={signOutUser}>
            Sign Out
            </button>
        </>
      ) : (
        <button onClick={signInWithGoogle}>
        
        היכנס עם חשבון גוגל
        <br></br>
        <FaGoogle style={{ marginRight: '5px' }} /> 
        </button>
      )}
    </div>
  );
}

export default App;
