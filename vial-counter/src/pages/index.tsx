import { useState } from 'react';
import UploadForm from '../components/UploadForm';
import ImageSlider from '../components/ImageSlider';
import ResultDisplay from '../components/ResultDisplay';
import Header from '../components/Header';
import Footer from '../components/Footer';

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
            <UploadForm onResult={handleResult} />
          </div>

          {/* Result Display */}
          {result && (
            <div className="w-full md:w-1/2 mt-8 md:mt-0 md:ml-8 flex-grow">
              <ResultDisplay
                imageUrl={result.imageUrl}
                countedVials={result.countedVials}
                percentage={result.percentage}
              />
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
