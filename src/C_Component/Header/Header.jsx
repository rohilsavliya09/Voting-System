// Navbar.js
import { useState } from 'react';
import './Header.css'
function Navbar({ onLoginClick, username, userType, onLogout }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogin = () => {
    setDropdownOpen(false);
    onLoginClick();
  };

  const handleLogout = () => {
    setDropdownOpen(false);
    onLogout();
  };

  // Get first letter of username (uppercase) or show default icon
  const userInitial = username ? username.trim().charAt(0).toUpperCase() : "👤";

  return (
    <div className="top-navbar">
      <div className="spacer"></div>

      <div className="navbar-brand">Voting System</div>

      <div className="user-profile" onClick={toggleDropdown}>
        <div className="user-avatar">{userInitial}</div>

        {dropdownOpen && (
          <div className="profile-dropdown">
            {username ? (
              <>
                <div className="dropdown-user-info">
                  Logged in as&nbsp;:&nbsp; {username} &nbsp;
                  <div className="user-type-badge">
                    {userType === 'voter' ? ' 🗳️ Voter' : ' 👤 Candidate'}
                  </div>
                </div>
                <div className="dropdown-item" onClick={handleLogout}>
                  Logout
                </div>
              </>
            ) : (
              <div className="dropdown-item" onClick={handleLogin}>
                Login
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Navbar;