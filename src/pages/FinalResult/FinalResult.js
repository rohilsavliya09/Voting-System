import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import VoteSummary from '../../FinalResult-Component/VoteSummary/VoteSummary';
import VotingGraph from '../../FinalResult-Component/VotingGraph/VotingGraph';
import ElectionWinner from '../../FinalResult-Component/ElectionWinner/ElectionWinner';
import VotingDetails from '../../FinalResult-Component/VotingDetails/VotingDetails';
import './FinalResult.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const FinalResult = () => {
  const [votingData, setVotingData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [voteCount, setVoteCount] = useState({});
  const [winner, setWinner] = useState(null);
  const [searchUID, setSearchUID] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [notFound, setNotFound] = useState(false);
  const [view, setView] = useState('');
  const [candidates, setCandidates] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [votingRes, candidatesRes] = await Promise.all([
          axios.get('http://localhost:5000/api/users/votingdata'),
          axios.get('http://localhost:5000/api/users/candidate')
        ]);
        
        // Handle the new API response structure for voting data
        let votingData;
        if (votingRes.data.success && Array.isArray(votingRes.data.data)) {
          votingData = votingRes.data.data;
        } else if (Array.isArray(votingRes.data)) {
          votingData = votingRes.data;
        } else {
          console.error('Invalid voting data structure:', votingRes.data);
          votingData = [];
        }
        
        let candidateData;
        if (candidatesRes.data.success && Array.isArray(candidatesRes.data.data)) {
          candidateData = candidatesRes.data.data;
        } else if (Array.isArray(candidatesRes.data)) {
          candidateData = candidatesRes.data;
        } else {
          console.error('Invalid candidate data structure:', candidatesRes.data);
          candidateData = [];
        }
        
        setVotingData(votingData);
        setCandidates(candidateData);
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Failed to load data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Function to get candidate name by UID
  const getCandidateName = (uid) => {
    const candidate = candidates.find(c => c.Uid === uid);
    return candidate ? candidate.fullName : `Candidate (${uid})`;
  };

  // Function to get candidate details by UID
  const getCandidateDetails = (uid) => {
    return candidates.find(c => c.Uid === uid) || { fullName: `Candidate ${uid}` };
  };

  const calculateVoteCount = (data) => {
    const count = {};
    data.forEach(item => {
      if (item.vote) {
        count[item.candidateUid] = (count[item.candidateUid] || 0) + item.vote;
      }
    });
    setVoteCount(count);

    let maxVotes = 0;
    let winningCandidate = null;
    for (const candidate in count) {
      if (count[candidate] > maxVotes) {
        maxVotes = count[candidate];
        winningCandidate = candidate;
      }
    }
    
    if (winningCandidate) {
      const winnerDetails = getCandidateDetails(winningCandidate);
      setWinner({ 
        candidateUid: winningCandidate, 
        candidateName: winnerDetails.fullName,
        candidateImage: winnerDetails.image,
        totalVotes: maxVotes,
        formTitle: data[0]?.formTitle || ''
      });
    } else {
      setWinner(null);
    }
  };

  const handleFilterByUID = () => {
    const uid = searchUID.trim();
    if (!uid) return;

    const filtered = votingData.filter(item => item.formId === uid);
    if (filtered.length > 0) {
      setFilteredData(filtered);
      setFormTitle(filtered[0].formTitle || '');
      calculateVoteCount(filtered);
      setNotFound(false);
    } else {
      setFilteredData([]);
      setFormTitle('');
      setVoteCount({});
      setWinner(null);
      setNotFound(true);
    }
    setView(''); // reset view
  };

  // Prepare chart data with candidate names
  const chartData = {
    labels: Object.keys(voteCount).map(uid => getCandidateName(uid)),
    datasets: [
      {
        label: 'Votes',
        data: Object.values(voteCount),
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Voting Results by Candidate' },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    }
  };

  if (isLoading) {
    return <div className="loading-container">Loading election data...</div>;
  }

  if (error) {
    return <div className="error-container">{error}</div>;
  }

  return (
    <div className="final-result-container">
      <header className="result-header">
        <h1>Election Results Dashboard</h1>
        <p className="subtitle">View and analyze election results in real-time</p>
      </header>

      <div className="search-section">
        <div className="uid-input-section">
          <input
            type="text"
            placeholder="Enter Form ID to search"
            value={searchUID}
            onChange={(e) => setSearchUID(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleFilterByUID()}
          />
          <button onClick={handleFilterByUID} className="search-button">
            Search
          </button>
        </div>

        {formTitle && (
          <div className="form-info">
            <h3>
              <span className="info-label">Form Title:</span>
              <span className="info-value">{formTitle}</span>
            </h3>
          </div>
        )}

        {notFound && (
          <div className="error-message">
            <p>Form ID not found! Please check the ID and try again.</p>
          </div>
        )}
      </div>

      {filteredData.length > 0 && (
        <div className="results-content">
          <div className="action-buttons">
            <button 
              onClick={() => setView('graph')} 
              className={view === 'graph' ? 'active' : ''}
            >
              Results Graph
            </button>
            <button 
              onClick={() => setView('winner')} 
              className={view === 'winner' ? 'active' : ''}
            >
              Election Winner
            </button>
            <button 
              onClick={() => setView('details')} 
              className={view === 'details' ? 'active' : ''}
            >
              Voting Details
            </button>
          </div>

          <VoteSummary 
            voteCount={voteCount} 
            getCandidateName={getCandidateName} 
            candidates={candidates}
          />

          {view === 'graph' && (
            <VotingGraph 
              chartData={chartData} 
              chartOptions={chartOptions} 
              getCandidateName={getCandidateName}
            />
          )}
          
          {view === 'winner' && winner && (
            <ElectionWinner 
              winner={winner} 
              getCandidateName={getCandidateName}
            />
          )}
          
          {view === 'details' && (
            <VotingDetails 
              votingData={filteredData} 
              voteCount={voteCount} 
              getCandidateName={getCandidateName}
              candidates={candidates}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default FinalResult;