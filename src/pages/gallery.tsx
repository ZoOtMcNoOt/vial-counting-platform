import Head from 'next/head';
import React from 'react';
import Layout from '../components/Layout';
import ResultsList from '../components/ResultsList';

const Gallery: React.FC = () => {
  return (
    <Layout>
      <Head>
        <title>Gallery - Vial Counting Platform</title>
        <meta name="description" content="View all processed tray images and results." />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
        <div className="text-center sm:text-left mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold 
                         text-gray-900 dark:text-gray-100
                         transition-colors duration-200">
            Gallery
          </h1>
          <p className="mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-400">
            View all processed tray images and their results
          </p>
        </div>

        <div className="min-h-[200px]">
          <ResultsList />
        </div>
      </div>
    </Layout>
  );
};

export default Gallery;
