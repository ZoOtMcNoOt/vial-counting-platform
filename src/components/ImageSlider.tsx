import React, { useState } from 'react';
import { ReactCompareSlider } from 'react-compare-slider';

interface ImageSliderProps {
  beforeImage: string; // Signed URL
  afterImage: string;  // Signed URL
}

const ImageSlider: React.FC<ImageSliderProps> = ({ beforeImage, afterImage }) => {
  const [beforeError, setBeforeError] = useState<boolean>(false);
  const [afterError, setAfterError] = useState<boolean>(false);

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-md">
        <div className="relative rounded-lg overflow-hidden shadow-lg">
          <ReactCompareSlider
            className="w-full h-auto"
            itemOne={
              !beforeError ? (
                <img
                  src={beforeImage}
                  alt="Before Image"
                  className="w-full h-auto object-contain"
                  onError={() => setBeforeError(true)}
                />
              ) : (
                <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                  <p className="text-gray-500">Image not available.</p>
                </div>
              )
            }
            itemTwo={
              !afterError ? (
                <img
                  src={afterImage}
                  alt="After Image"
                  className="w-full h-auto object-contain"
                  onError={() => setAfterError(true)}
                />
              ) : (
                <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                  <p className="text-gray-500">Image not available.</p>
                </div>
              )
            }
            portrait={false}
          />
          {/* Before Caption */}
          <div className="absolute top-0 left-0 m-4 text-white">
            <span className="bg-black bg-opacity-50 px-2 py-1 rounded">Before</span>
          </div>
          {/* After Caption */}
          <div className="absolute top-0 right-0 m-4 text-white">
            <span className="bg-black bg-opacity-50 px-2 py-1 rounded">After</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageSlider;
