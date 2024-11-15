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
      </Head>
      <h1 className="text-3xl font-bold mb-8">Gallery</h1>
      <ResultsList />
    </Layout>
  );
};

export default Gallery;
