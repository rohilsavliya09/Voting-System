import { useEffect, useState } from 'react';

function GenerateUID() {
  return Math.random().toString(36).substring(2, 16).toUpperCase();
}

function CandidateForm({ onCandidateSubmit, currentCount, totalCandidates,FormTitle,Formid})
 {
  const [formData, setFormData] = useState({
    fullName: '',
    birthDate: '',
    age: '',
    email: '',
    mobile: '',
    address: '',
    image: null,
    voterIcon: null,
    Uid: GenerateUID(),
    Form_Title:FormTitle,
    Form_Id:Formid
  });

  const [profileImage, setProfileImage] = useState(null);
  const [iconImage, setIconImage] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (formData.birthDate) {
      const birthYear = new Date(formData.birthDate).getFullYear();
      const currentYear = new Date().getFullYear();
      const calculatedAge = currentYear - birthYear;
      setFormData(prev => ({ ...prev, age: calculatedAge.toString() }));
      
      // Validate age
      if (calculatedAge < 18 || calculatedAge > 80) {
        setErrors(prev => ({ ...prev, age: 'Candidate must be between 18 and 80 years old' }));
      } else {
        setErrors(prev => ({ ...prev, age: '' }));
      }
    }
  }, [formData.birthDate]);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
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
      case 'fullName':
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
        
      case 'email':
        if (!value.trim()) {
          fieldError = 'Email is required';
        } else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value)) {
          fieldError = 'Please enter a valid email address';
        }
        break;
        
      case 'mobile':
        if (!value.trim()) {
          fieldError = 'Mobile number is required';
        } else if (!/^[0-9]{10}$/.test(value.replace(/\s/g, ''))) {
          fieldError = 'Please enter a valid 10-digit mobile number';
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
        
      case 'birthDate':
        if (!value) {
          fieldError = 'Birth date is required';
        } else {
          const birthYear = new Date(value).getFullYear();
          const currentYear = new Date().getFullYear();
          const age = currentYear - birthYear;
          if (age < 18 || age > 80) {
            fieldError = 'Candidate must be between 18 and 80 years old';
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
    const newErrors = {};
    
    // Validate all fields
    validateField('fullName', formData.fullName);
    validateField('email', formData.email);
    validateField('mobile', formData.mobile);
    validateField('address', formData.address);
    validateField('birthDate', formData.birthDate);
    
    // Check if any errors exist
    const hasErrors = Object.values(errors).some(error => error !== '');
    
    return !hasErrors;
  }

  function handleProfileImageChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileImage(reader.result);
      setFormData(prev => ({ ...prev, image: reader.result }));
      setErrors(prev => ({ ...prev, image: '' }));
    };
    reader.readAsDataURL(file);
  }

  function handleVoterIconChange(e) {
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
      setIconImage(reader.result);
      setFormData(prev => ({ ...prev, voterIcon: reader.result }));
      setErrors(prev => ({ ...prev, voterIcon: '' }));
    };
    reader.readAsDataURL(file);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    
    // Prevent multiple submissions
    if (isSubmitting) return;
    
    // Validate form before submission
    if (!validateForm()) {
      alert('Please fix all errors before submitting');
      return;
    }
    
    // Check if required fields are filled
    if (!formData.fullName.trim() || !formData.email.trim() || !formData.mobile.trim() || 
        !formData.address.trim() || !formData.birthDate) {
      alert('Please fill all required fields');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // It's A Function And FormData Passed
      await onCandidateSubmit(formData);
      

      setFormData({
        fullName: '',
        birthDate: '',
        age: '',
        email: '',
        mobile: '',
        address: '',
        image: null,
        voterIcon: null,
        Uid: GenerateUID(),
        Form_Title:FormTitle,
        Form_Id:Formid

      });
      setProfileImage(null);
      setIconImage(null);
      setErrors({});
    } catch (error) {
      console.error("Form submission error:", error);
      alert('Failed to submit form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="form-container">
      <h2>Create Candidate ({currentCount} of {totalCandidates})</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Full Name: *</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className={errors.fullName ? 'error-input' : ''}
            required
          />
          {errors.fullName && <span className="error-message">{errors.fullName}</span>}
        </div>

        <div className="form-group">
          <label>Birth Date: *</label>
          <input
            type="date"
            name="birthDate"
            value={formData.birthDate}
            onChange={handleChange}
            className={errors.birthDate ? 'error-input' : ''}
            required
          />
          {errors.birthDate && <span className="error-message">{errors.birthDate}</span>}
        </div>

        <div className="form-group">
          <label>Age:</label>
          <input
            type="number"
            name="age"
            value={formData.age}
            disabled
            className={errors.age ? 'error-input' : ''}
            required
          />
          {errors.age && <span className="error-message">{errors.age}</span>}
        </div>

        <div className="form-group">
          <label>Email: *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? 'error-input' : ''}
            required
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label>Mobile: *</label>
          <input
            type="tel"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            className={errors.mobile ? 'error-input' : ''}
            required
          />
          {errors.mobile && <span className="error-message">{errors.mobile}</span>}
        </div>

        <div className="form-group">
          <label>Address: *</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            className={errors.address ? 'error-input' : ''}
            required
          />
          {errors.address && <span className="error-message">{errors.address}</span>}
        </div>

        <div className="form-group">
          <label>Profile Image:</label>
          <input type="file" accept="image/*" onChange={handleProfileImageChange} />
          {profileImage && (
            <div className="image-preview">
              <img src={profileImage} alt="Profile Preview" style={{ maxWidth: '150px', marginTop: '10px' }} />
            </div>
          )}
        </div>

        <div className="form-group">
          <label>Voter Icon:</label>
          <input type="file" accept="image/*" onChange={handleVoterIconChange} />
          {iconImage && (
            <div className="image-preview">
              <img src={iconImage} alt="Voter Icon Preview" style={{ maxWidth: '150px', marginTop: '10px' }} />
            </div>
          )}
        </div>

        <div className="form-group">
          <label>User ID:</label>
          <input type="text" value={formData.Uid} readOnly />
        </div>

        <button type="submit" className="submit-btn" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : (currentCount < totalCandidates ? 'Save & Next' : 'Submit All')}
        </button>
      </form>
    </div>
  );
}

export default CandidateForm;
