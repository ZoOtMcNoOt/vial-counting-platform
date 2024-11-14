import React, { useState, useCallback } from 'react';
import axios from 'axios';
import { useDropzone, Accept } from 'react-dropzone';

interface ResultData {
  id: number;
  original_image_url: string;
  processed_image_url: string;
  counted_vials: number;
  percentage: number;
  created_at: string;
}

interface UploadFormProps {
  onResult: (data: ResultData) => void;
}

const UploadForm: React.FC<UploadFormProps> = ({ onResult }) => {
  const [image, setImage] = useState<File | null>(null);
  const [expectedCount, setExpectedCount] = useState<number | ''>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // Define the accepted file types using the Accept type from react-dropzone
  const acceptedFileTypes: Accept = {
    'image/jpeg': ['.jpg', '.jpeg'],
    'image/png': ['.png'],
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      setImage(acceptedFiles[0]);
      setError('');
    }
  }, []);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject,
    acceptedFiles,
    fileRejections,
  } = useDropzone({
    onDrop,
    accept: acceptedFileTypes, // Use the object instead of a string
    multiple: false,
    maxFiles: 1,
  });

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
      formData.append('image', image);
      formData.append('expectedCount', expectedCount.toString());

      const response = await axios.post<ResultData>('/api/process-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      onResult(response.data);
    } catch (err: any) {
      setError(
        err.response?.data?.error ||
          'An error occurred while processing the image.'
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center w-full">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex flex-col items-center"
      >
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6 text-center">
          Upload Tray Image
        </h2>

        {/* Dropzone */}
        <div
          {...getRootProps()}
          className={`w-full mb-4 p-6 border-2 border-dashed rounded-md cursor-pointer
            ${
              isDragActive
                ? 'border-blue-400 bg-blue-50'
                : 'border-gray-300 dark:border-gray-600'
            }
            ${
              isDragReject
                ? 'border-red-400 bg-red-50'
                : ''
            }
            transition-all duration-200`}
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <p className="text-blue-500">Drop the image here...</p>
          ) : isDragReject ? (
            <p className="text-red-500">Unsupported file type...</p>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">
              Drag and drop a .jpg or .png image here, or click to select one
            </p>
          )}
        </div>

        {/* Display Selected File Name */}
        {image && (
          <div className="w-full mb-4 text-center">
            <p className="text-gray-700 dark:text-gray-300">Selected File: {image.name}</p>
          </div>
        )}

        {/* Expected Vial Count Input */}
        <div className="w-full mb-4">
          <label htmlFor="expectedCount" className="block text-gray-700 dark:text-gray-300 mb-2">
            Expected Vial Count:
          </label>
          <input
            id="expectedCount"
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

        {/* Error Message */}
        {error && (
          <p className="text-red-500 dark:text-red-400 text-sm mt-2">{error}</p>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full flex items-center justify-center px-4 py-2 bg-red-600 dark:bg-red-700 text-white rounded-md hover:bg-red-700 dark:hover:bg-red-800
                     focus:outline-none focus:ring-2 focus:ring-red-500
                     transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed relative"
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
    </div>
  );
};

export default UploadForm;