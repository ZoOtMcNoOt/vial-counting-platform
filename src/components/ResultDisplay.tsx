import React, { useState } from 'react';

interface ResultDisplayProps {
  imageUrl: string; // Signed URL
  countedVials: number;
  percentage: string;
  className?: string; // Accept additional classes
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({
  imageUrl,
  countedVials,
  percentage,
  className,
}) => {
  const [downloadError, setDownloadError] = useState<boolean>(false);

  const handleDownload = async () => {
    if (!imageUrl) {
      setDownloadError(true);
      return;
    }

    try {
      const response = await fetch(imageUrl, {
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

  return (
    <div className={`w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 flex flex-col ${className}`}>
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6 text-center">
        Processed Results
      </h2>
      <div className="flex flex-col md:flex-row items-center md:items-start md:space-x-6">
        {/* Image Section */}
        <div className="w-full md:w-1/2">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt="Processed Tray"
              className="w-full h-auto rounded-md border border-gray-200 dark:border-gray-700 object-contain"
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
        </div>
      </div>
    </div>
  );
};

export default ResultDisplay;
