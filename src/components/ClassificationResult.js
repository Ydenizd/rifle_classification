import React from 'react';

const ClassificationResult = ({ results, isVisible }) => {
    if (!isVisible || !results || results.length === 0) {
        return null;
    }

    return (
        <div style={{
            marginTop: '30px',
            padding: '25px',
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            border: '2px solid #28a745',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
        }}>
            <h3 style={{ 
                color: '#28a745', 
                marginBottom: '20px',
                textAlign: 'center',
                fontSize: '24px',
                fontWeight: 'bold'
            }}>
                🎯 Classification Results
            </h3>
            
            <div style={{
                fontSize: '18px',
                fontWeight: 'bold',
                marginBottom: '20px',
                color: '#333'
            }}>
                Prediction: <span style={{ color: '#007bff' }}>{results.predictedClass}</span>
            </div>

            <div style={{
                fontSize: '18px',
                fontWeight: 'bold',
                marginBottom: '20px',
                color: '#333'
            }}>
                Confidence: <span style={{ color: '#28a745' }}>{results.confidence}%</span>
            </div>

            <div>
                <h4 style={{ 
                    marginBottom: '25px', 
                    textAlign: 'center',
                    color: '#28a745',
                    borderBottom: '2px solid #5e6861ff',
                    paddingBottom: '8px',
                    fontSize: '24px'
                }}>
                    Class probabilities
                </h4>

                {results.allClasses.map((classResult, index) => (
                    <div key={index} style={{
                        marginBottom: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px',
                        backgroundColor: '#f8f9fa',
                        borderRadius: '8px',
                        border: '1px solid #dee2e6'
                    }}>
                        <span style={{ 
                            fontWeight: '500',
                            minWidth: '120px',
                            color: '#333',
                            fontSize: '16px'
                        }}>
                            {classResult.className}:
                        </span>

                        {/* Progress Bar */}
                        <div style={{
                            width: '60%',
                            height: '25px',
                            backgroundColor: '#e9ecef',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            marginLeft: '15px',
                            position: 'relative'
                        }}>
                            <div style={{
                                width: `${classResult.percentage}%`,
                                height: '100%',
                                backgroundColor: classResult.percentage > 50 ? '#28a745' : '#6c757d',
                                transition: 'width 0.8s ease-in-out',
                                borderRadius: '12px',
                                boxShadow: classResult.percentage > 50 ? '0 0 10px rgba(40,167,69,0.3)' : 'none'
                            }} />
                        </div>
                        
                        <span style={{
                            marginLeft: '15px',
                            fontWeight: 'bold',
                            color: classResult.percentage > 50 ? '#28a745' : '#6c757d',
                            minWidth: '60px',
                            textAlign: 'right',
                            fontSize: '16px'
                        }}>
                            {classResult.percentage}%
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ClassificationResult;