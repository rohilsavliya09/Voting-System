

import React from 'react';
import './ElectionWinner.css';

function ElectionWinner({ winner, getCandidateName }){
  const winnerName = getCandidateName(winner.candidateUid);

  return (
    <div className="winner-container">
      <h2>🏆 Election Winner 🏆</h2>
      <div className="winner-card">
        <div className="winner-info">
          <p className="winner-name">
            <strong>Winner:</strong> {winnerName}
          </p>
          <p className="winner-uid">
            <strong>Candidate ID:</strong> {winner.candidateUid}
          </p>
          <p className="winner-votes">
            <strong>Total Votes:</strong> {winner.totalVotes}
          </p>
        </div>
        <p className="congrats">🎉 Congratulations! 🎉</p>
      </div>
    </div>
  );
};

export default ElectionWinner;