<<<<<<< HEAD
// src/components/ImageSlider.tsx

import React from 'react';
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider';
import Image from 'next/image';
import SwipeIcon from '../../public/images/swipe.png';

interface ImageSliderProps {
  beforeImage: string; // URL of the original image
  afterImage: string;  // URL of the processed image
}

const ImageSlider: React.FC<ImageSliderProps> = ({ beforeImage, afterImage }) => {

  // Combined handle with a red line, glass effect circle, and swipe icon
  const CombinedHandle = () => {
    return (
      <div style={{
        width: '2px',               // Red line width
        height: '100%',             // Full height for the line
        backgroundColor: '#ff0000', // Solid red color
        position: 'relative',       // Position to center the icon
        cursor: 'pointer',
        borderRadius: '4px',        // Optional: rounded edges
        boxShadow: '0px 0px 6px rgba(0, 0, 0, 0.3)' // Optional: shadow for depth
      }}>
    {/* Glass Effect Circle */}
    <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: '100px',             // Circle width
        height: '100px',            // Circle height
        backgroundColor: 'rgba(255, 255, 255, 0.3)', // Semi-transparent white
        backdropFilter: 'blur(1px)',                 // Glass effect blur
        borderRadius: '50%',       // Fully rounded for circle
        transform: 'translate(-50%, -50%)', // Center within handle
        zIndex: 1                  // Ensure it stays in front of the red line
    }}>
          {/* Centered swipe icon */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)', // Center icon within glass circle
            zIndex: 2                           // Bring icon above the glass effect
          }}>
            <Image src={SwipeIcon} alt="Swipe Icon" width={48} height={48} />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto my-10">
      <ReactCompareSlider
        className="rounded-lg overflow-hidden shadow-lg"
        itemOne={
          <ReactCompareSliderImage
            src={beforeImage}
            alt="Before Image"
          />
        }
        itemTwo={
          <ReactCompareSliderImage
            src={afterImage}
            alt="After Image"
          />
        }
        handle={<CombinedHandle />}   // Use the combined handle
        portrait={false}               // Horizontal slider
        style={{
          width: '100%',
          height: '100%', // Limit height to 800px
        }}
      />
      {/* Custom styling for the slider line */}
      <style jsx global>{`
        .react-compare-slider__slider-line {
          background-color: #ff0000 !important; /* Solid red color */
          width: 8px !important;               /* 8px thickness */
        }
      `}</style>
=======
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
>>>>>>> 3079c15623a14fc75cd22cb7ecc600b04e708a04
    </div>
  );
};

export default ImageSlider;
