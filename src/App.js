// App.js
import { useState, useEffect } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import Header from './C_Component/Header/Header';
import VerticalNavbar from './C_Component/Side-Heaeder/VerticalNavbar';
import Login from './core-component/Login/Login';
import CVCard from './pages/CVCard/CVCard';
import CVSection from './pages/CVSection/CVSection';
import FinalResult from './pages/FinalResult/FinalResult';
import Home from './pages/Home/Home';
import VotingSection from './pages/VotingSection/VotingSection';
import AccessDenied from './components/AccessDenied';
import welcomeImg from './Gallary/Slide_16_12474uV2.webp';

// Protected Route Component
function ProtectedRoute({ userType, allowedUserType, children }) {
  if (!userType) {
    return <AccessDenied userType={null} />;
  }
  
  if (userType !== allowedUserType) {
    return <AccessDenied userType={userType} />;
  }
  
  return children;
}

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [userData, setUserData] = useState(null);

  // Load user data from localStorage on component mount
  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }
  }, []);

  const handleLoginClick = () => {
    setShowLogin(true);
  };

  const handleLoginClose = () => {
    setShowLogin(false);
  };

  const handleLoginSuccess = (userData) => {
    setUserData(userData);
    // Store user data in localStorage
    localStorage.setItem('userData', JSON.stringify(userData));
    setShowLogin(false);
  };

  const handleLogout = () => {
    setUserData(null);
    // Remove user data from localStorage
    localStorage.removeItem('userData');
  };

  // Function to render content based on user type
  const renderContentBasedOnUserType = () => {
    if (!userData) {
      return (
        <div className="welcome-screen">
          <div className="welcome-content">
            <h1>Welcome to Voting System</h1>
            <p>Please login to continue</p>
            <button onClick={handleLoginClick} className="login-btn">
              Login
            </button>
          </div>
          <div className="welcome-image">
            <img src={welcomeImg} alt="Voting System" />
          </div>
        </div>
      );
    }

    return (
      <div className="main-content">
        <Routes>
          {/* Home page - accessible to all */}
          <Route path="/" element={<Home />} />
          
          {/* Voter-only pages */}
          <Route 
            path="/C_V_Card" 
            element={
              <ProtectedRoute userType={userData?.userType} allowedUserType="voter">
                <CVCard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/Voting_Section" 
            element={
              <ProtectedRoute userType={userData?.userType} allowedUserType="voter">
                <VotingSection />
              </ProtectedRoute>
            } 
          />
          
          {/* Candidate-only pages */}
          <Route 
            path="/C_V_Section" 
            element={
              <ProtectedRoute userType={userData?.userType} allowedUserType="candidate">
                <CVSection />
              </ProtectedRoute>
            } 
          />
          
          {/* Shared pages - accessible to both */}
          <Route path="/Final_Result" element={<FinalResult />} />
        </Routes>
      </div>
    );
  };

  return (
    <>
      <Login 
        isOpen={showLogin}  
        onClose={handleLoginClose}
        onLoginSuccess={handleLoginSuccess}
      />

      <Router>
        <div className="app-container">
          <Header 
            onLoginClick={handleLoginClick}
            onLogout={handleLogout}
            username={userData?.username || ""}
            userType={userData?.userType || ""}
          />
          {userData && <VerticalNavbar userType={userData.userType} />}
          {renderContentBasedOnUserType()}
        </div>
      </Router>
    </>
  );
}

export default App;