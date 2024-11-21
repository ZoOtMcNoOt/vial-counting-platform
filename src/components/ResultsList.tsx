import React, { useEffect, useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import ImageSlider from './ImageSlider';
import type { Result } from '../types';
import axios from 'axios';
import ResultCardSkeleton from './ResultCardSkeleton';
import { formatLocalDateTime } from '../utils/dateUtils';

const ITEMS_PER_PAGE = 9;

interface ResultsResponse {
  results: Result[];
  nextCursor: number | null;
}

const ResultsList: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { ref, inView } = useInView();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isLoading,
  } = useInfiniteQuery<ResultsResponse>({
    queryKey: ['results'],
    queryFn: async ({ pageParam = 0 }) => {
      const response = await axios.get<ResultsResponse>('/api/all-results', {
        params: {
          cursor: pageParam,
          limit: ITEMS_PER_PAGE,
        },
      });
      return response.data;
    },
    getNextPageParam: (lastPage: ResultsResponse) => lastPage.nextCursor ?? undefined,
    initialPageParam: 0,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage]);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await fetch('/api/all-results');
        const data = await response.json();
        if (response.ok) {
          // Assuming initial fetch logic is handled by react-query
        } else {
          setError(data.error || 'Failed to fetch results');
        }
      } catch (err) {
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, []);

  if (isLoading || loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <ResultCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) return <p className="text-red-500 text-center">{`Error: ${error}`}</p>;

  return (
    <div className="mt-8 w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.pages.map((page) =>
          page.results.map((result) => <ResultCard key={result.id} result={result} />)
        )}
      </div>
      {hasNextPage && (
        <div ref={ref} className="flex justify-center mt-8">
          {isFetching ? (
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-600"></div>
          ) : null}
        </div>
      )}
    </div>
  );
};

interface ResultCardProps {
  result: Result;
}

const ResultCard: React.FC<ResultCardProps> = ({ result }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden flex flex-col h-full">
      <div className="h-48 md:h-60 lg:h-64">
        <ImageSlider
          beforeImage={result.original_image_url}
          afterImage={result.processed_image_url}
        />
      </div>
      <div className="flex-grow p-6 bg-gray-50 dark:bg-gray-700 space-y-4">
        <div>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            <span className="font-semibold">Counted Vials:</span> {result.counted_vials}
          </p>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            <span className="font-semibold">Percentage To Estimation:</span> {result.percentage}%
          </p>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-blue-600 dark:text-blue-400 hover:underline focus:outline-none"
        >
          {isExpanded ? 'Hide Details' : 'Show More'}
        </button>
        {isExpanded && (
          <div className="space-y-2">
            <p className="text-md text-gray-700 dark:text-gray-300">
              <span className="font-semibold">Lot ID:</span> {result.lot_id}
            </p>
            <p className="text-md text-gray-700 dark:text-gray-300">
              <span className="font-semibold">Order Number:</span> {result.order_number}
            </p>
            <p className="text-md text-gray-700 dark:text-gray-300">
              <span className="font-semibold">Tray Number:</span> {result.tray_number}
            </p>
          </div>
        )}
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-auto">
          {formatLocalDateTime(result.created_at)}
        </p>
      </div>
    </div>
  );
};

export default ResultsList;