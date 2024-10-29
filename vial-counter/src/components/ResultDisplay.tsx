// src/components/ResultDisplay.tsx

import React from 'react';

interface ResultDisplayProps {
  imageUrl: string;
  countedVials: number;
  percentage: string;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ imageUrl, countedVials, percentage }) => {
  return (
    <div className="mt-10 w-full max-w-4xl bg-white rounded-lg shadow-lg p-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Processed Results</h2>
      <div className="flex flex-col md:flex-row items-center md:space-x-6 space-y-6 md:space-y-0">
        <div className="w-full md:w-1/2">
          <img src={imageUrl} alt="Processed Tray" className="w-full h-auto rounded-md border border-gray-200" />
        </div>
        <div className="w-full md:w-1/2">
          <div className="mb-4">
            <p className="text-lg text-gray-700">
              <span className="font-semibold">Counted Vials:</span> {countedVials}
            </p>
            <p className="text-lg text-gray-700">
              <span className="font-semibold">Percentage of Expected:</span> {percentage}%
            </p>
          </div>
          <a
            href={imageUrl}
            download={`processed-tray-${Date.now()}.jpg`}
            className="inline-block w-full text-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200"
          >
            Download Processed Image
          </a>
        </div>
      </div>
    </div>
  );
};

export default ResultDisplay;
