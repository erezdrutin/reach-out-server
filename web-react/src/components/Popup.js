// Popup.js
import React from 'react';
import '../styles/Popup.css'; // Add styles for the Popup

const Popup = ({ children, onClose }) => {
  return (
    <div className="popup-overlay">
      <div className="popup">
        <button className="close-button" onClick={onClose}>
          Close
        </button>
        {children}
      </div>
    </div>
  );
};

export default Popup;
