import React, { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import { useDropzone, FileRejection, Accept } from 'react-dropzone';

interface UploadFormProps {
  onResult: (result: any) => void;
}

const UploadForm: React.FC<UploadFormProps> = ({ onResult }) => {
  const [image, setImage] = useState<File | null>(null);
  const [expectedCount, setExpectedCount] = useState<string>('');
  const [lotId, setLotId] = useState<string>('');
  const [orderNumber, setOrderNumber] = useState<string>('');
  const [trayNumber, setTrayNumber] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    console.log('UploadForm rendered');
  }, []);

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles[0]) {
      const file = acceptedFiles[0];
      setImage(file);
      console.log('Image selected:', file);
    }
  };

  const onDropRejected = useCallback((fileRejections: FileRejection[]) => {
    if (fileRejections.length > 0) {
      const rejection = fileRejections[0];
      const message = rejection.errors.map(e => e.message).join(', ');
      setError(`File rejection: ${message}`);
      console.warn('File rejected:', rejection);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDropRejected,
    accept: { 'image/*': [] },
    multiple: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submission initiated.');

    if (loading) {
      console.log('Form is already submitting.');
      return;
    }

    if (!image) {
      setError('Please upload an image.');
      console.warn('Form submission failed: No image uploaded.');
      return;
    }

    if (!expectedCount || isNaN(Number(expectedCount)) || Number(expectedCount) <= 0) {
      setError('Please enter a valid expected count.');
      console.warn('Form submission failed: Invalid expected count.');
      return;
    }

    if (!lotId.trim()) {
      setError('Please enter a Lot ID.');
      console.warn('Form submission failed: Missing Lot ID.');
      return;
    }

    if (!orderNumber.trim()) {
      setError('Please enter an Order Number.');
      console.warn('Form submission failed: Missing Order Number.');
      return;
    }

    if (!trayNumber.trim()) {
      setError('Please enter a Tray Number.');
      console.warn('Form submission failed: Missing Tray Number.');
      return;
    }

    setError('');
    setLoading(true);
    console.log('Submitting data:', { image: image.name, expectedCount, lotId, orderNumber, trayNumber });

    try {
      const formData = new FormData();
      formData.append('image', image);
      formData.append('expectedCount', expectedCount);
      formData.append('lotId', lotId);
      formData.append('orderNumber', orderNumber);
      formData.append('trayNumber', trayNumber);

      const response = await axios.post('/api/process-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('API response received:', response.data);
      onResult(response.data);
    } catch (err: any) {
      setError(
        err.response?.data?.error || 'An error occurred while processing the image.'
      );
      console.error('Error during API call:', err);
    } finally {
      setLoading(false);
      console.log('Loading state set to false.');
    }
  };

  const handleClear = () => {
    setImage(null);
    setExpectedCount('');
    setLotId('');
    setOrderNumber('');
    setTrayNumber('');
    setError('');
    console.log('Form cleared.');
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

        {/* File Input Label */}
        <div
          {...getRootProps()}
          className={`w-full p-4 border-2 border-dashed rounded-md cursor-pointer mb-4 ${
            isDragActive ? 'border-blue-500' : 'border-gray-300'
          }`}
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <p className="text-center text-blue-500">Drop the image here...</p>
          ) : (
            <p className="text-center text-gray-700">
              Drag & drop an image here, or click to select an image
            </p>
          )}
        </div>

        {/* File Name Display */}
        {image && (
          <div className="w-full mb-4">
            <p className="text-gray-700">Selected File: {image.name}</p>
          </div>
        )}

        {/* Form Fields */}
        <div className="w-full">
          <div className="flex mb-4">
            {/* Expected Count */}
            <div className="w-1/2 pr-2">
              <label htmlFor="expectedCount" className="block text-sm font-medium text-gray-700">
                Expected Count
              </label>
              <input
                type="number"
                id="expectedCount"
                value={expectedCount}
                onChange={(e) => setExpectedCount(e.target.value)}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
              />
            </div>

            {/* Tray Number */}
            <div className="w-1/2 pl-2">
              <label htmlFor="trayNumber" className="block text-sm font-medium text-gray-700">
                Tray Number
              </label>
              <input
                type="text"
                id="trayNumber"
                value={trayNumber}
                onChange={(e) => setTrayNumber(e.target.value)}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
              />
            </div>
          </div>

          <div className="flex mb-4">
            {/* Order Number */}
            <div className="w-1/2 pr-2">
              <label htmlFor="orderNumber" className="block text-sm font-medium text-gray-700">
                Order Number
              </label>
              <input
                type="text"
                id="orderNumber"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
              />
            </div>

            {/* Lot ID */}
            <div className="w-1/2 pl-2">
              <label htmlFor="lotId" className="block text-sm font-medium text-gray-700">
                Lot ID
              </label>
              <input
                type="text"
                id="lotId"
                value={lotId}
                onChange={(e) => setLotId(e.target.value)}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* Submit and Clear buttons */}
        <div className="flex items-center justify-between w-full">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Submit
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          >
            Clear
          </button>
        </div>

        {/* Error Message */}
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </form>
    </div>
  );
};

export default UploadForm;