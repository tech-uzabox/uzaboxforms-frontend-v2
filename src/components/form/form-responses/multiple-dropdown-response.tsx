import React from 'react';

interface MultipleDropdownResponseProps {
    response: { levelName: string; response: string }[];
}

const MultipleDropdownResponse: React.FC<MultipleDropdownResponseProps> = ({ response }) => {
    return (
        <div className="mb-2 space-y-2">
            {response.map((levelResponse, index) => (
                <div className="mt-1" key={index}>
                    <div className="main-label">
                        {levelResponse.levelName}
                    </div>
                    <div className='main-response-container'>
                        {levelResponse.response}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default MultipleDropdownResponse;