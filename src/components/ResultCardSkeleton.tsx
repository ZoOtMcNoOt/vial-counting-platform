const ResultCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden flex flex-col h-full animate-pulse">
      <div className="h-48 md:h-60 lg:h-64 bg-gray-200 dark:bg-gray-700" />
      <div className="flex-grow p-4">
        <div className="mb-2 space-y-3">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/4" />
        </div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mt-4" />
      </div>
    </div>
  );
};

export default ResultCardSkeleton;