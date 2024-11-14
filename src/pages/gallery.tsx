import Head from 'next/head';
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ResultsList from '../components/ResultsList';

const Gallery: React.FC = () => {
  return (
    <html lang="en"> 
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white pt-16">
      <Head>
        <title>Gallery - Vial Counting Platform</title> 
        <meta name="description" content="View all processed tray images and results." />
      </Head>
      <Header />
      <main className="flex-grow flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 w-full">
        <h1 className="text-3xl font-bold mb-8">Gallery</h1>
        <ResultsList />
      </main>
      <Footer />
    </div>
    </html>
  );
};

export default Gallery;
