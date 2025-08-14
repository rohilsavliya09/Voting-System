import React, { useState } from 'react';
import './VotingDetails.css';

const VotingDetails = ({ votingData, voteCount, getCandidateName }) => {
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  const handleCandidateClick = (candidateUid) => {
    setSelectedCandidate(candidateUid);
  };

  return (
    <div className="voting-list-container">
      <h2>Voting Details</h2>
      <div className="candidate-selector">
        <h3>Select Candidate to View Votes:</h3>
        <div className="candidate-buttons">
          {Object.keys(voteCount).map(candidateUid => (
            <button 
              key={candidateUid} 
              onClick={() => handleCandidateClick(candidateUid)}
              className={selectedCandidate === candidateUid ? 'active' : ''}
              title={`UID: ${candidateUid}`}
            >
              {getCandidateName(candidateUid)}
            </button>
          ))}
        </div>
      </div>

      {selectedCandidate && (
        <div className="candidate-votes">
          <h3>
            Votes for {getCandidateName(selectedCandidate)} 
            <span className="candidate-uid"> (UID: {selectedCandidate})</span>
          </h3>
          <div className="votes-summary">
            <span>Total Votes: {voteCount[selectedCandidate]}</span>
          </div>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Voter ID</th>
                  <th>Form Title</th>
                  <th>Vote</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {votingData
                  .filter(item => item.candidateUid === selectedCandidate)
                  .map((item, index) => (
                    <tr key={index}>
                      <td>{item.voterId}</td>
                      <td>{item.formTitle}</td>
                      <td>{item.vote}</td>
                      <td>{new Date(item.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default VotingDetails;