import React, { useEffect, useState, memo } from 'react';
import ImageSlider from './ImageSlider';
import type { Result } from '../types';
import axios from 'axios';

interface ResultsListProps {}

const ResultsList: React.FC<ResultsListProps> = () => {
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const fetchResults = async () => {
    try {
      const response = await axios.get<Result[]>('/api/all-results');
      setResults(response.data);
    } catch (err: any) {
      setError(
        err.response?.data?.error || 'An error occurred while fetching results.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-lg">Loading results...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-red-500">{error}</p>
      </div>
    );

  return (
    <div className="mt-8 w-full">
      <h2 className="text-3xl font-semibold mb-6 text-center">All Results</h2>
      {results.length === 0 ? (
        <p className="text-center">No results available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((result) => (
            <div
              key={result.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden flex flex-col transform hover:scale-105 transition-transform duration-300"
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
                  <p className="text-lg">
                    <span className="font-semibold">Counted Vials:</span>{' '}
                    {result.counted_vials}
                  </p>
                  <p className="text-lg">
                    <span className="font-semibold">Percentage:</span>{' '}
                    {result.percentage}%
                  </p>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Processed At:{' '}
                  {new Date(result.created_at).toLocaleString()}
                </p>
              </div>

              {/* Optional: Additional Actions */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <button className="text-blue-600 dark:text-blue-400 hover:underline">
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