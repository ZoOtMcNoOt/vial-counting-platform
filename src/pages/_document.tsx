import Document, { Html, Head, Main, NextScript } from 'next/document';
import React from 'react';

class MyDocument extends Document {
  render() {
    const setInitialTheme = `
      (function() {
        try {
          const storedTheme = localStorage.getItem('theme');
          if (storedTheme === 'dark') {
            document.documentElement.classList.add('dark');
          } else if (storedTheme === 'light') {
            document.documentElement.classList.remove('dark');
          } else {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            if (prefersDark) {
              document.documentElement.classList.add('dark');
            } else {
              document.documentElement.classList.remove('dark');
            }
          }
        } catch (e) {}
      })();
    `;

    return (
      <Html lang="en">
        <Head>
          <script dangerouslySetInnerHTML={{ __html: setInitialTheme }} />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;