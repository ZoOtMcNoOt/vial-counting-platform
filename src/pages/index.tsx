import { useState } from 'react';
import UploadForm from '../components/UploadForm';
import ImageSlider from '../components/ImageSlider';
import ResultDisplay from '../components/ResultDisplay';
import Header from '../components/Header';
import Footer from '../components/Footer';
// import ResultsList from '../components/ResultsList'; // Remove or comment out

const Home: React.FC = () => {
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
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white pt-16"> {/* Added pt-16 for fixed header */}
      <Header />
      <main className="flex-grow flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 w-full">
        {result && (
          <div className="w-full flex justify-center">
            <ImageSlider beforeImage={result.original_image_url} afterImage={result.processed_image_url} />
          </div>
        )}

        <div className="w-full max-w-5xl mt-8 flex flex-col md:flex-row items-stretch justify-between space-y-8 md:space-y-0">
          {/* Upload Form */}
          <div className="w-full md:w-1/2 flex-grow">
            <UploadForm onResult={handleResult} />
          </div>

          {/* Result Display */}
          {result && (
            <div className="w-full md:w-1/2 flex-grow">
              <ResultDisplay
                imageUrl={result.processed_image_url}
                countedVials={result.counted_vials}
                percentage={result.percentage.toString()}
              />
            </div>
          )}
        </div>

        {/* Remove or comment out the following lines */}
        {/* <ResultsList /> */}
      </main>
      <Footer />
    </div>
  );
};

export default Home;