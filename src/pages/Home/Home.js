import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import img from '../../Gallary/vote.webp'
const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Your Vote Matters</h1>
          <p>Secure, transparent, and accessible online voting platform</p>
          <div className="cta-buttons">
            <button onClick={() => navigate('/select-role')} className="primary-btn">
              Voting Section 
            </button>
            <button onClick={() => navigate('/results')} className="secondary-btn">
              Result Section
            </button>
          </div>
        </div>
       
      </section>

      {/* How It Works Section */}
      <section className="process-section">
        <h2>How Our Voting System Works</h2>
        <div className="process-steps">
          <div className="process-step">
            <div className="step-number">1</div>
            <div className="step-content">
              <h3>Role Selection</h3>
              <p>Users select whether they are registering as a <strong>Voter</strong> or <strong>Candidate</strong></p>
            </div>
          </div>
          <div className="process-step">
            <div className="step-number">2</div>
            <div className="step-content">
              <h3>Voter Registration</h3>
              <p>Voters provide their personal details to generate a secure <strong>Voter ID Card</strong> with unique identification</p>
            </div>
          </div>
          <div className="process-step">
            <div className="step-number">3</div>
            <div className="step-content">
              <h3>Voter Database</h3>
              <p>All voter cards are stored in a central system searchable by <strong>Unique ID</strong> for verification</p>
            </div>
          </div>
          <div className="process-step">
            <div className="step-number">4</div>
            <div className="step-content">
              <h3>Candidate Registration</h3>
              <p>Candidates fill forms with election details including <strong>Voting Title</strong> and <strong>Number of Candidates</strong></p>
            </div>
          </div>
          <div className="process-step">
            <div className="step-number">5</div>
            <div className="step-content">
              <h3>Candidate Database</h3>
              <p>Each candidate receives a <strong>Campaign Card</strong> stored in the system with their unique election ID</p>
            </div>
          </div>
          <div className="process-step">
            <div className="step-number">6</div>
            <div className="step-content">
              <h3>Voting Process</h3>
              <p>Voters enter specific <strong>Voting UID</strong>, verify their identity, and cast their ballot securely</p>
            </div>
          </div>
          <div className="process-step">
            <div className="step-number">7</div>
            <div className="step-content">
              <h3>Results & Analytics</h3>
              <p>After voting ends, results are displayed with <strong>Winner Declaration</strong> and detailed vote breakdown graphs</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2>Why Choose Our Voting System?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>Secure Voting</h3>
            <p>Blockchain-powered encryption ensures your vote remains anonymous and tamper-proof</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📱</div>
            <h3>Mobile Friendly</h3>
            <p>Vote from anywhere using your smartphone, tablet, or computer</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⏱️</div>
            <h3>Real-time Results</h3>
            <p>See live updates as votes are counted with our transparent system</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Detailed Analytics</h3>
            <p>Comprehensive reports and visualizations of voting patterns</p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-list">
          <div className="faq-item">
            <h3>How do I register to vote?</h3>
            <p>Click on Get Started, select "Voter" role, and complete the simple verification process.</p>
          </div>
          <div className="faq-item">
            <h3>Is my vote anonymous?</h3>
            <p>Yes, we use advanced encryption to ensure complete voter privacy.</p>
          </div>
          <div className="faq-item">
            <h3>Can I change my vote?</h3>
            <p>You can change your vote anytime before the election deadline.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>© 2025 SecureVote Platform. All rights reserved.</p>
        <div className="footer-links">
          <a href="/privacy">Privacy Policy</a>
          <a href="/terms">Terms of Service</a>
          <a href="/contact">Contact Us</a>
        </div>
      </footer>
    </div>
  );
};

export default Home;