import axios from 'axios';
import { useState } from 'react';
import Candidatecard from '../../CVSection-Component/Candidatecard/Candidatecard';
import CandidateForm from '../../CVSection-Component/CandidateForm/CandidateForm';
import VotingForm from '../../CVSection-Component/VotingForm/VotingForm';
import './CVSection.css';

function CVSection() {
  const [showVotingForm, setShowVotingForm] = useState(false);
  const [showCandidateForm, setShowCandidateForm] = useState(false);
  const [showCandidateCard, setShowCandidateCard] = useState(false);
  const [votingData, setVotingData] = useState(null);
  const [candidates, setCandidates] = useState([]);

  // Step 3 for set Voting Form
  function handleVotingSubmit(data) {
    setVotingData(data); // data in {}
    setShowVotingForm(false);
    // Step 1 for set Candidate Form
    setShowCandidateForm(true);
  }

  // Step 3 for set Candidate Form
  async function handleCandidateSubmit(data) // data in {}
  {
    try {
      const updatedCandidates = [...candidates, data];
      setCandidates(updatedCandidates);

      // send Voting title in Server
      await axios.post(
        'http://localhost:5000/api/users/candidate',
        data,
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (updatedCandidates.length >= votingData.numCandidates) {
        setShowCandidateForm(false);
        alert("All candidates submitted successfully!");
        console.log("All candidates:", updatedCandidates);
      }
    } catch (error) {
      console.error("Candidate submission failed:", error);
      alert("Failed to submit candidate. Please try again.");
    }
  }

  // Content switcher
  function renderContent()
  {
    // Step 2 for set Voting Form
    if (showVotingForm) {
      return <VotingForm onvotingformsubmit={handleVotingSubmit} />;
    }

    // Step 2 for set candidate form
    if (showCandidateForm) {
      return (
        <CandidateForm
          onCandidateSubmit={handleCandidateSubmit} // onCandidateSubmit Like a Function data lavse 
          currentCount={candidates.length + 1}
          totalCandidates={votingData.numCandidates}
          FormTitle={votingData.title}
          Formid={votingData.Uid}
        />
      );
    }

    if (showCandidateCard) {
      return (
        <Candidatecard
          onClose={() => setShowCandidateCard(false)} 
        />
      );
    }

    
    return (
      <div className="main-menu">
        <h1>Voting System</h1>

        {/* Step 1 For Set Voting Form */}
        <button className="menu-btn" onClick={() => setShowVotingForm(true)}>
          Create a Voting Section
        </button>
        <button className='menu-btn' onClick={() => setShowCandidateCard(true)}>
          Show Candidates Card
        </button>
      </div>
    );
  }

  return <div className="app">{renderContent()}</div>;
}

export default CVSection;
