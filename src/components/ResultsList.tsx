import React, { useEffect, useState } from 'react';
import ImageSlider from './ImageSlider';
import type { Result } from '../types';

const ResultsList: React.FC = () => {
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await fetch('/api/all-results');
        if (!res.ok) throw new Error('Failed to fetch results');
        const data: Result[] = await res.json();
        setResults(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  if (loading) return <p>Loading results...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="mt-8 w-full">
      <h2 className="text-2xl font-semibold mb-4">All Results</h2>
      {results.length === 0 ? (
        <p>No results available.</p>
      ) : (
        results.map((result) => (
          <div key={result.id} className="mb-6 p-4 bg-white dark:bg-gray-800 rounded shadow">
            <ImageSlider
              beforeImage={result.original_image_url || ''}
              afterImage={result.processed_image_url || ''}
            />
            <div className="mt-4">
              <p className="text-lg">
                <span className="font-semibold">Counted Vials:</span> {result.counted_vials}
              </p>
              <p className="text-lg">
                <span className="font-semibold">Percentage:</span> {result.percentage}%
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Processed At: {new Date(result.created_at).toLocaleString()}
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ResultsList;
