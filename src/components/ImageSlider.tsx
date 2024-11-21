import React, { useState } from 'react';
import { ReactCompareSlider } from 'react-compare-slider';

interface ImageSliderProps {
  beforeImage: string;
  afterImage: string;
  className?: string;
}

const ImageSlider: React.FC<ImageSliderProps> = ({ beforeImage, afterImage, className }) => {
  const [beforeError, setBeforeError] = useState<boolean>(false);
  const [afterError, setAfterError] = useState<boolean>(false);

  console.log('Before Image URL:', beforeImage);
  console.log('After Image URL:', afterImage);

  return (
    <div className={`w-full h-full relative ${className}`}>
      <ReactCompareSlider
        className="w-full h-full"
        itemOne={
          !beforeError ? (
            <img
              src={beforeImage}
              alt="Before Image"
              className="w-full h-full object-contain"
              onError={() => setBeforeError(true)}
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <p className="text-gray-500">Image not available.</p>
            </div>
          )
        }
        itemTwo={
          !afterError ? (
            <img
              src={afterImage}
              alt="After Image"
              className="w-full h-full object-contain"
              onError={() => setAfterError(true)}
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <p className="text-gray-500">Image not available.</p>
            </div>
          )
        }
        portrait={false}
      />
      {/* Before Caption */}
      <div className="absolute top-2 left-2 bg-black bg-opacity-50 px-2 py-1 rounded text-white text-sm pointer-events-none z-10">
        Original
      </div>
      {/* After Caption */}
      <div className="absolute top-2 right-2 bg-black bg-opacity-50 px-2 py-1 rounded text-white text-sm pointer-events-none z-10">
        Tagged
      </div>
    </div>
  );
};

export default ImageSlider;