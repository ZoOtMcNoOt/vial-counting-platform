import React, { useState } from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';
import UploadForm from '../components/UploadForm';
import ResultDisplay from '../components/ResultDisplay';
import type { ProcessedImageResult } from '../types';

const Upload: React.FC = () => {
  const [result, setResult] = useState<ProcessedImageResult | null>(null);
  const [showForm, setShowForm] = useState(true);

  const handleResult = (data: ProcessedImageResult) => {
    if (data) {
      setResult(data);
      setShowForm(false);
    }
  };

  const handleClear = () => {
    setResult(null);
    setShowForm(true);
  };

  return (
    <Layout>
      <Head>
        <title>Upload - Vial Counting Platform</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
        <div className="text-center sm:text-left mb-8">
        </div>

        <div className="flex flex-col items-center space-y-8">
          {showForm && (
            <div className="w-full max-w-2xl transition-all duration-300 ease-in-out">
              <UploadForm onResult={handleResult} />
            </div>
          )}

          {result && (
            <div className="w-full max-w-4xl transition-all duration-300 ease-in-out">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <ResultDisplay
                  originalImageBase64={result.original_image_base64}
                  processedImageBase64={result.processed_image_base64}
                  countedVials={result.counted_vials}
                  percentage={Number(result.percentage)} 
                  lot_id={result.lot_id}
                  order_number={result.order_number}
                  tray_number={result.tray_number}
                  onClear={handleClear}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Upload;