import React, { useMemo } from 'react';

interface AddVideoProps {
  question: any;
}

export const AddVideoAnswer: React.FC<AddVideoProps> = ({ question }) => {
  const videoContent = useMemo(() => {
    return { __html: question.video };
  }, [question.video]);

  return (
    <div className="mb-4 max-w-screen-lg mx-auto aspect-w-16 aspect-h-9">
      <div className="video-container" dangerouslySetInnerHTML={videoContent} />
    </div>
  );
};