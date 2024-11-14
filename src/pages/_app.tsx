import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { ThemeProvider } from '../context/ThemeContext';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <html lang="en"> 
    <ThemeProvider>
      <Component {...pageProps} />
    </ThemeProvider>
    </html>
  );
}

export default MyApp;
