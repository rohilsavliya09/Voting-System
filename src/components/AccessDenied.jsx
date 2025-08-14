import React from 'react';
import './AccessDenied.css';

function AccessDenied({ userType }) {
  const getMessage = () => {
    if (userType === 'voter') {
      return {
        title: "Access Denied",
        message: "You are a voter. You do not have rights for candidate features.",
        icon: "🗳️"
      };
    } else if (userType === 'candidate') {
      return {
        title: "Access Denied", 
        message: "You are a candidate. You do not have rights for voter features.",
        icon: "👤"
      };
    }
    return {
      title: "Access Denied",
      message: "You do not have permission to access this page.",
      icon: "🚫"
    };
  };

  const { title, message, icon } = getMessage();

  return (
    <div className="access-denied-container">
      <div className="access-denied-card">
        <div className="access-denied-icon">{icon}</div>
        <h1>{title}</h1>
        <p>{message}</p>
        <div className="access-denied-actions">
          <button 
            onClick={() => window.history.back()} 
            className="back-btn"
          >
            Go Back
          </button>
          <button 
            onClick={() => window.location.href = '/'} 
            className="home-btn"
          >
            Go to Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default AccessDenied; 