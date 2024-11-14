import Head from 'next/head';
import React, { useState } from 'react';
import UploadForm from '../components/UploadForm';
import ImageSlider from '../components/ImageSlider';
import ResultDisplay from '../components/ResultDisplay';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Upload: React.FC = () => {
  const [result, setResult] = useState<{
    id: number;
    original_image_url: string;
    processed_image_url: string;
    counted_vials: number;
    percentage: number;
    created_at: string;
  } | null>(null);

  const handleResult = (data: any) => {
    setResult(data);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      <Head>
        <title>Upload - Vial Counting Platform</title>
        <meta name="description" content="Upload and process tray images to count vials." />
      </Head>
      <Header />

      <main className="flex-grow flex flex-col items-center pt-20 pb-12 px-4 sm:px-6 lg:px-8 w-full">
        {/* Conditionally Render Image Slider Only When Result Exists */}
        {result && (
          <div className="w-full flex justify-center mb-8">
            <ImageSlider 
              beforeImage={result.original_image_url} 
              afterImage={result.processed_image_url} 
              className="w-full max-w-lg"
            />
          </div>
        )}

        {/* Upload Form and Result Display */}
        <div className="w-full max-w-5xl mt-8 flex flex-col md:flex-row items-center md:items-start justify-center md:justify-between space-y-8 md:space-y-0 md:space-x-8">
          {/* Upload Form */}
          <div className={`w-full ${result ? 'md:w-1/2' : 'flex justify-center'}`}>
            <UploadForm onResult={handleResult} />
          </div>

          {/* Result Display */}
          {result && (
            <div className="w-full md:w-1/2 flex justify-center">
              <ResultDisplay
                imageUrl={result.processed_image_url}
                countedVials={result.counted_vials}
                percentage={result.percentage.toString()}
                className="w-full max-w-lg"
              />
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Upload;