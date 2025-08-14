import { useState } from 'react';
import { FaCalendarAlt } from 'react-icons/fa';
import { IoSearch } from 'react-icons/io5';
import './ShowCardsPage.css';

function ShowCardsPage({ voters, onClose }) {
  const [query, setQuery] = useState('');

  const handleSearchBar = (e) => {
    setQuery(e.target.value);
  };

  const filteredVoters = voters.filter(voter =>
    (voter.full_name || '').toLowerCase().includes(query.toLowerCase()) ||
    (voter.user_id || '').toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="show-cards-page">
        <button className="back-btn" onClick={onClose}>Back</button>
      <div className="page-header">
        <h2>Voter Identity Cards</h2>
      </div>

      <div className="searchbar-container">
        <IoSearch className="search-icon" />
        <input
          type="text"
          placeholder="Search by name"
          value={query}
          onChange={handleSearchBar}
          className="search-input"
        />
      </div>

      <div className="cards-grid">
        {filteredVoters.length > 0 ? (
          filteredVoters.map(voter => (
            <div key={voter._id} className="voting-card">
              <div className="card-header">
                <h2>Voter ID Card</h2>
                <div className="id-section">
                  <span className="card-id">Voter ID: {voter.user_id}</span>
                </div>
              </div>

              <div className="card-body">
                <div className="photo-section">
                  <img
                    src={voter.image || '/default-avatar.png'}
                    alt={voter.full_name}
                    className="voter-photo"
                  />
                  <div className="photo-label">Official Photo</div>
                </div>

                <div className="details-section">
                  <div className="detail-row">
                    <span className="label">Name:</span>
                    <span className="value">{voter.full_name}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Email:</span>
                    <span className="value email-value">{voter.email}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Phone:</span>
                    <span className="value">{voter.phone_number}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Age:</span>
                    <span className="value">{voter.age}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Address:</span>
                    <span className="value address-value">{voter.address}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Birthdate:</span>
                    <span className="value">{new Date(voter.birthdate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="card-footer">
                <div className="expiry-date">
                  <FaCalendarAlt className="expiry-icon" />
                  <span className="expiry-label">Valid Until:</span>
                  <span className="expiry-value">31-Dec-2025</span>
                </div>
                <div className="official-stamp">
                  <span className="stamp-placeholder">OFFICIAL</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-cards">No Voter Records Found</div>
        )}
      </div>
    </div>
  );
}

export default ShowCardsPage;