import Head from 'next/head';
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import HowToUse from '../components/HowToUse';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      <Head>
        <title>How to Use - Vial Counting Platform</title>
        <meta name="description" content="Learn how to use the Vial Counting Platform effectively." />
      </Head>
      <Header />
      <main className="flex-grow flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 w-full">
        {/* How to Use Section */}
        <HowToUse />
      </main>
      <Footer />
    </div>
  );
};

export default Home;