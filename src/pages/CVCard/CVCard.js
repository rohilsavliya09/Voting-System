import { useState, useEffect } from 'react';
import axios from 'axios';
import CreateCardPage from '../../CVCard-Component/CreateCardPage/CreateCardPage';
import ShowCardsPage from '../../CVCard-Component/ShowCardsPage/ShowCardsPage';


function CVCard() {
  const [showCreateCard, setShowCreateCard] = useState(false);
  const [showCards, setShowCards] = useState(false);
  const [voters, setVoters] = useState([]);

  useEffect(() => {
    if (showCards) {
      fetchVoters();
    }
  }, [showCards]);

  async function fetchVoters() {
    try {
      const response = await axios.get('http://localhost:5000/api/users/voter');
      // Handle the new API response structure
      if (response.data.success && Array.isArray(response.data.data)) {
        setVoters(response.data.data);
      } else if (Array.isArray(response.data)) {
        // Fallback for old API structure
        setVoters(response.data);
      } else {
        console.error('Invalid voter data structure:', response.data);
        setVoters([]);
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setVoters([]);
    }
  }

  async function handleCreateCardSubmit(data) {
    try {
      const updatedVoters = [...voters, data];
      setVoters(updatedVoters);
      
      const response = await axios.post('http://localhost:5000/api/users/voter', data, {
        headers: { 'Content-Type': 'application/json' },
      });
      
      setShowCreateCard(false);
      alert(response.data.message || "Card created successfully!");
    } catch (error) {
      console.error("Submission failed:", error);
      if (error.response && error.response.data && error.response.data.message) {
        alert(error.response.data.message);
      } else {
        alert("Failed to create card. Please try again.");
      }
    }
  }

  function renderContent() {
    if (showCreateCard) {
      return <CreateCardPage 
               onCreateCardSubmit={handleCreateCardSubmit} 
               onClose={() => setShowCreateCard(false)} 
             />;
    }

    if (showCards) {
      return <ShowCardsPage 
               voters={voters} 
               onClose={() => setShowCards(false)} 
             />;
    }

    return (
      <div className="main-menu">
        <h1>Card Management System</h1>
        <button className="menu-btn" onClick={() => setShowCreateCard(true)}>
          Create a New Card
        </button>
        <button className="menu-btn" onClick={() => setShowCards(true)}>
          Show All Cards
        </button>
      </div>
    );
  }

  return <div className="app">{renderContent()}</div>;
}

export default CVCard;