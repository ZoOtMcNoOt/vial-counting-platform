import React, { useState } from 'react';
import Head from 'next/head';
import UploadForm from '../components/UploadForm';
import ImageSlider from '../components/ImageSlider';
import ResultDisplay from '../components/ResultDisplay';
import Header from '../components/Header';
import Footer from '../components/Footer';
import type { Result } from '../types';

const Upload: React.FC = () => {
  const [result, setResult] = useState<Result | null>(null);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      <Head>
        <title>Upload - Vial Counting Platform</title>
        <meta name="description" content="Upload and process tray images to count vials." />
      </Head>
      <Header />
      <main className="flex-grow flex flex-col items-center pt-20 pb-12 px-4 sm:px-6 lg:px-8 w-full">
        <UploadForm onResult={setResult} />

        {result && (
          <div className="w-full md:w-1/2 flex justify-center">
            <ResultDisplay
              originalImageUrl={result.original_image_url}
              processedImageUrl={result.processed_image_url}
              countedVials={result.counted_vials}
              percentage={result.percentage.toString()}
              className="your-class-name"
            />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Upload;