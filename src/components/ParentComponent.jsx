import React, { useState } from "react";
import Island from "./Island"; // Ensure the correct path to your Island component

const ParentComponent = () => {
    const [rotationPopUpVisible, setRotationPopUpVisible] = useState(false);
    const [rotationPopUpContent, setRotationPopUpContent] = useState("");

    const [positionPopUpVisible, setPositionPopUpVisible] = useState(false);
    const [positionPopUpContent, setPositionPopUpContent] = useState("");

    const showRotationPopUp = (stage) => {
        setRotationPopUpContent(`You've entered rotation stage: ${stage}`);
        setRotationPopUpVisible(true);
        setTimeout(() => setRotationPopUpVisible(false), 3000);
    };

    const showPositionPopUp = (stage) => {
        setPositionPopUpContent(`You've entered position stage: ${stage}`);
        setPositionPopUpVisible(true);
        setTimeout(() => setPositionPopUpVisible(false), 3000);
    };

    return (
        <div>
            {rotationPopUpVisible && (
                <div style={{...}}>
                    {rotationPopUpContent}
                </div>
            )}
            {positionPopUpVisible && (
                <div style={{...}}>
                    {positionPopUpContent}
                </div>
            )}
            <Island 
                showRotationPopUp={showRotationPopUp} 
                showPositionPopUp={showPositionPopUp} 
            />
        </div>
    );
};

export default ParentComponent;