import React, { useEffect } from 'react';
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

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <ResultCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="mt-8 w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.pages.map((page) =>
          page.results.map((result) => (
            <div
              key={result.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden flex flex-col h-full"
            >
              <div className="h-48 md:h-60 lg:h-64">
                <ImageSlider
                  beforeImage={result.original_image_url}
                  afterImage={result.processed_image_url}
                />
              </div>
              <div className="flex-grow p-4">
                <div className="mb-2">
                  <p className="text-lg text-gray-800 dark:text-gray-200">
                    <span className="font-semibold">Counted Vials:</span>{' '}
                    {result.counted_vials}
                  </p>
                  <p className="text-lg text-gray-800 dark:text-gray-200">
                    <span className="font-semibold">Percentage:</span>{' '}
                    {result.percentage}%
                  </p>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {formatLocalDateTime(result.created_at)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
      {hasNextPage && (
        <div ref={ref} className="flex justify-center mt-8">
          {isFetching ? (
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
          ) : null}
        </div>
      )}
    </div>
  );
};

export default ResultsList;