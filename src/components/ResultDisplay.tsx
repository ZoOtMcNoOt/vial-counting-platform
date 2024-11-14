import React, { useState } from 'react';

interface ResultDisplayProps {
  originalImageUrl: string;
  processedImageUrl: string;
  countedVials: number;
  percentage: string;
  className?: string; // Accept additional classes
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({
  originalImageUrl,
  processedImageUrl,
  countedVials,
  percentage,
  className = '',
}) => {
  const [downloadError, setDownloadError] = useState<boolean>(false);

  const handleDownload = async () => {
    if (!processedImageUrl) {
      setDownloadError(true);
      return;
    }

    try {
      const response = await fetch(processedImageUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/octet-stream',
        },
      });

      if (!response.ok) throw new Error('Failed to download image.');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `processed-tray-${Date.now()}.jpg`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
      setDownloadError(true);
    }
  };

  const handleApprove = () => {
    // Implement approve functionality
  };

  const handleClear = () => {
    // Implement clear functionality
  };

  return (
    <div className={`w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 flex flex-col ${className}`}>
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6 text-center">
        Processed Results
      </h2>
      <div className="flex flex-col md:flex-row items-center md:items-start md:space-x-6">
        {/* Image Section */}
        <div className="w-full md:w-1/2">
          {originalImageUrl ? (
            <img
              src={originalImageUrl}
              alt="Original Tray"
              className="w-full h-auto rounded-md border border-gray-200 dark:border-gray-700 object-contain"
              onError={() => setDownloadError(true)}
            />
          ) : (
            <p className="text-red-500">Image not available.</p>
          )}
          {processedImageUrl ? (
            <img
              src={processedImageUrl}
              alt="Processed Tray"
              className="w-full h-auto rounded-md border border-gray-200 dark:border-gray-700 object-contain mt-4"
              onError={() => setDownloadError(true)}
            />
          ) : (
            <p className="text-red-500">Image not available.</p>
          )}
        </div>
        {/* Results Section */}
        <div className="w-full md:w-1/2 mt-6 md:mt-0">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            Processed Tray
          </h3>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-2">
            <span className="font-semibold">Counted Vials:</span> {countedVials}
          </p>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
            <span className="font-semibold">Percentage of Expected:</span> {percentage}%
          </p>
          <button
            onClick={handleDownload}
            className="inline-block w-full text-center px-4 py-2 bg-green-600 dark:bg-green-700 text-white rounded-md hover:bg-green-700 dark:hover:bg-green-800 transition-colors duration-200"
          >
            Download Processed Image
          </button>
          {downloadError && (
            <p className="text-red-500 mt-2">Failed to download the image.</p>
          )}
          {/* Approve and Clear Buttons */}
          <button
            onClick={handleApprove}
            className="inline-block w-full text-center px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors duration-200 mt-4"
          >
            Approve
          </button>
          <button
            onClick={handleClear}
            className="inline-block w-full text-center px-4 py-2 bg-red-600 dark:bg-red-700 text-white rounded-md hover:bg-red-700 dark:hover:bg-red-800 transition-colors duration-200 mt-2"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultDisplay;
