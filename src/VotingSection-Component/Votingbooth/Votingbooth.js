import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Votingbooth.css';

function Votingbooth({ userID }) {
  const [voters, setVoters] = useState([]);
  const [uid, setUid] = useState('');
  const [voter, setVoter] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [filteredCandidates, setFilteredCandidates] = useState([]);
  const [selectedCandidateId, setSelectedCandidateId] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showDetails, setShowDetails] = useState(null);
  const [collectedData, setCollectedData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5000/api/users/voter')
      .then(res => {
        // Handle the new API response structure
        if (res.data.success && Array.isArray(res.data.data)) {
          setVoters(res.data.data);
        } else if (Array.isArray(res.data)) {
          // Fallback for old API structure
          setVoters(res.data);
        } else {
          console.error('Invalid voter data structure:', res.data);
          setVoters([]);
        }
      })
      .catch(err => {
        console.error('Voter fetch error:', err);
        setError('Failed to load voter data. ' + err.message);
        setVoters([]);
      });

    axios.get('http://localhost:5000/api/users/candidate')
      .then(res => {
        let candidateData;
        // Handle the new API response structure
        if (res.data.success && Array.isArray(res.data.data)) {
          candidateData = res.data.data;
        } else if (Array.isArray(res.data)) {
          // Fallback for old API structure
          candidateData = res.data;
        } else {
          console.error('Invalid candidate data structure:', res.data);
          candidateData = [];
        }
        
        const candidatesWithIds = candidateData.map((candidate, index) => ({
          ...candidate,
          uniqueId: `candidate_${candidate.user_id}_${index}`
        }));
        setCandidates(candidatesWithIds);
      })
      .catch(err => {
        console.error('Candidate fetch error:', err);
        setCandidates([]);
      });
  }, []);

  useEffect(() => {
    if (userID && candidates.length > 0) {
      const filtered = candidates.filter(candidate =>
        candidate.Form_Id?.toString() === userID?.toString()
      );
      setFilteredCandidates(filtered);
    }
  }, [candidates, userID]);

  function back()
  {
    navigate('/Voting_Section')
  }

  const verifyVoter = () => {
    setError('');
    setSuccess('');
    setVoter(null);
    setIsLoading(true);

    const found = voters.find(v => v.user_id === uid.trim());

    if (found) {
      setVoter(found);
      setSuccess('Voter verified successfully.');
    } else {
      setError('Invalid UID. Voter not found.');
    }

    setIsLoading(false);
  };

  const handleVote = (id) => {
    if (!voter) {
      setError('Please verify your UID first');
      return;
    }
    setSelectedCandidateId(id);
  };

  const handleSubmit = () => {
    if (!voter) {
      setError('Please verify your UID first');
      return;
    }

    if (selectedCandidateId !== null) {
      const selectedCandidate = filteredCandidates.find(c => c.uniqueId === selectedCandidateId);
      
      // Store the collected data
      setCollectedData({
        candidateUid: selectedCandidate.Uid,
        voterId: voter.user_id,
        formId: userID,
        formTitle: filteredCandidates[0]?.Form_Title || 'Unknown Form',
        vote:1
      });

      setIsSubmitted(true);
    } else {
      alert("Please select a candidate before submitting!");
    }
  };

  async function handleBackToHome()
  {
    console.log('Collected Data:', collectedData);
    try {
      const res = await axios.post('http://localhost:5000/api/users/votingdata', collectedData, {
        headers: { 'Content-Type': 'application/json' },
      });
      alert(res.data.message || 'Upload successful');
    } catch (err) {
      console.error(err);
      alert('Upload failed');
    }
    setCollectedData(null)
    navigate('/'); // Redirect to home page
  };

  const toggleDetails = (id) => {
    setShowDetails(showDetails === id ? null : id);
  };

  if (isSubmitted) {
    const selectedCandidate = filteredCandidates.find(c => c.uniqueId === selectedCandidateId);
    return (
      <div className="voting-container">
        <div className="confirmation-screen">
          <div className="confirmation-icon">✓</div>
          <h2>Vote Submitted Successfully!</h2>
          {selectedCandidate && (
            <div className="selected-candidate">
              <img src={selectedCandidate.image} alt={selectedCandidate.fullName} />
              <h3>{selectedCandidate.fullName}</h3>
              <p>{selectedCandidate.email}</p>
            </div>
          )}
          <p className="thank-you">Thank you for participating.</p>
          <button className="submit-btn" onClick={handleBackToHome}>
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="voting-booth">
      <div>
            <button className="vote-button1" onClick={back}>back</button>
      </div>
      <header className="header">
        <h1 className="title">Voting Booth</h1>
        <div className="underline"></div>
      </header>

      <section className="verification-section">
        <div className="input-group">
          <input
            type="text"
            value={uid}
            onChange={(e) => setUid(e.target.value)}
            placeholder="Enter your UID"
            className="uid-input"
          />
          <button onClick={verifyVoter} className="verify-btn" disabled={isLoading}>
            {isLoading ? 'Verifying...' : 'Verify'}
          </button>
        </div>
        {error && <p className="error">{error}</p>}
        {voter && voter.full_name && <p className="voter-name">Verified: {voter.full_name}</p>}
        {success && <p className="success">{success}</p>}
      </section>

      {filteredCandidates.length > 0 ? (
        <div className="voting-container">
          <h2 className="voting-header">{filteredCandidates[0].Form_Title || 'Voting Booth'}</h2>
          <p className="voting-instructions">Select your preferred candidate and click "Submit Vote"</p>
          {!voter && <p className="error">Please verify your UID first to vote</p>}

          <div className="candidates-list">
            {filteredCandidates.map((candidate) => {
              const isSelected = selectedCandidateId === candidate.uniqueId;
              return (
                <div
                  key={candidate.uniqueId}
                  className={`candidate-card${isSelected ? ' selected-card' : ''}`}
                >
                  <img
                    src={candidate.image}
                    alt={candidate.fullName}
                    className="candidate-img"
                    onClick={() => voter && toggleDetails(candidate.uniqueId)}
                  />
                  <div className="candidate-info">
                    <h3>{candidate.fullName}</h3>
                    <p className="party-name">{candidate.email}</p>
                    <button
                      className="details-btn"
                      onClick={() => voter && toggleDetails(candidate.uniqueId)}
                      disabled={!voter}
                    >
                      {showDetails === candidate.uniqueId ? 'Hide Details' : 'Show Details'}
                    </button>

                    {showDetails === candidate.uniqueId && (
                      <div className="candidate-details">
                        <p>UID: {candidate.Uid}</p>
                      </div>
                    )}
                  </div>
                  <button
                    className={`vote-btn${isSelected ? ' selected' : ''}`}
                    onClick={() => handleVote(candidate.uniqueId)}
                    disabled={!voter || (selectedCandidateId && !isSelected)}
                  >
                    {isSelected ? '✓ Selected' : 'Vote'}
                  </button>
                </div>
              );
            })}
          </div>

          <div className="submit-section">
            {selectedCandidateId && (
              <div className="selection-preview">
                You've selected: <strong>{filteredCandidates.find(c => c.uniqueId === selectedCandidateId)?.fullName}</strong>
              </div>
            )}
            <button 
              className="submit-btn" 
              onClick={handleSubmit}
              disabled={!voter || !selectedCandidateId}
            >
              Submit Vote
            </button>
          </div>
        </div>
      ) : (
        <div className="no-candidates">
          <p>No candidates found for this election.</p>
        </div>
      )}
    </div>
  );
}

export default Votingbooth;