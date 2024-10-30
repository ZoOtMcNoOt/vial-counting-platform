// src/components/UploadForm.tsx

import { useState } from 'react';
import axios from 'axios';

interface ResultData {
  originalImageUrl: string;
  imageUrl: string;
  countedVials: number;
  percentage: string;
}

interface UploadFormProps {
  onResult: (data: ResultData) => void;
}

const UploadForm: React.FC<UploadFormProps> = ({ onResult }) => {
  const [image, setImage] = useState<File | null>(null);
  const [expectedCount, setExpectedCount] = useState<number | ''>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!image) {
      setError('Please upload an image.');
      return;
    }

    if (!expectedCount || isNaN(expectedCount) || expectedCount <= 0) {
      setError('Please enter a valid expected count.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('image', image); // No renaming here
      formData.append('expectedCount', expectedCount.toString());

      const response = await axios.post<ResultData>('/api/process-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      onResult(response.data);
    } catch (err: any) {
<<<<<<< HEAD
      setError(err.response?.data?.error || 'An error occurred while processing the image.');
=======
      setError(
        err.response?.data?.error ??
          'An error occurred while processing the image.'
      );
>>>>>>> 3079c15623a14fc75cd22cb7ecc600b04e708a04
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="h-full flex flex-col justify-center bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
    >
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6 text-center">
        Upload Tray Image
      </h2>
      <div className="flex-grow flex flex-col justify-center space-y-4">
        <div>
          <label className="block text-gray-700 dark:text-gray-300 mb-2">
            Tray Image:
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className={`block w-full text-sm text-gray-500 dark:text-gray-400
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 dark:file:bg-gray-700 file:text-red-700 dark:file:text-red-400
              hover:file:bg-blue-100 dark:hover:file:bg-gray-600
              transition-all duration-200
              focus:outline-none focus:ring-2 ${
                error && !image
                  ? 'focus:ring-red-500 border-red-500'
                  : 'focus:ring-blue-500 border-gray-300 dark:border-gray-600'
              }`}
          />
        </div>

        <div>
          <label className="block text-gray-700 dark:text-gray-300 mb-2">
            Expected Vial Count:
          </label>
          <input
            type="number"
            value={expectedCount}
            onChange={(e) => {
              const value = e.target.value;
              setExpectedCount(value ? parseInt(value) : '');
            }}
            className={`w-full px-4 py-2 border rounded-md
              ${
                error && (!expectedCount || isNaN(expectedCount) || expectedCount <= 0)
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
              }
              bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
              focus:outline-none transition-all duration-200`}
            placeholder="Enter expected count"
            min="1"
            required
          />
        </div>

        {error && (
          <p className="text-red-500 dark:text-red-400 text-sm mt-2">{error}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-6 w-full flex items-center justify-center px-4 py-2 bg-red-600 dark:bg-red-700 text-white rounded-md hover:bg-red-700 dark:hover:bg-red-800
                             focus:outline-none focus:ring-2 focus:ring-red-500
                             transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <svg
              className="animate-spin h-5 w-5 text-white mr-2"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              ></path>
            </svg>
            Processing...
          </>
        ) : (
          'Submit'
        )}
      </button>
    </form>
  );
};

export default UploadForm;
