import { useState } from 'react';
import UploadForm from '../components/UploadForm';
import ResultDisplay from '../components/ResultDisplay';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Home: React.FC = () => {
  const [result, setResult] = useState<{
    imageUrl: string;
    countedVials: number;
    percentage: string;
  } | null>(null);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-3xl">
          <div className="bg-white shadow-md rounded-lg p-8">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">Vial Counting Platform</h1>
            <UploadForm onResult={setResult} />
          </div>

          {result && (
            <ResultDisplay
              imageUrl={result.imageUrl}
              countedVials={result.countedVials}
              percentage={result.percentage}
            />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
