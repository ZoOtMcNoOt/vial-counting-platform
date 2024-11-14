/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./public/**/*.html",
  ],
  theme: {
    extend: {
      animation: {
        'bounce-slow': 'bounce 3s infinite',
      },
      width: {
        '48': '12rem', // For w-48 class
      },
      height: {
        '40': '10rem', // For h-40 class
      },
    },
  },
  plugins: [],
};
