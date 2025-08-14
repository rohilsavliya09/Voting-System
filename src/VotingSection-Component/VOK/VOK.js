import axios from 'axios';
import { useEffect, useState } from 'react';
import './VOK.css';


function VOK({fetchuid}) {
  const [formData, setFormData] = useState([]);
  const [candidateData, setCandidateData] = useState([]);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/api/users/formdata')
      .then(res => {
        console.log("Form Data:", res.data);
        // Handle the new API response structure
        if (res.data.success && Array.isArray(res.data.data)) {
          setFormData(res.data.data);
        } else if (Array.isArray(res.data)) {
          // Fallback for old API structure
          setFormData(res.data);
        } else {
          console.error('Invalid form data structure:', res.data);
          setFormData([]);
        }
      })
      .catch(err => {
        console.error('Formdata fetch error:', err);
        setFormData([]);
      });
  }, []);

  useEffect(() => {
    axios.get('http://localhost:5000/api/users/candidate')
      .then(res => {
        console.log("Candidate Data:", res.data);
        // Handle the new API response structure
        if (res.data.success && Array.isArray(res.data.data)) {
          setCandidateData(res.data.data);
        } else if (Array.isArray(res.data)) {
          // Fallback for old API structure
          setCandidateData(res.data);
        } else {
          console.error('Invalid candidate data structure:', res.data);
          setCandidateData([]);
        }
      })
      .catch(err => {
        console.error('Candidate fetch error:', err);
        setCandidateData([]);
      });
  }, []);
  
  // Filtered data based on search
  const filteredForms = formData.filter(form =>
    form.title?.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="voting-container">
      
      <h1 className="voting-title">Voting Dashboard</h1>
      
      {/* 🔍 Search Box */}
      <div className="search-container">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search elections by title..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
      </div>

      {/* 📋 Voting Cards */}
      {filteredForms.length === 0 ? (
        <p className="no-results">No elections found matching your search.</p>
      ) : (
        <div className="cards-container">
          {filteredForms.map((form, index) => {
            const matchingCandidates = candidateData.filter(candidate =>
              candidate.Form_Id?.toString() === form.Uid?.toString()
            );

            return (
              <div className="voting-card" key={index}>
                <div className="card-header">
                  <h3 className="election-title">{form.title}</h3>
                  <span className="election-status">Active</span>
                </div>

                <div className="card-content">
                  <div className="candidates-grid">
                    {matchingCandidates.length > 0 ? (
                      matchingCandidates.map((candidate, idx) => (
                        <div className="candidate" key={idx}>
                          {idx + 1}. {candidate.fullName}
                        </div>
                      ))
                    ) : (
                      <div className="no-candidates">No candidates found</div>
                    )}
                  </div>
                </div>

                <div className="card-footer">
                  <div className="deadline">
                    Voting ends: {new Date(form.expiryDate).toLocaleDateString()}
                  </div>
                  <div>
                    Form Uid : {form.Uid}
                  </div>
                  <button className="vote-button" onClick={()=>fetchuid(form.Uid)}>Vote Now</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default VOK;