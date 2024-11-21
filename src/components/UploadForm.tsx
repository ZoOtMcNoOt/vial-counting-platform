import React, { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import { useDropzone, FileRejection, Accept } from 'react-dropzone';

interface UploadFormProps {
  onResult: (result: any) => void;
}

const UploadForm: React.FC<UploadFormProps> = ({ onResult }) => {
  const [image, setImage] = useState<File | null>(null);
  const [expectedCount, setExpectedCount] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    console.log('UploadForm rendered');
  }, []);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setImage(acceptedFiles[0]);
      setError('');
      console.log('Image selected:', acceptedFiles[0].name);
    }
  }, []);

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
    accept: {
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/png': ['.png'],
      'image/heic': ['.heic'],
      'image/heif': ['.heif'],
    } as Accept,
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

    if (!expectedCount || isNaN(Number(expectedCount)) || Number(expectedCount) < 0) {
      setError('Please enter a valid expected count.');
      console.warn('Form submission failed: Invalid expected count.');
      return;
    }

    setError('');
    setLoading(true);
    console.log('Submitting data:', { image: image.name, expectedCount });

    try {
      const formData = new FormData();
      formData.append('image', image);
      formData.append('expectedCount', expectedCount);

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
        <label htmlFor="expected-count" className="w-full mb-4">
          <span className="sr-only">Expected Vial Count</span>
          <input
            type="number"
            id="expected-count"
            placeholder="Expected Vial Count"
            value={expectedCount}
            onChange={(e) => setExpectedCount(e.target.value)}
            className="p-2 border rounded w-full 
                       text-gray-700 dark:text-white
                       placeholder-gray-500 dark:placeholder-gray-400 
                       bg-white dark:bg-gray-700 
                       border-gray-300 dark:border-gray-600 
                       focus:outline-none focus:ring-2 focus:ring-blue-500 
                       focus:border-transparent"
            aria-required="true"
            required
          />
        </label>

        {/* Button Container */}
        <div className="flex flex-row gap-4 w-full">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : 'Submit'}
          </button>

          <button
            type="button"
            onClick={handleClear}
            disabled={loading}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Clear Upload
          </button>
        </div>

        {/* Error Message */}
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </form>
    </div>
  );
};

export default UploadForm;