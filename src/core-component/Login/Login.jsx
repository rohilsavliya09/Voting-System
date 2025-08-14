import { useState } from 'react';
import { IoClose, IoLockClosed, IoMail, IoPerson } from 'react-icons/io5';
import './Login.css'; 

function Login({ isOpen, onClose, onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [data, setData] = useState({
    username: '',
    email: '',
    password: '',
    userType: 'voter' 
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const endpoint = isLogin
        ? 'http://localhost:5000/api/users/login'
        : 'http://localhost:5000/api/users/register';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: data.username,
          email: data.email,
          password: data.password,
          userType: data.userType
        })
      });

      const result = await response.json();
      if (response.ok) {
        alert(result.message);
        if (isLogin) {
          onLoginSuccess({
            username: result.user.UserName,
            email: result.user.Email,
            userType: data.userType
          });
          onClose();
        } else {
          setIsLogin(true); 
        }
        setData({ username: '', email: '', password: '', userType: 'voter' });
      } else {
        setError(result.error || result.message);
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
      console.error("Login error:", err);
    }
  };

  return (
    <div className={`auth-wrapper ${isOpen ? 'active-popup' : ''}`}>
      <div className={`auth-form-box ${isLogin ? 'login' : 'register'}`}>
        <span className="auth-close-btn" onClick={onClose}>
          <IoClose />
        </span>

        {error && <div className="auth-error">{error}</div>}

        {isLogin ? (
          <div className="auth-login-form">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
              <div className="auth-input-box">
                <span className="auth-icon"><IoMail /></span>
                <input 
                  type="email" 
                  name="email" 
                  required 
                  value={data.email} 
                  onChange={handleChange} 
                />
                <label>Email</label>
              </div>

              <div className="auth-input-box">
                <span className="auth-icon"><IoLockClosed /></span>
                <input 
                  type="password" 
                  name="password" 
                  required 
                  value={data.password} 
                  onChange={handleChange} 
                />
                <label>Password</label>
              </div>

              <div className="auth-input-box">
                <span className="auth-icon"><IoPerson /></span>
                <select 
                  name="userType" 
                  value={data.userType} 
                  onChange={handleChange}
                  className="auth-select"
                >
                  <option value="voter">Voter</option>
                  <option value="candidate">Candidate</option>
                </select>
                <label>User Type</label>
              </div>

              <button type="submit" className="auth-btn">Login</button>

              <div className="auth-login-register">
                <p>
                  Don't have an account?{' '}
                  <a 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      setIsLogin(false);
                      setError('');
                    }} 
                    className="auth-register-link"
                  >
                    Register
                  </a>
                </p>
              </div>
            </form>
          </div>
        ) : (
          <div className="auth-register-form">
            <h2>Registration</h2>
            <form onSubmit={handleSubmit}>
              <div className="auth-input-box">
                <span className="auth-icon"><IoPerson /></span>
                <input 
                  type="text" 
                  name="username" 
                  required 
                  value={data.username} 
                  onChange={handleChange} 
                />
                <label>Username</label>
              </div>

              <div className="auth-input-box">
                <span className="auth-icon"><IoMail /></span>
                <input 
                  type="email" 
                  name="email" 
                  required 
                  value={data.email} 
                  onChange={handleChange} 
                />
                <label>Email</label>
              </div>

              <div className="auth-input-box">
                <span className="auth-icon"><IoLockClosed /></span>
                <input 
                  type="password" 
                  name="password" 
                  required 
                  value={data.password} 
                  onChange={handleChange} 
                />
                <label>Password</label>
              </div>

              <div className="auth-input-box">
                <span className="auth-icon"><IoPerson /></span>
                <select 
                  name="userType" 
                  value={data.userType} 
                  onChange={handleChange}
                  className="auth-select"
                >
                  <option value="voter">Voter</option>
                  <option value="candidate">Candidate</option>
                </select>
                <label>User Type</label>
              </div>

              <button type="submit" className="auth-btn">Register</button>

              <div className="auth-login-register">
                <p>
                  Already have an account?{' '}
                  <a 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      setIsLogin(true);
                      setError('');
                    }} 
                    className="auth-login-link"
                  >
                    Login
                  </a>
                </p>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;