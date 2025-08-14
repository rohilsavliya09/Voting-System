import axios from 'axios';
import { useState } from 'react';

function GenerateUID()
{
  return Math.random().toString(36).substring(2, 16).toUpperCase();
}

function VotingForm({ onvotingformsubmit }) {
  const [formData, setFormData] = useState({
    title: '',
    numCandidates: 1,
    expiryDate: '',
    Uid: GenerateUID(),
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(e)
  {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    validateField(name, value);
  }

  function validateField(name, value) {
    let fieldError = '';
    
    switch (name) {
      case 'title':
        if (!value.trim()) {
          fieldError = 'Voting title is required';
        } else if (value.trim().length < 3) {
          fieldError = 'Voting title must be at least 3 characters long';
        } else if (value.trim().length > 100) {
          fieldError = 'Voting title cannot exceed 100 characters';
        } else if (!/^[a-zA-Z0-9\s\-_]+$/.test(value.trim())) {
          fieldError = 'Voting title can only contain letters, numbers, spaces, hyphens, and underscores';
        }
        break;
        
      case 'numCandidates':
        const num = parseInt(value);
        if (isNaN(num) || num < 2) {
          fieldError = 'At least 2 candidates are required';
        } else if (num > 20) {
          fieldError = 'Maximum 20 candidates allowed';
        }
        break;
        
      case 'expiryDate':
        if (!value) {
          fieldError = 'Expiry date is required';
        } else {
          const selectedDate = new Date(value);
          const today = new Date();
          today.setHours(0, 0, 0, 0); 
          
          if (selectedDate <= today) {
            fieldError = 'Expiry date must be in the future';
          }
        }
        break;
    }
    
    if (fieldError) {
      setErrors(prev => ({ ...prev, [name]: fieldError }));
    } else {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  }

  function validateForm() {
    validateField('title', formData.title);
    validateField('numCandidates', formData.numCandidates);
    validateField('expiryDate', formData.expiryDate);
    
    const hasErrors = Object.values(errors).some(error => error !== '');
    
    return !hasErrors;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    if (!validateForm()) {
      alert('Please insert Corrcet value');
      return;
    }
    
    if (!formData.title.trim() || !formData.expiryDate) {
      alert('Please fill all required fields');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      onvotingformsubmit(formData);

      const res = await axios.post('http://localhost:5000/api/users/formdata',
        formData,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
      alert(res?.data?.message || 'Upload successful');
    } catch (error) {
      alert(error?.response?.data?.message || 'Upload Error');
    } finally {
      setIsSubmitting(false);
    }

    setFormData({
      title: '',
      numCandidates: 1,
      expiryDate: '',
      Uid: GenerateUID(),
    });
    setErrors({});
  };

  return (
    <div className="form-container">
      <h2>Create Voting Section</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Voting Title: *</label>
          
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={errors.title ? 'error-input' : ''}
            required
          />
          {errors.title && <span className="error-message">{errors.title}</span>}
        </div>

        <div className="form-group">
          <label>Number of Candidates: *</label>
          <input
            type="number"
            name="numCandidates"
            min="2"
            max="20"
            value={formData.numCandidates}
            onChange={handleChange}
            className={errors.numCandidates ? 'error-input' : ''}
            required
          />
          {errors.numCandidates && <span className="error-message">{errors.numCandidates}</span>}
        </div>

        <div className="form-group">
          <label>Expiry Date: *</label>
          <input
            type="date"
            name="expiryDate"
            value={formData.expiryDate}
            onChange={handleChange}
            className={errors.expiryDate ? 'error-input' : ''}
            required
          />
          {errors.expiryDate && <span className="error-message">{errors.expiryDate}</span>}
        </div>

        <div className="form-group">
          <label>User ID:</label>
          <input type="text" value={formData.Uid} readOnly />
        </div>

        <button type="submit" className="submit-btn" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
}

export default VotingForm;
