import Head from 'next/head';
import React from 'react';
import Layout from '../components/Layout';
import HowToUse from '../components/HowToUse';

const Home: React.FC = () => {
  return (
    <Layout>
      <Head>
        <title>Home - VialCount Pro</title>
        <meta name="description" content="Welcome to the Vial Counting Platform." />
      </Head>
      <HowToUse />
    </Layout>
  );
};

export default Home;