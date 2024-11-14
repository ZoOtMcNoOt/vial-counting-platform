import React, { useState } from 'react';
import axios from 'axios';
import { useDropzone, Accept } from 'react-dropzone';
import type { Result, ProcessedImageResult } from '../types';

interface UploadFormProps {
  onResult: (data: Result) => void;
}

const UploadForm: React.FC<UploadFormProps> = ({ onResult }) => {
  const [image, setImage] = useState<File | null>(null);
  const [expectedCount, setExpectedCount] = useState<string>('');
  const [processedResult, setProcessedResult] = useState<ProcessedImageResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      setImage(acceptedFiles[0]);
      setError('');
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/png': ['.png'],
    } as Accept,
    multiple: false,
  });

  // Function to handle the form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!image) {
      setError('Please upload an image.');
      return;
    }

    if (!expectedCount || isNaN(Number(expectedCount)) || Number(expectedCount) <= 0) {
      setError('Please enter a valid expected count.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('image', image);
      formData.append('expectedCount', expectedCount);

      const response = await axios.post<ProcessedImageResult>('/api/process-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Set the processed result to display to the user
      setProcessedResult(response.data);
    } catch (err: any) {
      // Handle errors
      setError(
        err.response?.data?.error || 'An error occurred while processing the image.'
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle approval
  const handleApprove = async () => {
    if (!processedResult) return;

    setLoading(true);
    setError('');

    try {
      const payload = {
        original_image_base64: processedResult.original_image_base64,
        processed_image_base64: processedResult.processed_image_base64,
        countedVials: processedResult.counted_vials, // Changed to countedVials
        percentage: parseFloat(processedResult.percentage),
      };

      const response = await axios.post<Result>('/api/save-result', payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      alert('Result approved and saved successfully!');
      setProcessedResult(null);
      setImage(null);
      setExpectedCount('');
      onResult(response.data);
    } catch (err: any) {
      setError(
        err.response?.data?.error || 'An error occurred while saving the result.'
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setProcessedResult(null);
    setImage(null);
    setExpectedCount('');
    setError('');
  };

  console.log('Processed Result:', processedResult);

  return (
    <div className="flex justify-center w-full">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex flex-col items-center"
      >
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6 text-center">
          Upload Tray Image
        </h2>

        {/* Drag and Drop Area */}
        <div
          {...getRootProps()}
          className={`w-full p-4 border-2 border-dashed rounded-md cursor-pointer mb-4 ${
            isDragActive ? 'border-blue-500' : 'border-gray-300'
          }`}
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <p className="text-blue-500">Drop the image here...</p>
          ) : (
            <p>Drag & drop an image here, or click to select one</p>
          )}
        </div>

        {/* Display Selected File */}
        {image && (
          <div className="mb-4 text-center">
            <p className="text-gray-700 dark:text-gray-300">Selected File:</p>
            <p className="text-green-600 dark:text-green-400">{image.name}</p>
          </div>
        )}

        {/* Expected Count Input */}
        <input
          type="number"
          placeholder="Expected Vial Count"
          value={expectedCount}
          onChange={(e) => setExpectedCount(e.target.value)}
          className="mb-4 p-2 border rounded w-full"
        />

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Processing...' : 'Submit'}
        </button>

        {/* Approve and Clear Buttons after Processing */}
        {processedResult && (
          <div className="flex space-x-4 mt-4">
            <button
              type="button"
              onClick={handleApprove}
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Approve
            </button>
            <button
              type="button"
              onClick={handleClear}
              disabled={loading}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Clear
            </button>
          </div>
        )}

        {/* Error Message */}
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </form>
    </div>
  );
};

export default UploadForm;