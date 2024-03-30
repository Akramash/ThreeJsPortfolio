// StageIndicator.jsx
import React from 'react';

const StageIndicator = ({ stage }) => {
    return (
        <div style={{
            position: 'absolute',
            top: '20px',
            left: '300px',
            color: 'white',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            padding: '10px',
            borderRadius: '5px',
        }}>
            Current Stage: {stage}
        </div>
    );
};

export default StageIndicator;