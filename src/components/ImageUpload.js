import { useState } from 'react';
import { classifyImage, testConnection } from '../services/classificationAPI';
import ClassificationResult from './ClassificationResult';

const ImageUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [classificationResults, setClassificationResults] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    setError(null);
    setResult(null);
    setClassificationResults(null);

    // Önizleme oluştur
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleClassify = async () => {
    if (!selectedFile) {
      setError('Please select an image file');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const result = await classifyImage(selectedFile);
      setResult(result);
      
      // Transform result data for ClassificationResult component
      const transformedResults = {
        predictedClass: result.label,
        confidence: (result.confidences.find(c => c.label === result.label)?.confidence * 100).toFixed(1),
        allClasses: result.confidences.map(item => ({
          className: item.label,
          percentage: (item.confidence * 100).toFixed(1)
        }))
      };
      
      setClassificationResults(transformedResults);
      
    } catch (error) {
      setError(error.message || 'Classification failed');
      setClassificationResults(null);
    } finally {
      setLoading(false);
    }
  };

  const testAPI = async () => {
    try {
      setConnectionStatus('testing');
      const isConnected = await testConnection();
      setConnectionStatus(isConnected ? 'connected' : 'failed');
      
      if (!isConnected) {
        throw new Error('Connection to API failed');
      }
    } catch (error) {
      setConnectionStatus('failed');
      console.error('Connection test failed:', error);
    }
  };

  return (
    <div style={{
      backgroundColor: '#ffffff',
      minHeight: '100vh',
      padding: '200px'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '100px',
        backgroundColor: '#f8f9fa',
        borderRadius: '15px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
      }}>
        
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h2 style={{ 
            color: '#333', 
            fontSize: '28px', 
            fontWeight: 'bold',
            marginBottom: '15px'
          }}>
            WW2 Bolt-Action Rifle Classifier
          </h2>
          <h4 style={{ 
            color: '#666', 
            fontSize: '16px', 
            fontWeight: 'normal',
            lineHeight: '1.5',
            margin: '0'
          }}>
            Kar98K vs Lee-Enfield vs Mosin-Nagant.<br />
            For accurate results, only the rifle itself should be in the photo.
          </h4>
        </div>
        
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          marginBottom: '30px' 
        }}>
          <button 
            onClick={testAPI}
            disabled={connectionStatus === 'testing'}
            style={{
              padding: '12px 25px',
              fontSize: '16px',
              fontWeight: 'bold',
              borderRadius: '8px',
              border: 'none',
              cursor: connectionStatus === 'testing' ? 'not-allowed' : 'pointer',
              backgroundColor: connectionStatus === 'connected' ? '#28a745' : 
                             connectionStatus === 'failed' ? '#dc3545' : '#007bff',
              color: 'white',
              transition: 'all 0.3s ease'
            }}
          >
            {connectionStatus === 'testing' ? 'Testing...' : 
             connectionStatus === 'connected' ? '✅ Connected' : 
             connectionStatus === 'failed' ? '❌ Connection Failed' : 'Test Connection'}
          </button>
        </div>
        
        <div style={{ marginBottom: '30px' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center',
            marginBottom: '20px'
          }}>
            <label style={{
              display: 'inline-block',
              padding: '12px 30px',
              backgroundColor: '#007bff',
              color: 'white',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold',
              transition: 'background-color 0.3s ease',
              border: 'none'
            }}>
              Choose an image
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
            </label>
          </div>
          
          {preview && (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              marginTop: '20px',
              padding: '20px',
              backgroundColor: '#ffffff',
              borderRadius: '10px',
              border: '2px dashed #dee2e6'
            }}>
              <img 
                src={preview} 
                alt="Preview" 
                style={{
                  maxWidth: '400px',
                  maxHeight: '300px',
                  width: 'auto',
                  height: 'auto',
                  objectFit: 'contain',
                  borderRadius: '8px',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                }}
              />
              <p style={{ 
                marginTop: '15px', 
                color: '#666',
                fontSize: '14px',
                fontWeight: '500'
              }}>
                Selected: {selectedFile.name}
              </p>
            </div>
          )}
        </div>
        
        {selectedFile && (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center',
            marginBottom: '20px'
          }}>
            <button 
              onClick={handleClassify} 
              disabled={loading}
              style={{
                padding: '15px 40px',
                fontSize: '18px',
                fontWeight: 'bold',
                borderRadius: '10px',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                backgroundColor: loading ? '#6c757d' : '#28a745',
                color: 'white',
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
              }}
            >
              {loading ? 'Classifying...' : 'Classify Image'}
            </button>
          </div>
        )}
        
        {error && (
          <div style={{
            padding: '15px',
            backgroundColor: '#f8d7da',
            color: '#721c24',
            border: '1px solid #f5c6cb',
            borderRadius: '8px',
            marginBottom: '20px',
            textAlign: 'center',
            fontWeight: '500'
          }}>
            {error}
          </div>
        )}
        
        {/* ClassificationResult component */}
        <ClassificationResult 
          results={classificationResults}
          isVisible={!!classificationResults}
        />
      </div>
    </div>
  );
};

export default ImageUpload;