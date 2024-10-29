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
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-3xl">
          <div className="bg-white shadow-md rounded-lg p-8">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">Vial Counting Platform</h1>
            <UploadForm onResult={handleResult} />
          </div>

          {result && (
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
          )}
        </div>
      </main>
      <Footer />
      <DarkModeToggle />
    </div>
  );
};

export default Home;
