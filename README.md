# Voting System

A modern, secure online voting platform with role-based access control.

## Features

### User Types
- **Voter**: Can access voter-specific features and participate in elections
- **Candidate**: Can access candidate-specific features and manage their profile

### Key Features
- Role-based login system (Voter/Candidate)
- Secure authentication with user type selection
- Access control for different pages based on user role
- Beautiful access denied messages for unauthorized access
- Responsive design
- Real-time voting interface
- Election result visualization

## How to Use

### For Voters
1. Login with "Voter" user type
2. Access voter-specific pages:
   - **C_V_Card**: View and manage voter cards
   - **Voting Section**: Participate in elections
   - **Final Result**: View election results
3. Home page is accessible to all users

### For Candidates
1. Login with "Candidate" user type
2. Access candidate-specific pages:
   - **C_V_Section**: Manage candidate profiles and elections
   - **Final Result**: View election results
3. Home page is accessible to all users

## Access Control System

### Voter Access
- ✅ **Home**: Accessible
- ✅ **C_V_Card**: Accessible
- ✅ **Voting Section**: Accessible
- ✅ **Final Result**: Accessible
- ❌ **C_V_Section**: Access Denied (Candidate only)

### Candidate Access
- ✅ **Home**: Accessible
- ✅ **C_V_Section**: Accessible
- ✅ **Final Result**: Accessible
- ❌ **C_V_Card**: Access Denied (Voter only)
- ❌ **Voting Section**: Access Denied (Voter only)

### Access Denied Messages
- **Voters** trying to access candidate pages: "You are a voter. You do not have rights for candidate features."
- **Candidates** trying to access voter pages: "You are a candidate. You do not have rights for voter features."

## Login System

The login form includes:
- Email and password fields
- **User Type Selection**: Choose between "Voter" or "Candidate"
- Registration and login functionality

### Navigation
- **Voters** see: Home, C_V_Card, Voting Section, Final Result
- **Candidates** see: Home, C_V_Section, Final Result

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Technology Stack

- React.js
- CSS3
- HTML5
- JavaScript ES6+

## Project Structure

```
src/
├── components/
│   ├── AccessDenied.jsx      # Access denied component
│   └── AccessDenied.css      # Access denied styles
├── core-component/
│   └── Login/                # Login component with user type selection
├── C_Component/
│   ├── Header/               # Header with user type display
│   └── Side-Heaeder/         # Role-based navigation sidebar
├── pages/
│   ├── Home/                 # Original home page (accessible to all)
│   ├── VotingSection/        # Voting interface (voters only)
│   └── CVSection/            # Candidate management (candidates only)
└── App.js                    # Main app with protected routes
```

## User Experience

1. **Home Page**: Original design accessible to all users
2. **Login Form**: Includes email, password, and user type selection
3. **Role-Based Navigation**: Different sidebar options based on user type
4. **Access Control**: Protected routes with access denied messages
5. **User Profile**: Shows username and user type in header

## Security Features

- **Protected Routes**: Components wrapped with access control
- **Role-Based Navigation**: Only relevant links shown
- **Access Denied Messages**: Clear feedback for unauthorized access
- **Persistent Login**: User session maintained across browser sessions

The system now provides complete role-based access control where users can only access features appropriate to their user type, with clear feedback when trying to access unauthorized areas.
