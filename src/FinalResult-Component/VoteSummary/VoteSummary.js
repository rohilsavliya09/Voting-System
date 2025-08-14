import React from 'react';
import './VoteSummary.css';

const VoteSummary = ({ voteCount, getCandidateName }) => {
  return (
    <div className="vote-summary">
      <h2>Vote Summary</h2>
      <table>
        <thead>
          <tr>
            <th>Candidate Name</th>
            <th>Candidate UID</th>
            <th>Total Votes</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(voteCount).map(([candidateUid, totalVotes]) => (
            <tr key={candidateUid}>
              <td>{getCandidateName(candidateUid)}</td>
              <td>{candidateUid}</td>
              <td>{totalVotes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VoteSummary;