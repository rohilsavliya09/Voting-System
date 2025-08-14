import { NavLink } from 'react-router-dom';
import './VerticalNavbar.css';

function VerticalNavbar({ userType }){
  return (
    <nav className="side-navbar">
      <ul>
        <li>
          <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Home
          </NavLink>
        </li>
        
        {/* Voter-only navigation */}
        {userType === 'voter' && (
          <>
            <li>
              <NavLink to="/C_V_Card" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                C_V_Card
              </NavLink>
            </li>
            <li>
              <NavLink to="/Voting_Section" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                Voting Section
              </NavLink>
            </li>
          </>
        )}
        
        {/* Candidate-only navigation */}
        {userType === 'candidate' && (
          <li>
            <NavLink to="/C_V_Section" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              C_V_Section
            </NavLink>
          </li>
        )}
        
        {/* Shared navigation */}
        <li>
          <NavLink to="/Final_Result" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Final Result
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default VerticalNavbar;