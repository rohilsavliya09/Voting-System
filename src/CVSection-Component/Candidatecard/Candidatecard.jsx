import axios from 'axios';
import { useEffect, useState } from 'react';
import {
  FaBirthdayCake,
  FaEnvelope,
  FaHome,
  FaIdCard,
  FaPhone
} from 'react-icons/fa';
import { IoSearch } from 'react-icons/io5';
import './Candidatecard.css';

function Candidatecard({ onClose }) {
  const [candidates, setCandidates] = useState([]);
  const [query, setQuery] = useState('');
  const [filterOption, setFilterOption] = useState('All');
  const [userInput, setUserInput] = useState('');

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/users/candidate')
      .then(res => {
        console.log("API raw data:", res.data);

        // If API returns array directly
        if (Array.isArray(res.data)) {
          setCandidates(res.data);
        }
        // If API returns { data: [...] }
        else if (Array.isArray(res.data.data)) {
          setCandidates(res.data.data);
        }
        else {
          console.error("Unexpected API format:", res.data);
          setCandidates([]);
        }
      })
      .catch(err => {
        console.error('Fetch error:', err);
        setCandidates([]);
      });
  }, []);

  const handleSearchChange = (e) => {
    setQuery(e.target.value);
  };

  const handleFilterOptionChange = (e) => {
    setFilterOption(e.target.value);
    setUserInput('');
  };

  const handleUserInputChange = (e) => {
    setUserInput(e.target.value);
  };

  // Step 1: Start with safe array
  let filteredCandidates = Array.isArray(candidates) ? [...candidates] : [];

  // Step 2: User input filter
  if (filterOption === 'UserInput' && userInput.trim() !== '') {
    const inputLower = userInput.toLowerCase();
    filteredCandidates = filteredCandidates.filter(c =>
      (c.Form_Title && c.Form_Title.toLowerCase().includes(inputLower)) ||
      (c.Form_Id && c.Form_Id.toLowerCase().includes(inputLower))
    );
  }

  // Step 3: Search query filter
  if (query.trim() !== '') {
    filteredCandidates = filteredCandidates.filter(candidate =>
      (candidate.fullName || '').toLowerCase().includes(query.toLowerCase()) ||
      (candidate.Uid || '').toLowerCase().includes(query.toLowerCase())
    );
  }

  console.log("Filtered candidates:", filteredCandidates);

  return (
    <>
      <button className="back-btn" onClick={onClose}>Back</button>
      <br /><br /><br />
      <div className="card-header-strip" />

      <div className="searchbar-container" style={{
        padding: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        flexWrap: 'wrap'
      }}>
        <IoSearch className="search-icon" />
        <input
          type="text"
          placeholder="Search by name or UID"
          value={query}
          onChange={handleSearchChange}
          className="search-input"
          style={{ flex: 1, minWidth: '180px' }}
        />

        <select
          value={filterOption}
          onChange={handleFilterOptionChange}
          className="form-filter-dropdown"
          style={{ padding: '6px 10px', fontSize: '16px' }}
        >
          <option value="All">All</option>
          <option value="UserInput">User Input</option>
        </select>

        {filterOption === 'UserInput' && (
          <input
            type="text"
            placeholder="Enter Form_Title or Form_Id"
            value={userInput}
            onChange={handleUserInputChange}
            className="user-input-filter"
            style={{
              padding: '6px 10px',
              fontSize: '16px',
              borderRadius: '6px',
              border: '1px solid #ccc',
              minWidth: '180px'
            }}
          />
        )}
      </div>

      <div className="cards-gridx">
        {Array.isArray(filteredCandidates) && filteredCandidates.length > 0 ? (
          filteredCandidates.map(candidate => (
            <div key={candidate._id} className="modern-candidate-card">
              <div className="card-content">
                <div className="candidate-name-section">
                  <h2>{candidate.fullName || "No Name"}</h2>
                  <div className="candidate-label">Candidate</div>
                </div>

                <div className="voter-icon-container">
                  <img
                    src={candidate.voterIcon || '/default-icon.png'}
                    alt="Voter Symbol"
                    className="voter-icon-round"
                  />
                </div>
              </div>

              <div className="candidate-photo-container">
                <img
                  src={candidate.image || '/default-avatar.png'}
                  alt={candidate.fullName || "Candidate"}
                  className="candidate-photo"
                />
              </div>

              <div className="candidate-details">
                <div className="detail-row">
                  <FaBirthdayCake className="detail-icon" />
                  <div>
                    <span className="detail-label">Birth Date</span>
                    <span className="detail-value">
                      {candidate.birthDate
                        ? new Date(candidate.birthDate).toLocaleDateString()
                        : 'N/A'}
                    </span>
                  </div>
                </div>

                <div className="detail-row">
                  <FaEnvelope className="detail-icon" />
                  <div>
                    <span className="detail-label">Email</span>
                    <span className="detail-value email-value">
                      {candidate.email || 'N/A'}
                    </span>
                  </div>
                </div>

                <div className="detail-row">
                  <FaPhone className="detail-icon" />
                  <div>
                    <span className="detail-label">Mobile</span>
                    <span className="detail-value">{candidate.mobile || 'N/A'}</span>
                  </div>
                </div>

                <div className="detail-row">
                  <FaHome className="detail-icon" />
                  <div>
                    <span className="detail-label">Address</span>
                    <span className="detail-value address-value">
                      {candidate.address || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="card-footer">
                <FaIdCard className="uid-icon" />
                <span className="uid-value">{candidate.Uid || 'N/A'}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="no-cards">No Candidate Records Found</div>
        )}
      </div>
    </>
  );
}

export default Candidatecard;
