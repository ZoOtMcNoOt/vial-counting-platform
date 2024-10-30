// src/pages/index.tsx

import { useState } from 'react';
import UploadForm from '../components/UploadForm';
import ImageSlider from '../components/ImageSlider';
import ResultDisplay from '../components/ResultDisplay';
import Header from '../components/Header';
import Footer from '../components/Footer';
import DarkModeToggle from '../components/DarkModeToggle';

const Home: React.FC = () => {
  const [result, setResult] = useState<{
    originalImageUrl: string;
    imageUrl: string;
    countedVials: number;
    percentage: string;
  } | null>(null);

  const handleResult = (data: any) => {
    setResult(data);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      <Header />
<<<<<<< HEAD
      <main className="flex-grow bg-gray-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-3xl">
          <div className="bg-white shadow-md rounded-lg p-8">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">Vial Counting Platform</h1>
=======
      <main className="flex-grow flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 w-full">
        {result && (
          <div className="w-full flex justify-center">
            <ImageSlider
              beforeImage={result.originalImageUrl}
              afterImage={result.imageUrl}
            />
          </div>
        )}

        <div className="w-full max-w-5xl mt-8 flex flex-col md:flex-row items-stretch justify-between">
          {/* Upload Form */}
          <div className="w-full md:w-1/2 flex-grow">
>>>>>>> 3079c15623a14fc75cd22cb7ecc600b04e708a04
            <UploadForm onResult={handleResult} />
          </div>

          {/* Result Display */}
          {result && (
<<<<<<< HEAD
            <>
              <ImageSlider
                beforeImage={result.originalImageUrl} // Correct path from API
                afterImage={result.imageUrl}         // Correct path from API
              />
              <ResultDisplay
                imageUrl={result.imageUrl}           // URL for processed image
                countedVials={result.countedVials}
                percentage={result.percentage}
              />
            </>
=======
            <div className="w-full md:w-1/2 mt-8 md:mt-0 md:ml-8 flex-grow">
              <ResultDisplay
                imageUrl={result.imageUrl}
                countedVials={result.countedVials}
                percentage={result.percentage}
              />
            </div>
>>>>>>> 3079c15623a14fc75cd22cb7ecc600b04e708a04
          )}
        </div>
      </main>
      <Footer />
      <DarkModeToggle />
    </div>
  );
};

export default Home;
