import { useState } from 'react';
import './CreateCardPage.css';

function CreateCardPage({ onCreateCardSubmit, onClose }) {
  const [voterdata, setvoterdata] = useState({
    full_name: '',
    phone_number: '',
    email: '',
    address: '',
    birthdate: '',
    age: '',
    user_id: generateRandomId()
  });

  const [image, setimage] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  function generateRandomId() {
    return Math.random().toString(36).substring(2, 14).toUpperCase();
  }

  function calculateAge(birthdate) {
    const today = new Date();
    const birthDate = new Date(birthdate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    
    if (name === 'birthdate') {
      const age = calculateAge(value);
      setvoterdata({ ...voterdata, [name]: value, age: age.toString() });
      
      // Validate age
      if (age < 18 || age > 120) {
        setErrors(prev => ({ ...prev, age: 'Voter must be between 18 and 120 years old' }));
      } else {
        setErrors(prev => ({ ...prev, age: '' }));
      }
    } else {
      setvoterdata({ ...voterdata, [name]: value });
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    // Real-time validation
    validateField(name, value);
  }

  function validateField(name, value) {
    let fieldError = '';
    
    switch (name) {
      case 'full_name':
        if (!value.trim()) {
          fieldError = 'Full name is required';
        } else if (value.trim().length < 2) {
          fieldError = 'Full name must be at least 2 characters long';
        } else if (value.trim().length > 100) {
          fieldError = 'Full name cannot exceed 100 characters';
        } else if (!/^[a-zA-Z\s]+$/.test(value.trim())) {
          fieldError = 'Full name can only contain letters and spaces';
        }
        break;
        
      case 'phone_number':
        if (!value.trim()) {
          fieldError = 'Phone number is required';
        } else if (!/^[0-9]{10}$/.test(value.replace(/\s/g, ''))) {
          fieldError = 'Please enter a valid 10-digit phone number';
        }
        break;
        
      case 'email':
        if (!value.trim()) {
          fieldError = 'Email is required';
        } else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value)) {
          fieldError = 'Please enter a valid email address';
        }
        break;
        
      case 'address':
        if (!value.trim()) {
          fieldError = 'Address is required';
        } else if (value.trim().length < 10) {
          fieldError = 'Address must be at least 10 characters long';
        } else if (value.trim().length > 200) {
          fieldError = 'Address cannot exceed 200 characters';
        }
        break;
        
      case 'birthdate':
        if (!value) {
          fieldError = 'Birth date is required';
        } else {
          const birthYear = new Date(value).getFullYear();
          const currentYear = new Date().getFullYear();
          const age = currentYear - birthYear;
          if (age < 18 || age > 120) {
            fieldError = 'Voter must be between 18 and 120 years old';
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
    // Validate all fields
    validateField('full_name', voterdata.full_name);
    validateField('phone_number', voterdata.phone_number);
    validateField('email', voterdata.email);
    validateField('address', voterdata.address);
    validateField('birthdate', voterdata.birthdate);
    
    // Check if any errors exist
    const hasErrors = Object.values(errors).some(error => error !== '');
    
    return !hasErrors;
  }

  function handleImageChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setimage(reader.result);
      setErrors(prev => ({ ...prev, image: '' }));
    };
    if (file) reader.readAsDataURL(file);
  }

  function handleSubmit(e) {
    e.preventDefault();
    
    // Prevent multiple submissions
    if (isSubmitting) return;
    
    // Validate form before submission
    if (!validateForm()) {
      alert('Please fix all errors before submitting');
      return;
    }
    
    // Check if required fields are filled
    if (!voterdata.full_name.trim() || !voterdata.phone_number.trim() || 
        !voterdata.email.trim() || !voterdata.address.trim() || !voterdata.birthdate) {
      alert('Please fill all required fields');
      return;
    }
    
    setIsSubmitting(true);
    
    const data = { ...voterdata, image };
    onCreateCardSubmit(data);
    
    setIsSubmitting(false);
  }

  return (
    <div className="form-container">
      <h2>User Registration</h2>
      <button className="back-btn" onClick={onClose}>Back</button>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Full Name *</label>
          <input 
            type="text" 
            name="full_name" 
            value={voterdata.full_name} 
            onChange={handleChange} 
            className={errors.full_name ? 'error-input' : ''}
            required 
          />
          {errors.full_name && <span className="error-message">{errors.full_name}</span>}
        </div>

        <div className="form-group">
          <label>Profile Image</label>
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleImageChange} 
          />
          {image && (
            <div className="image-preview">
              <img src={image} alt="Preview" />
            </div>
          )}
        </div>

        <div className="form-group">
          <label>Phone Number *</label>
          <input 
            type="tel" 
            name="phone_number" 
            value={voterdata.phone_number} 
            onChange={handleChange} 
            className={errors.phone_number ? 'error-input' : ''}
            required 
          />
          {errors.phone_number && <span className="error-message">{errors.phone_number}</span>}
        </div>

        <div className="form-group">
          <label>Email *</label>
          <input 
            type="email" 
            name="email" 
            value={voterdata.email} 
            onChange={handleChange} 
            className={errors.email ? 'error-input' : ''}
            required 
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label>Address *</label>
          <textarea 
            name="address" 
            value={voterdata.address} 
            onChange={handleChange} 
            className={errors.address ? 'error-input' : ''}
            required 
          />
          {errors.address && <span className="error-message">{errors.address}</span>}
        </div>

        <div className="form-group">
          <label>Birthdate *</label>
          <input 
            type="date" 
            name="birthdate" 
            value={voterdata.birthdate} 
            onChange={handleChange} 
            className={errors.birthdate ? 'error-input' : ''}
            required 
          />
          {errors.birthdate && <span className="error-message">{errors.birthdate}</span>}
        </div>

        <div className="form-group">
          <label>Age</label>
          <input 
            type="text" 
            value={voterdata.age} 
            className={errors.age ? 'error-input' : ''}
            readOnly 
          />
          {errors.age && <span className="error-message">{errors.age}</span>}
        </div>

        <div className="form-group">
          <label>User ID</label>
          <input 
            type="text" 
            value={voterdata.user_id} 
            readOnly 
          />
        </div>

        <button type="submit" className="submit-btn" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
}

export default CreateCardPage;