import React from 'react';
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { ThemeProvider } from '../context/ThemeContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/react"

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <Head>
        <link rel="icon" href="/images/favicon/favicon.webp" type="image/webp" />
      </Head>
      <ThemeProvider>
        <Component {...pageProps} />
        <SpeedInsights/>
        <Analytics/>
      </ThemeProvider>
      
    </QueryClientProvider>
    
  );
}

export default MyApp;
