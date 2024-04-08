// Assuming stage is an object now, with a popupContent property
const StageIndicator = ({ stage }) => {
    // Destructure popupContent if stage is not null, otherwise default to an empty string
    const { popupContent = "" } = stage || {};
    return (
        <div style={{
            position: 'absolute',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)', // Center horizontally
            color: 'white',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            padding: '10px',
            borderRadius: '5px',
            zIndex: 100, // Ensure it's above other content
        }}>
            Current Stage: {popupContent}
        </div>
    );
};

export default StageIndicator;
