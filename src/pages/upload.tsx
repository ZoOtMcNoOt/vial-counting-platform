import React, { useState } from 'react';
import Head from 'next/head';
import UploadForm from '../components/UploadForm';
import ResultDisplay from '../components/ResultDisplay';
import Header from '../components/Header';
import Footer from '../components/Footer';
import TeamLinks from '../components/TeamLinks';

const Upload: React.FC = () => {
  const [result, setResult] = useState<any>(null);
  const [showForm, setShowForm] = useState(true);

  const handleResult = (data: any) => {
    if (data) {
      setResult(data);
      setShowForm(false);
    }
  };

  const handleClear = () => {
    setResult(null); // Clear the results
    setShowForm(true); // Show the form again
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      <Head>
        <title>Upload - Vial Counting Platform</title>
        <meta name="description" content="Upload and process tray images to count vials." />
      </Head>
      <Header />
      <main className="flex-grow flex flex-col items-center pt-20 pb-12 px-4 sm:px-6 lg:px-8 w-full">
        {showForm && <UploadForm onResult={handleResult} />}
        
        {result && (
          <div className="w-full md:w-1/2 flex justify-center mt-8">
            <ResultDisplay
              originalImageBase64={result.original_image_base64}
              processedImageBase64={result.processed_image_base64}
              countedVials={result.counted_vials}
              percentage={result.percentage.toString()}
              onClear={handleClear}
            />
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Upload;