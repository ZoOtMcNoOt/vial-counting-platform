import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { ThemeProvider } from '../context/ThemeContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SpeedInsights } from "@vercel/speed-insights/next"

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <link rel="icon" href="/images/favicon/favicon.webp" type="image/webp" />
      </Head>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <Component {...pageProps} />
        </QueryClientProvider>
      </ThemeProvider>
      <SpeedInsights/>
    </>
  );
}

export default MyApp;
