import axios from 'axios';
import { useState } from 'react';

const ImageUploader = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage('Please select an image first');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const formData = new FormData();
      formData.append('image', selectedFile);

      const response = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setImageUrl(response.data.imageUrl);
      setMessage('Image uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      setMessage(`Error uploading image: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchImage = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/images/latest');
      setImageUrl(response.data.imageUrl);
      setMessage('Image fetched successfully!');
    } catch (error) {
      console.error('Fetch error:', error);
      setMessage(`Error fetching image: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      padding: '20px', 
      maxWidth: '500px', 
      margin: '0 auto',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h2 style={{ color: '#333', textAlign: 'center' }}>Image Uploader</h2>
      
      <div style={{ 
        margin: '20px 0',
        padding: '15px',
        border: '1px dashed #ccc',
        borderRadius: '5px',
        textAlign: 'center'
      }}>
        <input 
          type="file" 
          onChange={handleFileChange} 
          accept="image/*"
          style={{ display: 'block', margin: '0 auto 10px' }}
        />
        <small>Select an image to upload (JPEG, PNG, etc.)</small>
      </div>
      
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center',
        gap: '10px',
        marginBottom: '20px'
      }}>
        <button 
          onClick={handleUpload} 
          disabled={loading || !selectedFile}
          style={{
            padding: '10px 15px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          {loading ? 'Uploading...' : 'Upload Image'}
        </button>
        
        <button 
          onClick={fetchImage} 
          disabled={loading}
          style={{
            padding: '10px 15px',
            backgroundColor: '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          {loading ? 'Fetching...' : 'Fetch Latest Image'}
        </button>
      </div>
      
      {message && (
        <p style={{ 
          color: message.includes('Error') ? '#f44336' : '#4CAF50',
          textAlign: 'center',
          padding: '10px',
          backgroundColor: message.includes('Error') ? '#ffebee' : '#e8f5e9',
          borderRadius: '4px'
        }}>
          {message}
        </p>
      )}
      
      {imageUrl && (
        <div style={{ 
          marginTop: '20px',
          textAlign: 'center'
        }}>
          <h3 style={{ color: '#333' }}>Image Preview:</h3>
          <img 
            src={imageUrl} 
            alt="Uploaded preview" 
            style={{ 
              maxWidth: '100%', 
              maxHeight: '300px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }} 
          />
        </div>
      )}
    </div>
  );
};

export default ImageUploader;