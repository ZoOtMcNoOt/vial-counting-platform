import React from 'react';
import { ReactCompareSlider } from 'react-compare-slider';

interface ImageSliderProps {
  beforeImage: string;
  afterImage: string;
}

const ImageSlider: React.FC<ImageSliderProps> = ({ beforeImage, afterImage }) => {
  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-md">
        <div className="relative rounded-lg overflow-hidden shadow-lg">
          <ReactCompareSlider
            className="w-full h-auto"
            itemOne={
              <img
                src={beforeImage}
                alt="Before Image"
                className="w-full h-auto object-contain"
              />
            }
            itemTwo={
              <img
                src={afterImage}
                alt="After Image"
                className="w-full h-auto object-contain"
              />
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
