import React, { useState } from 'react';
import axios from 'axios';
import ImageSlider from './ImageSlider';

interface ResultDisplayProps {
  originalImageBase64: string;
  processedImageBase64: string;
  countedVials: number;
  percentage: string;
  className?: string;
  onClear: () => void;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({
  originalImageBase64,
  processedImageBase64,
  countedVials,
  percentage,
  className = '',
  onClear,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [downloadError, setDownloadError] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleDownload = () => {
    try {
      const link = document.createElement('a');
      link.href = `data:image/jpeg;base64,${processedImageBase64}`;
      link.download = `processed-image-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download error:', error);
      setDownloadError(true);
    }
  };

  const handleApprove = async () => {
    setLoading(true);
    setError('');

    try {
      const payload = {
        original_image_base64: originalImageBase64,
        processed_image_base64: processedImageBase64,
        countedVials: countedVials,
        percentage: parseFloat(percentage),
      };

      await axios.post('/api/save-result', payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      alert('Result approved and saved successfully!');
      onClear();
    } catch (err: any) {
      setError(
        err.response?.data?.error || 'An error occurred while saving the result.'
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`w-full max-w-6xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 ${className}`}>
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6 text-center">
        Processed Results
      </h2>
      
      {/* Image Comparison Section */}
      <div className="mb-8 relative aspect-[4/3] w-full">
        <ImageSlider
          beforeImage={`data:image/jpeg;base64,${originalImageBase64}`}
          afterImage={`data:image/jpeg;base64,${processedImageBase64}`}
        />
      </div>

      {/* Results Details Section */}
      <div className="max-w-2xl mx-auto">
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-6">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            Processed Tray Details
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="text-center p-4 bg-white dark:bg-gray-600 rounded-lg">
              <p className="text-lg text-gray-700 dark:text-gray-300">
                <span className="font-semibold">Counted Vials:</span>
                <br />
                {countedVials}
              </p>
            </div>
            <div className="text-center p-4 bg-white dark:bg-gray-600 rounded-lg">
              <p className="text-lg text-gray-700 dark:text-gray-300">
                <span className="font-semibold">Percentage:</span>
                <br />
                {percentage}%
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={handleDownload}
            className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200 flex-1"
          >
            Download Processed Image
          </button>
          <button
            onClick={handleApprove}
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 flex-1 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Approve'}
          </button>
          <button
            onClick={onClear}
            className="px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200 flex-1"
          >
            Clear Results
          </button>
        </div>

        {/* Error Messages */}
        {downloadError && (
          <p className="text-red-500 text-center mt-4">Failed to download the image</p>
        )}
        {error && (
          <p className="text-red-500 text-center mt-4">{error}</p>
        )}
      </div>
    </div>
  );
};

export default ResultDisplay;
