import React, { useEffect, useState, memo } from 'react';
import ImageSlider from './ImageSlider';
import type { Result } from '../types';
import axios from 'axios';

const ResultsList: React.FC = () => {
  const [results, setResults] = useState<Result[]>([]);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await axios.get<Result[]>('/api/all-results');
        setResults(response.data);
      } catch (error) {
        console.error('Error fetching results:', error);
      }
    };

    fetchResults();
  }, []);

  return (
    <div className="mt-8 w-full">
      <h2 className="text-3xl font-semibold mb-6 text-center">All Results</h2>
      {results.length === 0 ? (
        <p className="text-center text-gray-600 dark:text-gray-400">No results available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((result) => (
            <div
              key={result.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden flex flex-col h-full"
            >
              {/* Image Slider */}
              <div className="h-48 md:h-60 lg:h-64">
                <ImageSlider
                  beforeImage={result.original_image_url || ''}
                  afterImage={result.processed_image_url || ''}
                />
              </div>

              {/* Result Details */}
              <div className="flex-grow p-4">
                <div className="mb-2">
                  <p className="text-lg text-gray-800 dark:text-gray-200">
                    <span className="font-semibold">Counted Vials:</span> {result.counted_vials}
                  </p>
                  <p className="text-lg text-gray-800 dark:text-gray-200">
                    <span className="font-semibold">Percentage:</span> {result.percentage}%
                  </p>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Processed At: {new Date(result.created_at).toLocaleString()}
                </p>
              </div>

              {/* Optional: Additional Actions */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <button className="text-blue-700 dark:text-blue-300 hover:underline">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default memo(ResultsList);